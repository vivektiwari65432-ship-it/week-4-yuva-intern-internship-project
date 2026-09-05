document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  const menuBtn = $("#menuBtn");
  const navbar = $("#navbar");
  const themeBtn = $("#themeBtn");
  const heroMessage = $("#heroMessage");
  const learnBtn = $("#learnBtn");
  const learnText = $("#learnText");
  const stats = $(".stats");
  const counters = $$(".counter");
  const form = $("#contactForm");

  // Mobile navigation: keep state exposed to assistive technology.
  menuBtn.addEventListener("click", () => {
    const isOpen = navbar.classList.toggle("active");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    menuBtn.textContent = isOpen ? "✕" : "☰";
  });

  $$("#navbar a").forEach((link) => {
    link.addEventListener("click", () => {
      navbar.classList.remove("active");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", "Open navigation menu");
      menuBtn.textContent = "☰";
    });
  });

  // Theme toggle.
  themeBtn.addEventListener("click", () => {
    const dark = document.body.classList.toggle("dark");
    themeBtn.textContent = dark ? "☀️" : "🌙";
    themeBtn.setAttribute("aria-pressed", String(dark));
    themeBtn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  });

  $("#messageBtn").addEventListener("click", () => {
    heroMessage.textContent = "Welcome! JavaScript is making this webpage interactive 🚀";
  });

  $("#exploreBtn").addEventListener("click", () => {
    $("#features").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  learnBtn.addEventListener("click", () => {
    const willShow = learnText.hidden;
    learnText.hidden = !willShow;
    learnBtn.textContent = willShow ? "Show Less" : "Learn More";
    learnBtn.setAttribute("aria-expanded", String(willShow));
  });

  // Run counters only once when the statistics section enters the viewport.
  let counterStarted = false;
  const startCounters = () => {
    if (counterStarted) return;
    counterStarted = true;

    counters.forEach((counter) => {
      const target = Number(counter.dataset.target);
      const duration = 900;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        counter.textContent = Math.round(target * progress);
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    });
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        startCounters();
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(stats);
  } else {
    startCounters();
  }

  // Accessible form validation with field-specific messages.
  const fields = [
    { input: $("#name"), error: $("#nameError"), message: "Please enter your name." },
    { input: $("#email"), error: $("#emailError"), message: "Please enter a valid email." },
    { input: $("#message"), error: $("#messageError"), message: "Message must contain at least 10 characters." }
  ];

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let valid = true;

    fields.forEach(({ input, error }) => {
      error.textContent = "";
      input.removeAttribute("aria-invalid");
    });
    $("#successMessage").textContent = "";

    if (!$("#name").value.trim()) {
      $("#nameError").textContent = "Please enter your name.";
      $("#name").setAttribute("aria-invalid", "true");
      valid = false;
    }

    const email = $("#email").value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      $("#emailError").textContent = "Please enter a valid email.";
      $("#email").setAttribute("aria-invalid", "true");
      valid = false;
    }

    const message = $("#message").value.trim();
    if (!message || message.length < 10) {
      $("#messageError").textContent = "Message must contain at least 10 characters.";
      $("#message").setAttribute("aria-invalid", "true");
      valid = false;
    }

    if (valid) {
      $("#successMessage").textContent = "Message submitted successfully! ✅";
      form.reset();
      $("#name").focus();
    }
  });
});