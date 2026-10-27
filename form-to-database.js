// ============================================================
//  form-to-database.js
//  Sends website form submissions to your own database backend
//  (the "backend" folder) whenever one is configured in
//  config.js as window.TRY_BACKEND_URL.
//
//  If TRY_BACKEND_URL is empty, this file does nothing and the
//  website keeps its default behaviour (FormSubmit email).
// ============================================================
(function () {
  var backend = (window.TRY_BACKEND_URL || "").replace(/\/+$/, "");
  if (!backend) return; // No database configured: leave site as-is.

  function showStatus(form, ok, message) {
    var box = form.querySelector(".db-status");
    if (!box) {
      box = document.createElement("div");
      box.className = "db-status";
      box.style.cssText =
        "margin:0 0 16px;padding:14px 18px;border-radius:14px;font-size:15px;line-height:1.5;" +
        (ok
          ? "background:#e7f6ec;color:#14532d;border:1px solid #86c79b;"
          : "background:#fdecec;color:#7f1d1d;border:1px solid #ef9a9a;");
      form.insertBefore(box, form.firstChild);
    }
    box.textContent = message;
    box.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // Capture phase: run BEFORE the site's own submit handlers.
  document.addEventListener(
    "submit",
    function (event) {
      var form = event.target;
      if (!(form instanceof HTMLFormElement)) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      var data = { form_type: form.id || form.getAttribute("data-form") || "website-form" };
      new FormData(form).forEach(function (value, key) {
        if (key.charAt(0) === "_") return; // skip FormSubmit control fields
        data[key] = value;
      });

      fetch(backend + "/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Backend returned " + res.status);
          return res.json();
        })
        .then(function () {
          showStatus(
            form,
            true,
            "Thank you! Your response has been received and saved. The Real You Initiative team will get back to you."
          );
          form.reset();
        })
        .catch(function () {
          showStatus(
            form,
            false,
            "Sorry, your response could not be saved just now. Please try again, or reach us directly at therealyou0806@gmail.com."
          );
        });
    },
    true // capture
  );
})();
