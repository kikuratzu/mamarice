// Sticky nav background on scroll
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Mobile menu
const toggle = document.getElementById("navToggle");
const links = document.getElementById("navLinks");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", open);
});
links.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    links.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", false);
  })
);

// Animated counters
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  const duration = 1200;
  const start = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = (target * eased).toFixed(decimals).replace(".", ",");
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Scroll reveal (staggered per batch)
const observer = new IntersectionObserver(
  (entries) => {
    entries
      .filter((e) => e.isIntersecting)
      .forEach((entry, i) => {
        const el = entry.target;
        el.style.transitionDelay = `${i * 80}ms`;
        el.classList.add("visible");
        el.querySelectorAll("[data-count]").forEach(animateCount);
        observer.unobserve(el);
      });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Menu filter
const filters = document.querySelectorAll(".filter");
const dishes = document.querySelectorAll(".dish");
filters.forEach((btn) =>
  btn.addEventListener("click", () => {
    filters.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const cat = btn.dataset.filter;
    dishes.forEach((dish) => {
      const show = cat === "all" || dish.dataset.cat === cat;
      dish.classList.toggle("hidden", !show);
      dish.classList.remove("pop");
      if (show) {
        void dish.offsetWidth; // restart animation
        dish.classList.add("pop", "visible");
      }
    });
  })
);

document.getElementById("year").textContent = new Date().getFullYear();
