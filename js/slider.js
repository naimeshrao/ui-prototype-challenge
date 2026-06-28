class CSSlider {
  constructor(options = {}) {
    this.o = Object.assign(
      {
        selector: ".cs-slider",
        items: 4,
        media: {
          lg: null,
          md: null,
          sm: null,
        },
        speed: 500,
        loop: true,
        arrows: true,
      },
      options,
    );

    this.root = document.querySelector(this.o.selector);

    if (!this.root) return;

    this.view = this.root.querySelector(".cs-view");
    this.track = this.root.querySelector(".cs-track");

    this.original = [...this.track.children];

    this.index = this.o.loop ? this.original.length : 0;

    this.init();
  }

  init() {
    if (this.o.arrows) {
      this.root.classList.add("cs-has-arrows");
    }

    if (this.o.loop) {
      this.clone();
    }

    this.items = [...this.track.children];

    this.layout();

    this.bind();

    this.move(false);
  }

  clone() {
    const before = this.original.map((el) => el.cloneNode(true));

    const after = this.original.map((el) => el.cloneNode(true));

    this.track.innerHTML = "";

    before.forEach((el) => this.track.appendChild(el));

    this.original.forEach((el) => this.track.appendChild(el));

    after.forEach((el) => this.track.appendChild(el));
  }

  layout() {
    const width = this.view.clientWidth;

    this.track.style.gap = this.o.gap + "px";

    this.itemsPerView = this.currentItems();

    this.itemWidth =
      (width - (this.itemsPerView - 1) * this.o.gap) / this.itemsPerView;

    this.items.forEach((item) => {
      item.style.flex = "0 0 auto";
      item.style.width = this.itemWidth + "px";
    });
  }

  currentItems() {
    const { lg, md, sm } = this.o.media;
    const w = window.innerWidth;

    if (w <= 576 && sm) return sm;
    if (w <= 768 && md) return md;
    if (w <= 992 && lg) return lg;

    return this.o.items;
  }

  offset() {
    return this.index * (this.itemWidth + this.o.gap);
  }

  move(animate = true) {
    this.track.style.transition = animate
      ? `transform ${this.o.speed}ms ease`
      : "none";

    this.track.style.transform = `translate3d(${-this.offset()}px,0,0)`;

    if (!animate) {
      requestAnimationFrame(() => {
        this.track.style.transition = `transform ${this.o.speed}ms ease`;
      });
    }
  }

  next() {
    if (!this.o.loop) {
      if (this.index >= this.original.length - this.itemsPerView) return;
    }

    this.index++;

    this.move();

    this.fix();
  }

  prev() {
    if (!this.o.loop) {
      if (this.index <= 0) return;
    }

    this.index--;

    this.move();

    this.fix();
  }
  fix() {
    if (!this.o.loop) return;

    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      const total = this.original.length;

      if (this.index >= total * 2) {
        this.index -= total;

        this.move(false);
      }

      if (this.index < total) {
        this.index += total;

        this.move(false);
      }
    }, this.o.speed);
  }

  bind() {
    this.resize = () => {
      this.layout();

      this.move(false);
    };

    window.addEventListener("resize", this.resize);

    if (!this.o.arrows) return;

    this.root
      .querySelector(".cs-next")
      ?.addEventListener("click", () => this.next());

    this.root
      .querySelector(".cs-prev")
      ?.addEventListener("click", () => this.prev());
  }

  destroy() {
    clearTimeout(this.timer);

    window.removeEventListener("resize", this.resize);

    this.track.style.transform = "";

    this.track.style.transition = "";
  }
}
