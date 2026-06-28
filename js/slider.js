class Slider {
  constructor(o = {}) {
    this.o = Object.assign(
      {
        selector: ".slider",
        items: 4,
        gap: 20,
        speed: 500,
        orientation: "horizontal",
        direction: "ltr",
        autoplay: true,
        autoplayDelay: 3000,
        pauseOnHover: true,
        mouseControl: true,
        arrows: true,
        loop: true,
      },
      o,
    );

    this.root = document.querySelector(this.o.selector);
    if (this.vertical) {
      this.root.classList.add("vertical");
    }
    if (!this.root) return;

    this.viewport = this.root.querySelector(".viewport");
    this.track = this.root.querySelector(".track");

    this.original = [...this.track.children];

    this.index = 0;
    this.timer = null;

    this.vertical = this.o.orientation === "vertical";
    this.reverse = this.o.direction === "rtl" || this.o.direction === "bottom";

    if (this.vertical) {
      this.root.classList.add("vertical");
    }

    this.clone();
    this.cache();
    this.layout();
    this.events();

    if (this.o.mouseControl) {
      this.drag();
    }

    this.move(false);
    if (this.o.autoplay) this.play();
  }

  clone() {
    if (!this.o.loop) return;

    const n = Math.min(this.o.items, this.original.length);
    const before = this.original.slice(-n).map((e) => e.cloneNode(true));
    const after = this.original.slice(0, n).map((e) => e.cloneNode(true));

    this.track.innerHTML = "";

    before.forEach((e) => {
      e.dataset.clone = 1;
      this.track.appendChild(e);
    });

    this.original.forEach((e) => {
      this.track.appendChild(e);
    });

    after.forEach((e) => {
      e.dataset.clone = 1;
      this.track.appendChild(e);
    });

    this.index = n;
  }

  cache() {
    this.slides = [...this.track.children];
    this.count = this.original.length;
  }

  layout() {
    this.viewport.style.overflow = "hidden";
    this.track.style.display = "flex";
    this.track.style.flexDirection = this.vertical ? "column" : "row";
    this.track.style.gap = this.o.gap + "px";
    this.track.style.willChange = "transform";

    const size = this.vertical
      ? this.viewport.clientHeight
      : this.viewport.clientWidth;

    this.slideSize = (size - (this.o.items - 1) * this.o.gap) / this.o.items;

    this.slides.forEach((slide) => {
      slide.style.flex = "0 0 auto";

      if (this.vertical) {
        slide.style.height = this.slideSize + "px";
        slide.style.width = "100%";
      } else {
        slide.style.width = this.slideSize + "px";
      }
    });
  }

  offset() {
    return (this.slideSize + this.o.gap) * this.index;
  }

  move(animate = true) {
    this.track.style.transition = animate
      ? `transform ${this.o.speed}ms ease`
      : "none";

    const sign = this.reverse ? 1 : -1;
    const value = this.offset() * sign;

    if (this.vertical) {
      this.track.style.transform = `translate3d(0,${value}px,0)`;
    } else {
      this.track.style.transform = `translate3d(${value}px,0,0)`;
    }

    if (!animate) {
      requestAnimationFrame(() => {
        this.track.style.transition = `transform ${this.o.speed}ms ease`;
      });
    }
  }

  next() {
    this.index++;
    this.move();
    this.loopFix();
  }

  prev() {
    this.index--;
    this.move();
    this.loopFix();
  }

  loopFix() {
    if (!this.o.loop) return;
    clearTimeout(this.fixTimer);
    this.fixTimer = setTimeout(() => {
      const n = this.o.items;

      if (this.index >= this.count + n) {
        this.index = n;
        this.move(false);
      }

      if (this.index < n) {
        this.index = this.count + n - 1;
        this.move(false);
      }
    }, this.o.speed);
  }

  events() {
    this.resize = () => {
      this.layout();
      this.move(false);
    };

    window.addEventListener("resize", this.resize);

    if (this.o.arrows) {
      this.root
        .querySelector(".next")
        ?.addEventListener("click", () => this.next());

      this.root
        .querySelector(".prev")
        ?.addEventListener("click", () => this.prev());
    }

    if (this.o.pauseOnHover) {
      this.root.addEventListener("mouseenter", () => this.pause());
      this.root.addEventListener("mouseleave", () => this.play());
    }
  }
  play() {
    if (!this.o.autoplay) return;
    this.pause();
    this.timer = setInterval(() => {
      this.reverse ? this.prev() : this.next();
    }, this.o.autoplayDelay);
  }

  pause() {
    clearInterval(this.timer);
  }

  goTo(index) {
    const n = this.o.loop ? this.o.items : 0;
    this.index = index + n;
    this.move();
  }

  drag() {
    let start = 0;
    let current = 0;
    let dragging = false;

    const pos = (e) =>
      this.vertical
        ? e.touches
          ? e.touches[0].clientY
          : e.clientY
        : e.touches
          ? e.touches[0].clientX
          : e.clientX;

    const down = (e) => {
      e.preventDefault();
      dragging = true;
      this.root.classList.add("dragging");
      start = pos(e);
      current = start;
      this.pause();
      this.track.style.transition = "none";
    };

    const move = (e) => {
      if (!dragging) return;
      current = pos(e);
      const delta = current - start;
      let offset = this.offset();
      offset -= delta;
      if (this.reverse) offset = -offset;
      if (this.vertical) {
        this.track.style.transform = `translate3d(0,${-offset}px,0)`;
      } else {
        this.track.style.transform = `translate3d(${-offset}px,0,0)`;
      }
    };

    const up = () => {
      if (!dragging) return;
      dragging = false;
      this.root.classList.remove("dragging");
      const delta = current - start;

      this.track.style.transition = `transform ${this.o.speed}ms ease`;

      if (Math.abs(delta) > 50) {
        if (delta < 0) {
          this.reverse ? this.prev() : this.next();
        } else {
          this.reverse ? this.next() : this.prev();
        }
      } else {
        this.move();
      }
      if (this.o.autoplay) this.play();
    };

    this.viewport.addEventListener("mousedown", down);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);

    this.viewport.addEventListener("touchstart", down, { passive: true });
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("touchcancel", up);
  }

  destroy() {
    this.pause();
    this.track.style.transform = "";
    this.track.style.transition = "";
    window.removeEventListener("resize", this.resize);
  }
}

new Slider({
  selector: ".slider",
});
