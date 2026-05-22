/*
 * trainyouragent.com/embed/lead.js — v101
 *
 * Drop-in lead form for sibling ventures (Ghost Agency / TYAhq). Submits to
 * /api/lead-federation on trainyouragent.com so we get a single CRM across
 * all three sites.
 *
 * Usage on cnnct.ai:
 *   <div id="tya-lead"
 *        data-venture="ghost"
 *        data-token="REPLACE_WITH_GHOST_FED_TOKEN"
 *        data-source="cnnct-home-hero"></div>
 *   <script src="https://trainyouragent.com/embed/lead.js" async></script>
 *
 * data-venture must be one of: ghost | tyahq.
 * data-token must match the venture's entry in LEAD_FEDERATION_TOKENS env.
 */
(function () {
  "use strict";

  var API = "https://trainyouragent.com/api/lead-federation";

  function $(sel, root) { return (root || document).querySelector(sel); }

  function mount(host) {
    var venture = host.getAttribute("data-venture") || "ghost";
    var token   = host.getAttribute("data-token")   || "";
    var source  = host.getAttribute("data-source")  || (venture + "-embed");
    var brand   = host.getAttribute("data-brand-url") || location.origin;

    if (!token) {
      console.warn("[tya-lead] missing data-token");
      return;
    }

    host.innerHTML =
      '<form class="tya-lead-form" style="display:flex;gap:8px;flex-wrap:wrap;max-width:480px;font:14px/1.4 system-ui,-apple-system,sans-serif;">' +
        '<input type="email" required placeholder="your@email.com" ' +
          'style="flex:1;min-width:200px;padding:12px 14px;border:1px solid #d0d7e2;border-radius:10px;font:inherit;outline:none;" />' +
        '<button type="submit" ' +
          'style="padding:12px 18px;border:0;border-radius:10px;background:#042C53;color:#fff;font:600 14px system-ui;cursor:pointer;">' +
          "Get notified" +
        '</button>' +
        '<div class="tya-lead-msg" role="status" aria-live="polite" style="flex-basis:100%;font-size:13px;color:#475569;min-height:18px;"></div>' +
      '</form>';

    var form = $("form", host);
    var input = $("input", host);
    var msg = $(".tya-lead-msg", host);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = (input.value || "").trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        msg.textContent = "Please enter a valid email.";
        return;
      }
      msg.textContent = "Sending…";
      fetch(API, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-venture": venture,
          "x-federation-token": token,
        },
        body: JSON.stringify({
          email: email,
          source: source,
          path: location.pathname,
          brandUrl: brand,
          payload: { referrer: document.referrer || null, ua: navigator.userAgent.slice(0, 200) },
        }),
      })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (res.ok) {
            msg.textContent = "Thanks — you're on the list.";
            input.value = "";
          } else {
            msg.textContent = "Sorry, that didn't go through. Try again in a minute.";
            console.error("[tya-lead]", res.j);
          }
        })
        .catch(function (err) {
          msg.textContent = "Sorry, network error. Try again in a minute.";
          console.error("[tya-lead]", err);
        });
    });
  }

  function init() {
    var hosts = document.querySelectorAll("[id^=tya-lead]");
    for (var i = 0; i < hosts.length; i++) mount(hosts[i]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
