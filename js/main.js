// ======================== Animation Intersection Observer
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

// ======================== Slider
// Hero Banner Sliders
new VMarquee({
  selector: ".hero-vs-1",
  speed: 0.8,
  direction: "up",
  pauseOnHover: true,
});

new VMarquee({
  selector: ".hero-vs-2",
  speed: 0.8,
  direction: "down",
  pauseOnHover: true,
});

new VMarquee({
  selector: ".hero-vs-3",
  speed: 0.8,
  direction: "up",
  pauseOnHover: true,
});

// School Logo Sliders
new MarqueeSlider({
  selector: ".schools-ltr",
  speed: 0.8,
  direction: "ltr",
  pauseOnHover: true,
});

new MarqueeSlider({
  selector: ".schools-rtl",
  speed: 0.8,
  direction: "rtl",
  pauseOnHover: true,
});

// Exhibition Features Slider
new CSSlider({
  selector: ".exh-list",
  items: 4,
  media: {
    lg: 3,
    md: 2,
    sm: 1,
  },
  speed: 500,
  gap: 24,
  loop: false,
  arrows: true,
});
