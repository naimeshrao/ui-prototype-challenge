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
// new Slider({
//   selector: ".schools-ltr",
//   items: 4,
//   gap: 20,
//   speed: 800,
//   orientation: "horizontal",
//   direction: "ltr",
//   autoplay: true,
//   autoplayType: "continuous",
//   autoplayDelay: 800,
//   pauseOnHover: true,
//   mouseControl: true,
//   arrows: false,
//   loop: true,
// });

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

new Slider({
  selector: ".exh-list",
  items: 4,
  gap: 20,
  speed: 500,
  orientation: "horizontal",
  direction: "ltr",
  autoplay: false,
  pauseOnHover: true,
  mouseControl: true,
  arrows: true,
  loop: false,
});

// new Slider({
//   selector: ".slider-2",
//   items: 2,
//   gap: 16,
//   speed: 700,
//   orientation: "vertical",
//   direction: "top",
//   autoplay: false,
//   pauseOnHover: false,
//   mouseControl: true,
//   arrows: true,
//   loop: true,
// });
