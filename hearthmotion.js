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
  }

  function initWrapper() {
    const wrapper = document.createElement("div");
    wrapper.id = "hm-wrapper";
    const content = document.createElement("div");
    content.id = "hm-content";

    const track = document.createElement("div");
    track.id = "hm-track";
    const thumb = document.createElement("div");
    thumb.id = "hm-thumb";
    track.appendChild(thumb);

    wrapper.appendChild(track);

    // Move body children into content
    Array.from(document.body.children).forEach((child) => {
      if (child !== wrapper) content.appendChild(child);
    });

    wrapper.appendChild(content);
    document.body.appendChild(wrapper);

    // Styles
    const style = document.createElement("style");
    style.innerHTML = `
      html, body { margin:0; height:100%; overflow:hidden; }
      #hm-wrapper { position:fixed; top:0; left:0; width:100%; height:100%; overflow:hidden; }
      #hm-content { width:100%; min-height:100%; will-change: transform; }
      #hm-track { 
        position:fixed; 
        top:0; 
        right:-12px; /* start hidden */
        width:8px; 
        height:100%; 
        background:rgba(0,0,0,0.1); 
        z-index:9999999; 
        border-radius:4px; 
        transition:right 0.3s ease;
      }
      #hm-thumb { 
        position:absolute; 
        top:0; 
        right:0; 
        width:100%; 
        height:50px; 
        background:rgba(0,0,0,0.4); 
        border-radius:4px; 
      }
    `;
    document.head.appendChild(style);

    return { wrapper, content, track, thumb };
  }

  function initLenis(wrapper, content) {
    const lenis = new Lenis({
      wrapper,
      content,
      smooth: true,
      syncWheel: true,
      syncTouch: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return lenis;
  }

  function initThumb(lenis, wrapper, content, track, thumb) {
    function updateThumb(scroll = lenis.scroll) {
      const wrapperHeight = wrapper.clientHeight;
      const contentHeight = content.scrollHeight;

      // ratio অনুযায়ী thumb height হিসাব
      const ratio = wrapperHeight / contentHeight;
      const thumbHeight = Math.max(ratio * wrapperHeight, 30); // min 30px
      thumb.style.height = thumbHeight + "px";

      const maxScroll = contentHeight - wrapperHeight;
      const maxThumbTop = wrapperHeight - thumbHeight;

      // scroll position অনুযায়ী thumb এর position set
      const top = (scroll / maxScroll) * maxThumbTop || 0;
      thumb.style.top = top + "px";
    }

    // Lenis এর scroll ইভেন্টে update
    lenis.on("scroll", ({ scroll }) => updateThumb(scroll));

    // Resize এও update (window size পরিবর্তন হলে thumb adjust করবে)
    window.addEventListener("resize", () => updateThumb());

    // --- Dragging ---
    let isDragging = false;
    let startY = 0;
    let startScroll = 0;

    thumb.addEventListener("mousedown", (e) => {
      isDragging = true;
      startY = e.clientY;
      startScroll = lenis.scroll;
      document.body.style.userSelect = "none";
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      const wrapperHeight = wrapper.clientHeight;
      const contentHeight = content.scrollHeight;
      const ratio = wrapperHeight / contentHeight;
      const thumbHeight = Math.max(ratio * wrapperHeight, 30);
      const maxScroll = contentHeight - wrapperHeight;
      const maxThumbTop = wrapperHeight - thumbHeight;

      const deltaY = e.clientY - startY;
      const newScroll = startScroll + (deltaY / maxThumbTop) * maxScroll;

      lenis.scrollTo(newScroll, { immediate: false });
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
      document.body.style.userSelect = "";
    });

    // --- Track click ---
    track.addEventListener("mousedown", (e) => {
      if (e.target === thumb) return;

      const wrapperHeight = wrapper.clientHeight;
      const contentHeight = content.scrollHeight;
      const ratio = wrapperHeight / contentHeight;
      const thumbHeight = Math.max(ratio * wrapperHeight, 30);
      const maxScroll = contentHeight - wrapperHeight;
      const maxThumbTop = wrapperHeight - thumbHeight;

      const clickY = e.clientY - track.getBoundingClientRect().top;
      const targetThumbTop = clickY - thumbHeight / 2;

      const targetScroll = (targetThumbTop / maxThumbTop) * maxScroll;

      lenis.scrollTo(targetScroll, { immediate: false });
    });

    // ✅ প্রথমে call করলেই thumb document এর সাথে relatable হয়ে যাবে
    updateThumb();
  }

  // --- Auto Hide Feature ---
  function initTrackAutoHide(track) {
    window.addEventListener("mousemove", (e) => {
      const edgeZone = 20; // কত px এর মধ্যে আসলে scrollbar বের হবে
      if (window.innerWidth - e.clientX <= edgeZone) {
        track.style.right = "0px"; // show
      } else {
        track.style.right = "-12px"; // hide
      }
    });
  }

  function initScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          const animation = el.dataset.animate;
          if (entry.isIntersecting && !el.classList.contains("animated")) {
            if (!animation) return;
            const delay = el.dataset.delay || "0ms";
            const duration = el.dataset.duration || "800ms";

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

    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => (el.style.opacity = "0"));
    elements.forEach((el) => observer.observe(el));
  }

  async function init() {
    try {
      await loadAnimateCSS();
      await loadLenis();

      const { wrapper, content, track, thumb } = initWrapper();
      const lenis = initLenis(wrapper, content);

      initThumb(lenis, wrapper, content, track, thumb);
      initTrackAutoHide(track);
      initScrollAnimations();

      console.log(
        "🎉 HearthMotion ready! Smooth scroll + thumb synced + auto-hide track."
      );
    } catch (e) {
      console.error(e);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
  global.HearthMotion = { initScrollAnimations };
})(window);
