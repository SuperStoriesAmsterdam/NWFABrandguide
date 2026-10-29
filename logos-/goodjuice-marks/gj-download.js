/* ============================================================================
   gj-download.js  —  SuperStories / Good Juice reusable download section
   ----------------------------------------------------------------------------
   A drop-in download block for Claude artifacts. It renders a titled card with
   a gold button and a status line, and wires it to the artifact `downloads`
   capability (claude.use('downloads')). Degrades to a clear message when the
   page is opened somewhere that cannot save.

   The LOGIC and STYLE live here so the block can be reused across docs; the
   PAYLOAD (the file bytes) is passed in per page, never baked into this file.

   Requires the page to declare the capability at publish time:
       capabilities: { downloads: true }

   Usage
   -----
   <div id="dl"></div>
   <script src="gj-download.js"></script>
   <script>
     GJDownload.mount('#dl', {
       filename: 'goodjuice-marks.zip',
       data: MY_BASE64_STRING,          // base64 | Blob | Uint8Array | () => any
       mime: 'application/zip',         // optional, default application/zip
       title: 'Alle marks downloaden',
       subtitle: 'Zes marks · 1024→64 px · PNG',
       label: 'Download ZIP',           // optional button text
       fallbackNote: 'Je hebt de ZIP ook los in de chat.' // optional
     });
   </script>

   Theming: reads --gj-navy / --gj-gold / --gj-ink / --gj-muted if present,
   else falls back to the Good Juice brand values. Set them on :root to restyle.
   ========================================================================== */
(function (global) {
  "use strict";

  var STYLE_ID = "gj-download-style";
  var CSS = [
    ".gjdl{",
    "  --_navy:var(--gj-navy,#233260); --_navy2:var(--gj-navy-deep,#1a2649);",
    "  --_gold:var(--gj-gold,#DBBB00); --_ink:var(--gj-ink,#eef1f8);",
    "  --_muted:var(--gj-muted,#9aa6c4); --_line:var(--gj-line,rgba(219,187,0,.22));",
    "  font-family:var(--gj-sans,'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif);",
    "  background:linear-gradient(135deg,var(--_navy) 0%,var(--_navy2) 100%);",
    "  border:1px solid var(--_line); border-radius:20px;",
    "  padding:clamp(24px,5vw,38px);",
    "  display:flex; flex-wrap:wrap; align-items:center; gap:20px 28px;",
    "}",
    ".gjdl .gjdl-txt{flex:1 1 240px; min-width:0;}",
    ".gjdl h2{margin:0 0 6px; font-size:1.25rem; font-weight:800; color:var(--_ink);}",
    ".gjdl .gjdl-sub{margin:0; font-size:.9rem; color:var(--_muted);}",
    ".gjdl button.gjdl-get{",
    "  appearance:none; border:0; cursor:pointer;",
    "  background:var(--_gold); color:var(--_navy);",
    "  font:inherit; font-weight:800; font-size:1rem; letter-spacing:.01em;",
    "  padding:16px 26px; border-radius:13px; white-space:nowrap;",
    "  transition:transform .12s ease, box-shadow .12s ease;",
    "  box-shadow:0 8px 22px rgba(219,187,0,.26);",
    "}",
    ".gjdl button.gjdl-get:hover{transform:translateY(-1px); box-shadow:0 12px 28px rgba(219,187,0,.34);}",
    ".gjdl button.gjdl-get:active{transform:translateY(0);}",
    ".gjdl button.gjdl-get:focus-visible{outline:3px solid #fff; outline-offset:3px;}",
    ".gjdl button.gjdl-get[disabled]{opacity:.55; cursor:default; box-shadow:none; transform:none;}",
    ".gjdl .gjdl-note{flex-basis:100%; margin:4px 0 0; font-size:.82rem; color:var(--_muted); min-height:1.2em;}",
    ".gjdl .gjdl-note.warn{color:var(--_gold);}"
  ].join("\n");

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  // base64 (string) -> Uint8Array
  function b64ToBytes(b64) {
    var bin = atob(b64), n = bin.length, out = new Uint8Array(n);
    for (var i = 0; i < n; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  // Resolve options.data (base64 | Blob | Uint8Array | ArrayBuffer | fn) -> Blob
  async function toBlob(data, mime) {
    if (typeof data === "function") data = await data();
    if (data instanceof Blob) return data;
    if (typeof data === "string") return new Blob([b64ToBytes(data)], { type: mime });
    if (data instanceof Uint8Array || data instanceof ArrayBuffer)
      return new Blob([data], { type: mime });
    throw new Error("gj-download: unsupported data type");
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function mount(target, opts) {
    opts = opts || {};
    var root = typeof target === "string" ? document.querySelector(target) : target;
    if (!root) throw new Error("gj-download: target not found");
    injectStyle();

    var mime = opts.mime || "application/zip";
    var fallback = opts.fallbackNote || "";

    root.classList.add("gjdl");
    root.innerHTML = "";
    var txt = el("div", "gjdl-txt");
    if (opts.title) txt.appendChild(el("h2", null, opts.title));
    if (opts.subtitle) {
      var sub = el("p", "gjdl-sub");
      sub.innerHTML = opts.subtitle; // allows &middot; etc.
      txt.appendChild(sub);
    }
    var btn = el("button", "gjdl-get", opts.label || "Download ZIP");
    btn.type = "button";
    var note = el("p", "gjdl-note");
    root.append(txt, btn, note);

    var busy = false;
    btn.addEventListener("click", async function () {
      if (busy) return;
      busy = true;
      note.className = "gjdl-note";
      note.textContent = "";
      var dl = await (global.claude && global.claude.use ? global.claude.use("downloads") : null);
      if (!dl) {
        note.className = "gjdl-note warn";
        note.textContent = "Downloaden kan hier niet. Open deze pagina in de Claude desktop- of web-app.";
        busy = false;
        return;
      }
      try {
        var blob = await toBlob(opts.data, mime);
        var r = await dl.save({ filename: opts.filename || "download", data: blob });
        note.textContent = r && r.status === "saved" ? "Opgeslagen." : "Doorgegeven.";
      } catch (e) {
        if (e && e.code === "declined") {
          note.textContent = "Download geannuleerd.";
        } else {
          note.className = "gjdl-note warn";
          note.textContent = "Lukte niet (" + ((e && e.code) || "onbekend") + ")."
            + (fallback ? " " + fallback : "");
        }
      }
      busy = false;
    });

    return { el: root, button: btn, note: note };
  }

  global.GJDownload = { mount: mount };
})(window);
