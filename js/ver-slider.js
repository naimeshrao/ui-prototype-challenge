class VMarquee {
  constructor(options = {}) {
    this.o = Object.assign(
      {
        selector: ".vmq",
        speed: 0.8,
        direction: "up",
        pauseOnHover: true,
      },
      options,
    );

    this.root = document.querySelector(this.o.selector);
    if (!this.root) return;

    this.track = this.root.querySelector(".vmq-track");
    if (!this.track) return;

    this.height = 0;
    this.offset = 0;
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
    const total = this.track.children.length;
    const originals = total / 3;

    this.track.style.display = "flex";
    this.track.style.flexDirection = "column";
    this.track.style.flexWrap = "nowrap";
    this.track.style.height = "max-content";
    this.track.style.willChange = "transform";

    this.height = this.track.children[originals].offsetTop;

    this.offset = -this.height;
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

    this.resize = () => this.measure();

    window.addEventListener("resize", this.resize);
  }

  start() {
    if (this.raf) cancelAnimationFrame(this.raf);

    this.animate();
  }

  animate() {
    if (!this.paused) {
      if (this.o.direction === "up") {
        this.offset -= this.o.speed;

        if (this.offset <= -this.height * 2) {
          this.offset += this.height;
        }
      } else {
        this.offset += this.o.speed;

        if (this.offset >= 0) {
          this.offset -= this.height;
        }
      }

      this.track.style.transform = `translate3d(0,${this.offset}px,0)`;
    }

    this.raf = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    cancelAnimationFrame(this.raf);

    window.removeEventListener("resize", this.resize);

    this.track.style.transform = "";
  }
}

new VMarquee({
  selector: ".vmq",
  speed: 0.8,
  direction: "up",
  pauseOnHover: true,
});
