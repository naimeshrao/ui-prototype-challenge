class MarqueeSlider {
  constructor(options = {}) {
    this.o = Object.assign(
      {
        selector: ".marquee",
        speed: 0.8,
        direction: "ltr",
        pauseOnHover: true,
      },
      options,
    );

    this.root = document.querySelector(this.o.selector);
    if (!this.root) return;

    this.track = this.root.querySelector(".marquee-track");
    if (!this.track) return;

    this.offset = this.o.direction === "rtl" ? -this.width : 0;
    this.width = 0;
    this.raf = null;
    this.paused = false;

    this.init();
  }

  init() {
    this.clone();
    this.measure();
    this.events();
    this.start();
  }

  clone() {
    const items = [...this.track.children];

    items.forEach((item) => {
      this.track.appendChild(item.cloneNode(true));
    });

    items.forEach((item) => {
      this.track.appendChild(item.cloneNode(true));
    });
  }

  measure() {
    this.track.style.display = "flex";
    this.track.style.flexWrap = "nowrap";
    this.track.style.width = "max-content";
    this.track.style.willChange = "transform";

    const originals = this.track.children.length / 3;

    this.width = this.track.children[originals].offsetLeft;

    this.offset = -this.width;
  }

  events() {
    if (this.o.pauseOnHover) {
      this.root.addEventListener("mouseenter", () => {
        this.paused = true;
      });

      this.root.addEventListener("mouseleave", () => {
        this.paused = false;
      });
    }

    this.resize = () => {
      this.measure();
    };

    window.addEventListener("resize", this.resize);
  }

  start() {
    if (this.raf) {
      cancelAnimationFrame(this.raf);
    }

    this.animate();
  }

  animate() {
    if (!this.paused) {
      if (this.o.direction === "ltr") {
        this.offset -= this.o.speed;

        if (this.offset <= -this.width * 2) {
          this.offset += this.width;
        }
      } else {
        this.offset += this.o.speed;

        if (this.offset >= 0) {
          this.offset -= this.width;
        }
      }

      this.track.style.transform = `translate3d(${this.offset}px,0,0)`;
    }

    this.raf = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    cancelAnimationFrame(this.raf);

    window.removeEventListener("resize", this.resize);

    this.track.style.transform = "";
  }
}

new MarqueeSlider({
  selector: ".marquee",
  speed: 0.8,
  direction: "ltr",
  pauseOnHover: true,
});
