// Animation Intersection Observer
document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return;

        setTimeout(() => {
          entry.target.classList.add("show");
        }, index * 150);

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
    },
  );

  document.querySelectorAll(".animate").forEach((el) => observer.observe(el));
});

// School Logo Slider
