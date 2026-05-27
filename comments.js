/* ============================================================
   NWFA review widget — drop-in comment layer for any build.
   Add to a page with:  <script src="comments.js"></script>
   - Works offline via file:// (stores in localStorage)
   - Pin comments to a spot, or add general notes
   - "Copy for Claude" → paste the text block into the chat
   ============================================================ */
(function () {
  "use strict";
  var FILE = (location.pathname.split("/").pop() || "page") + (location.hash || "");
  var KEY = "nwfacm:" + FILE;
  var data = [];
  try { data = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { data = []; }
  var armed = false;

  function save() { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  /* ---------- styles (prefixed, high z-index) ---------- */
  var css = `
  .nwfacm-fab{position:fixed;right:18px;bottom:18px;z-index:2147483600;background:#161a16;color:#efe9db;
    border:1px solid #6a6452;border-radius:100px;padding:11px 16px;font:600 13px/1 system-ui,sans-serif;
    cursor:pointer;box-shadow:0 8px 26px rgba(0,0,0,.45);display:flex;gap:8px;align-items:center;}
  .nwfacm-fab b{background:#C9602F;color:#fff;border-radius:100px;padding:2px 7px;font-size:11px;}
  .nwfacm-panel{position:fixed;right:18px;bottom:64px;z-index:2147483601;width:330px;max-height:72vh;
    background:#1b1f1b;color:#efe9db;border:1px solid #3a3a32;border-radius:14px;display:none;flex-direction:column;
    box-shadow:0 20px 60px rgba(0,0,0,.55);font:13px/1.45 system-ui,sans-serif;overflow:hidden;}
  .nwfacm-panel.open{display:flex;}
  .nwfacm-hd{padding:13px 15px;border-bottom:1px solid #2a2e2a;display:flex;align-items:center;gap:8px;}
  .nwfacm-hd .t{font-weight:700;font-size:12px;letter-spacing:.02em;}
  .nwfacm-hd .f{color:#8a8a7c;font-size:11px;margin-left:auto;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  .nwfacm-list{overflow:auto;padding:8px 10px;flex:1;}
  .nwfacm-empty{color:#6a6a5e;font-size:12px;padding:16px 6px;text-align:center;}
  .nwfacm-item{background:#23271f;border:1px solid #2f342c;border-radius:9px;padding:9px 10px;margin-bottom:8px;}
  .nwfacm-item .meta{display:flex;gap:6px;align-items:center;margin-bottom:5px;}
  .nwfacm-item .num{background:#C9602F;color:#fff;border-radius:50%;width:18px;height:18px;display:inline-flex;
    align-items:center;justify-content:center;font-size:10px;font-weight:700;flex:0 0 auto;}
  .nwfacm-item .tgt{color:#E0A92E;font-size:10.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  .nwfacm-item .del{margin-left:auto;color:#7a7a6c;cursor:pointer;border:0;background:none;font-size:14px;line-height:1;}
  .nwfacm-item .txt{color:#e6e1d2;font-size:12.5px;white-space:pre-wrap;word-break:break-word;}
  .nwfacm-ft{border-top:1px solid #2a2e2a;padding:10px;display:flex;flex-direction:column;gap:8px;}
  .nwfacm-pinhint{display:none;color:#E0A92E;font-size:11px;font-weight:600;}
  .nwfacm-pinhint.on{display:block;}
  .nwfacm-ta{width:100%;min-height:46px;resize:vertical;background:#0f120f;color:#efe9db;border:1px solid #3a3a32;
    border-radius:8px;padding:8px 9px;font:13px/1.4 system-ui,sans-serif;}
  .nwfacm-row{display:flex;gap:7px;}
  .nwfacm-btn{flex:1;background:#2f342c;color:#efe9db;border:1px solid #3a3a32;border-radius:8px;padding:8px;
    font:600 12px system-ui,sans-serif;cursor:pointer;}
  .nwfacm-btn:hover{border-color:#6a6452;}
  .nwfacm-btn.primary{background:#C9602F;border-color:#C9602F;color:#fff;}
  .nwfacm-btn.pin{background:#2a4736;border-color:#2a4736;}
  .nwfacm-btn.pin.on{background:#E0A92E;color:#23301f;border-color:#E0A92E;}
  .nwfacm-pin{position:absolute;z-index:2147483500;transform:translate(-50%,-50%);width:24px;height:24px;border-radius:50%;
    background:#C9602F;color:#fff;border:2px solid #fff;font:700 12px system-ui,sans-serif;display:flex;align-items:center;
    justify-content:center;box-shadow:0 3px 10px rgba(0,0,0,.4);cursor:pointer;}
  body.nwfacm-arming, body.nwfacm-arming *{cursor:crosshair !important;}
  `;
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  /* ---------- DOM ---------- */
  var fab = el("button", "nwfacm-fab", '💬 review <b class="nwfacm-count">0</b>');
  var panel = el("div", "nwfacm-panel");
  panel.innerHTML =
    '<div class="nwfacm-hd"><span class="t">review notes</span><span class="f"></span></div>' +
    '<div class="nwfacm-list"></div>' +
    '<div class="nwfacm-ft">' +
      '<div class="nwfacm-pinhint">📍 click a spot on the page…</div>' +
      '<textarea class="nwfacm-ta" placeholder="type a note, then Add — or pin it to a spot"></textarea>' +
      '<div class="nwfacm-row">' +
        '<button class="nwfacm-btn pin">📍 pin a spot</button>' +
        '<button class="nwfacm-btn primary nwfacm-add">add note</button>' +
      '</div>' +
      '<div class="nwfacm-row">' +
        '<button class="nwfacm-btn nwfacm-copy">copy for Claude</button>' +
        '<button class="nwfacm-btn nwfacm-clear">clear</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(fab);
  document.body.appendChild(panel);
  panel.querySelector(".f").textContent = FILE;

  var listEl = panel.querySelector(".nwfacm-list");
  var taEl = panel.querySelector(".nwfacm-ta");
  var pinBtn = panel.querySelector(".nwfacm-btn.pin");
  var pinHint = panel.querySelector(".nwfacm-pinhint");
  var pendingPin = null; // {x,y,label}

  fab.addEventListener("click", function () { panel.classList.toggle("open"); render(); });
  panel.querySelector(".nwfacm-add").addEventListener("click", addNote);
  panel.querySelector(".nwfacm-copy").addEventListener("click", copyAll);
  panel.querySelector(".nwfacm-clear").addEventListener("click", function () {
    if (data.length && confirm("Clear all notes on this page?")) { data = []; save(); render(); }
  });
  pinBtn.addEventListener("click", function () { armed ? disarm() : arm(); });
  taEl.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") addNote();
  });

  /* ---------- pin mode ---------- */
  function arm() {
    armed = true; pinBtn.classList.add("on"); pinBtn.textContent = "✕ cancel pin";
    pinHint.classList.add("on"); document.body.classList.add("nwfacm-arming");
  }
  function disarm() {
    armed = false; pinBtn.classList.remove("on"); pinBtn.textContent = "📍 pin a spot";
    pinHint.classList.remove("on"); document.body.classList.remove("nwfacm-arming");
  }
  document.addEventListener("click", function (e) {
    if (!armed) return;
    if (panel.contains(e.target) || fab.contains(e.target)) return;
    e.preventDefault(); e.stopPropagation();
    pendingPin = { x: e.pageX, y: e.pageY, label: labelFor(e.target) };
    disarm();
    pinHint.textContent = "📍 pinned to: " + pendingPin.label + " — type the note + Add";
    pinHint.classList.add("on");
    taEl.focus();
  }, true);

  function labelFor(node) {
    var cur = node;
    while (cur && cur !== document.body) {
      if (cur.dataset && cur.dataset.cmLabel) return cur.dataset.cmLabel;
      cur = cur.parentElement;
    }
    var t = (node.innerText || node.textContent || "").trim().replace(/\s+/g, " ").slice(0, 38);
    if (t) return t;
    var c = node.className && typeof node.className === "string" ? "." + node.className.split(" ")[0] : "";
    return node.tagName.toLowerCase() + c;
  }

  /* ---------- data ops ---------- */
  function addNote() {
    var txt = taEl.value.trim();
    if (!txt) { taEl.focus(); return; }
    var item = { id: uid(), text: txt };
    if (pendingPin) { item.x = pendingPin.x; item.y = pendingPin.y; item.label = pendingPin.label; }
    data.push(item);
    pendingPin = null; pinHint.classList.remove("on"); pinHint.textContent = "📍 click a spot on the page…";
    taEl.value = ""; save(); render();
  }

  function copyAll() {
    if (!data.length) { flash(panel.querySelector(".nwfacm-copy"), "no notes"); return; }
    var out = "REVIEW NOTES · " + FILE + "  (" + data.length + ")\n\n";
    data.forEach(function (c, i) {
      out += (i + 1) + ". " + (c.label ? "[" + c.label + "] " : "[general] ") + c.text + "\n";
    });
    var btn = panel.querySelector(".nwfacm-copy");
    var done = function () { data = []; save(); render(); flash(btn, "copied + cleared ✓"); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(out).then(done, function () { legacyCopy(out, done); });
    } else { legacyCopy(out, done); }
  }
  function legacyCopy(text, cb) {
    var t = document.createElement("textarea"); t.value = text;
    t.style.position = "fixed"; t.style.opacity = "0"; document.body.appendChild(t);
    t.select(); try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(t); cb && cb();
  }
  function flash(btn, msg) { var o = btn.textContent; btn.textContent = msg; setTimeout(function () { btn.textContent = o; }, 1200); }

  /* ---------- render ---------- */
  function render() {
    panel.querySelector(".nwfacm-count").textContent = data.length;
    fab.querySelector(".nwfacm-count").textContent = data.length;
    listEl.innerHTML = "";
    if (!data.length) {
      listEl.innerHTML = '<div class="nwfacm-empty">No notes yet.<br>Type one below, or pin it to a spot.</div>';
    } else {
      data.forEach(function (c, i) {
        var it = el("div", "nwfacm-item");
        it.innerHTML =
          '<div class="meta"><span class="num">' + (i + 1) + '</span>' +
          '<span class="tgt">' + (c.label ? esc(c.label) : "general") + '</span>' +
          '<button class="del" title="delete">✕</button></div>' +
          '<div class="txt">' + esc(c.text) + '</div>';
        it.querySelector(".del").addEventListener("click", function () {
          data = data.filter(function (x) { return x.id !== c.id; }); save(); render();
        });
        listEl.appendChild(it);
      });
    }
    // pins on page
    Array.prototype.slice.call(document.querySelectorAll(".nwfacm-pin")).forEach(function (p) { p.remove(); });
    data.forEach(function (c, i) {
      if (c.x == null) return;
      var pin = el("div", "nwfacm-pin", String(i + 1));
      pin.style.left = c.x + "px"; pin.style.top = c.y + "px";
      pin.title = c.text;
      pin.addEventListener("click", function () { if (!panel.classList.contains("open")) fab.click(); });
      document.body.appendChild(pin);
    });
  }

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/[&<>]/g, function (m) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[m]; }); }

  render();
})();
