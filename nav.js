/* ============================================================
   NWFA page switcher — floating "tabs" across all builds.
   Add with:  <script src="nav.js"></script>
   - Relative links → works offline via file://
   - Pairs with comments.js (this sits bottom-LEFT, comments bottom-RIGHT)
   ============================================================ */
(function () {
  "use strict";
  var PAGES = [
    { f: "home-label.html",       l: "front door",    g: "home" },
    { f: "concepts-home.html",    l: "home concepts", g: "home" },
    { f: "concepts-systems.html", l: "inner pages",   g: "home" },
    { f: "home-day-variants.html", l: "day variants", g: "home" },
    { f: "social-system.html",    l: "refined",       g: "social" },
    { f: "social-system-funk.html", l: "funk",        g: "social" },
    { f: "social-system-brown.html", l: "brown",      g: "social" },
    { f: "social-routes.html",    l: "5 routes",      g: "social" }
  ];
  var here = (location.pathname.split("/").pop() || "").toLowerCase();
  var current = null;
  for (var i = 0; i < PAGES.length; i++) if (PAGES[i].f.toLowerCase() === here) current = PAGES[i];

  var css = `
  .nwfanav-fab{position:fixed;left:18px;bottom:18px;z-index:2147483600;background:#161a16;color:#efe9db;
    border:1px solid #6a6452;border-radius:100px;padding:11px 16px;font:600 13px/1 system-ui,sans-serif;
    cursor:pointer;box-shadow:0 8px 26px rgba(0,0,0,.45);display:flex;gap:9px;align-items:center;}
  .nwfanav-fab .dot{width:8px;height:8px;border-radius:50%;background:#E0A92E;flex:0 0 auto;}
  .nwfanav-fab .cur{color:#cfc4a4;max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  .nwfanav-pop{position:fixed;left:18px;bottom:62px;z-index:2147483601;width:240px;background:#1b1f1b;
    color:#efe9db;border:1px solid #3a3a32;border-radius:14px;display:none;flex-direction:column;padding:8px;
    box-shadow:0 20px 60px rgba(0,0,0,.55);font:13px system-ui,sans-serif;}
  .nwfanav-pop.open{display:flex;}
  .nwfanav-g{font:700 9.5px/1 system-ui,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#6a6452;
    padding:10px 10px 5px;}
  .nwfanav-link{display:flex;align-items:center;gap:9px;padding:9px 10px;border-radius:8px;color:#cfc4a4;
    text-decoration:none;font-weight:600;}
  .nwfanav-link:hover{background:#23271f;color:#fff;}
  .nwfanav-link.active{background:#2a4736;color:#fff;}
  .nwfanav-link .b{width:7px;height:7px;border-radius:50%;background:#3a3a32;flex:0 0 auto;}
  .nwfanav-link.active .b{background:#E0A92E;}
  `;
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var fab = document.createElement("button");
  fab.className = "nwfanav-fab";
  fab.innerHTML = '<span class="dot"></span>pages <span class="cur">· ' + (current ? current.l : "") + "</span>";

  var pop = document.createElement("div");
  pop.className = "nwfanav-pop";
  var html = "";
  var lastG = null;
  PAGES.forEach(function (p) {
    if (p.g !== lastG) { html += '<div class="nwfanav-g">' + p.g + "</div>"; lastG = p.g; }
    var active = current && p.f === current.f ? " active" : "";
    html += '<a class="nwfanav-link' + active + '" href="' + p.f + '"><span class="b"></span>' + p.l + "</a>";
  });
  pop.innerHTML = html;

  document.body.appendChild(fab);
  document.body.appendChild(pop);
  fab.addEventListener("click", function (e) { e.stopPropagation(); pop.classList.toggle("open"); });
  document.addEventListener("click", function (e) {
    if (!pop.contains(e.target) && !fab.contains(e.target)) pop.classList.remove("open");
  });
})();
