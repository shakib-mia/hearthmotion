// hearthmotion.js
(function (global) {
  function hyphenToCamelCase(text) {
    return text.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  function loadResource({ type, href, src }) {
    return new Promise((resolve, reject) => {
      let el;
      if (type === "css") {
        el = document.createElement("link");
        el.rel = "stylesheet";
        el.href = href;
        document.head.appendChild(el);
      } else if (type === "js") {
        el = document.createElement("script");
        el.src = src;
        document.body.appendChild(el);
      }
      el.onload = () => resolve();
      el.onerror = () => reject(new Error(`Failed to load ${href || src}`));
    });
  }

  async function loadAnimateCSS() {
    await loadResource({
      type: "css",
      href: "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css",
    });
  }

  async function loadLenis() {
    await loadResource({
      type: "js",
      src: "https://cdn.jsdelivr.net/npm/@studio-freight/lenis@latest/bundled/lenis.min.js",
    });

    // 🔥 Create wrapper + content structure (GSAP style)
    const bodyChildren = Array.from(document.body.children);
    const wrapper = document.createElement("div");
    wrapper.id = "hm-wrapper";
    const content = document.createElement("div");
    content.id = "hm-content";

    // Move all body children into #hm-content
    bodyChildren.forEach((child) => {
      if (child !== wrapper) content.appendChild(child);
    });

    wrapper.appendChild(content);
    document.body.appendChild(wrapper);

    // Apply base styles
    const style = document.createElement("style");
    style.innerHTML = `
      html, body {
        height: 100%;
        overflow: hidden;
      }
      #hm-wrapper {
        position: fixed;
        top: 0; left: 0;
        width: 100%;
        height: 100%;
        overflow-y: scroll; /* scrollbar এখান থেকে আসবে */
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
      }
      #hm-content {
        will-change: transform;
      }
    `;
    document.head.appendChild(style);

    // ✅ Lenis initialize on wrapper
    const lenis = new Lenis({
      wrapper: wrapper,
      content: content,
      smooth: true,
      syncWheel: true,
      syncTouch: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    console.log(
      "HearthMotion: Lenis smooth scroll initialized with proxy scrollbar"
    );
  }

  function initScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          const animation = el.dataset.animate;
          if (entry.isIntersecting && !el.classList.contains("animated")) {
            if (!animation) return;
            const delay = parseTiming(el.dataset.delay, "0");
            const duration = parseTiming(el.dataset.duration, "800");

            el.style.opacity = "1";
            el.style.animationDelay = delay;
            el.style.animationDuration = duration;
            el.classList.add(
              "animate__animated",
              `animate__${hyphenToCamelCase(animation)}`
            );
            el.classList.add("animated");

            el.addEventListener(
              "animationend",
              () => {
                el.classList.remove(
                  "animate__animated",
                  `animate__${hyphenToCamelCase(animation)}`
                );
              },
              { once: true }
            );
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
    );

    function parseTiming(value, defaultValue) {
      if (!value) return `${defaultValue}ms`;
      return isNaN(value)
        ? value.endsWith("ms") || value.endsWith("s")
          ? value
          : `${value}ms`
        : `${value}ms`;
    }

    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => (el.style.opacity = "0"));
    elements.forEach((el) => observer.observe(el));
    console.log("HearthMotion: Animate.css scroll animations initialized");
  }

  async function init() {
    try {
      await loadAnimateCSS();
      await loadLenis();
      initScrollAnimations();
      console.log("🎉 HearthMotion ready!");
    } catch (e) {
      console.error(e);
    }
  }

  document.addEventListener("DOMContentLoaded", init);

  global.HearthMotion = { initScrollAnimations };
})(window);
