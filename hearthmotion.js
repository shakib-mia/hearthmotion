// hearthmotion.js - Complete version with auto-hide scrollbar
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
    let wrapper = document.getElementById("hm-wrapper");
    let content = document.getElementById("hm-content");

    if (!wrapper) {
      wrapper = document.createElement("div");
      wrapper.id = "hm-wrapper";
      document.body.appendChild(wrapper);
    }

    if (!content) {
      content = document.createElement("div");
      content.id = "hm-content";
    }

    const track = document.createElement("div");
    track.id = "hm-track";
    const thumb = document.createElement("div");
    thumb.id = "hm-thumb";
    track.appendChild(thumb);

    Array.from(document.body.children).forEach((child) => {
      const computed = window.getComputedStyle(child);
      const isFixed = computed.position === "fixed";
      const isScriptOrStyle = ["SCRIPT", "STYLE", "LINK"].includes(
        child.tagName
      );
      if (child !== wrapper && !isFixed && !isScriptOrStyle) {
        content.appendChild(child);
      }
    });

    wrapper.appendChild(content);
    wrapper.appendChild(track);

    const style = document.createElement("style");
    style.innerHTML = `
      html, body { margin:0; height:100%; overflow:hidden; }
      #hm-wrapper { position:fixed; top:0; left:0; width:100%; height:100%; overflow:hidden; }
      #hm-content { width:100%; min-height:100%; will-change: transform; }
      #hm-track { 
        position:fixed; 
        top:0; 
        right:2px; 
        width:6px; 
        height:100%; 
        background: rgba(0,0,0,0.2); 
        z-index:99999999; 
        border-radius:4px; 
        transition: width 0.3s ease, opacity 0.4s ease, transform 0.4s ease; 
      }
      #hm-thumb { 
        position:absolute; 
        top:0; 
        right:0; 
        width:100%; 
        height:50px;
        background: rgba(0,0,0,0.5); 
        border-radius:4px; 
        cursor:pointer; 
        z-index:9999999;
        transition: background 0.2s ease;
      }
      #hm-thumb:hover {
        background: rgba(0,0,0,0.7);
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

    // Store reference
    global.HearthMotion._lenis = lenis;

    return lenis;
  }

  function initThumb(lenis, wrapper, content, track, thumb) {
    let scrollTimeout;
    const HIDE_DELAY = 2000; // 2 seconds of inactivity

    // Auto-hide functionality
    function showScrollbar() {
      track.style.opacity = "1";
      track.style.transform = "translateX(0)";
    }

    function hideScrollbar() {
      track.style.opacity = "0";
      track.style.transform = "translateX(10px)";
    }

    function resetScrollbarTimer() {
      showScrollbar();
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(hideScrollbar, HIDE_DELAY);
    }

    function updateThumb(scroll = lenis.scroll) {
      const wrapperHeight = wrapper.clientHeight;
      const contentHeight = content.scrollHeight;
      const ratio = wrapperHeight / contentHeight;
      const thumbHeight = Math.max(ratio * wrapperHeight, 30);
      const maxScroll = Math.max(contentHeight - wrapperHeight, 1);
      const maxThumbTop = Math.max(wrapperHeight - thumbHeight, 1);
      const top = Math.min((scroll / maxScroll) * maxThumbTop, maxThumbTop);
      thumb.style.height = thumbHeight + "px";
      thumb.style.top = top + "px";
    }

    lenis.on("scroll", ({ scroll }) => {
      updateThumb(scroll);
      resetScrollbarTimer(); // Show scrollbar on scroll
    });

    window.addEventListener("resize", () => updateThumb());

    let isDragging = false;
    let startY = 0;
    let startScroll = 0;

    thumb.addEventListener("mousedown", (e) => {
      isDragging = true;
      startY = e.clientY;
      startScroll = lenis.scroll;
      document.body.style.userSelect = "none";
      showScrollbar();
      clearTimeout(scrollTimeout);
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      const wrapperHeight = wrapper.clientHeight;
      const contentHeight = content.scrollHeight;
      const ratio = wrapperHeight / contentHeight;
      const thumbHeight = Math.max(ratio * wrapperHeight, 30);
      const maxScroll = Math.max(contentHeight - wrapperHeight, 1);
      const maxThumbTop = Math.max(wrapperHeight - thumbHeight, 1);

      const deltaY = e.clientY - startY;
      const newScroll = startScroll + (deltaY / maxThumbTop) * maxScroll;
      lenis.scrollTo(Math.max(0, Math.min(newScroll, maxScroll)), {
        immediate: false,
      });
    });

    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        document.body.style.userSelect = "";
        resetScrollbarTimer();
      }
    });

    track.addEventListener("mousedown", (e) => {
      if (e.target === thumb) return;

      const wrapperHeight = wrapper.clientHeight;
      const contentHeight = content.scrollHeight;
      const ratio = wrapperHeight / contentHeight;
      const thumbHeight = Math.max(ratio * wrapperHeight, 30);
      const maxScroll = Math.max(contentHeight - wrapperHeight, 1);
      const maxThumbTop = Math.max(wrapperHeight - thumbHeight, 1);

      const clickY = e.clientY - track.getBoundingClientRect().top;
      const targetThumbTop = clickY - thumbHeight / 2;
      const targetScroll = Math.max(
        0,
        Math.min((targetThumbTop / maxThumbTop) * maxScroll, maxScroll)
      );

      lenis.scrollTo(targetScroll, { immediate: false });
    });

    // Auto-hide on edge hover
    window.addEventListener("mousemove", (e) => {
      const edgeZone = 20;
      if (window.innerWidth - e.clientX <= edgeZone) {
        track.style.width = "8px";
        showScrollbar();
        clearTimeout(scrollTimeout);
      } else {
        track.style.width = "6px";
      }
    });

    // Show on hover, hide on leave
    track.addEventListener("mouseenter", () => {
      showScrollbar();
      clearTimeout(scrollTimeout);
    });

    track.addEventListener("mouseleave", () => {
      if (!isDragging) {
        resetScrollbarTimer();
      }
    });

    // Initial state
    updateThumb();
    resetScrollbarTimer(); // Start the hide timer
  }

  function initScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          const animation = el.dataset.animate;
          if (entry.isIntersecting && !el.classList.contains("animated")) {
            if (!animation) return;

            // Parse delay and duration - auto-add "ms" if just numbers
            let delay = el.dataset.delay || "0";
            let duration = el.dataset.duration || "800";

            // Add "ms" if not present
            if (!delay.includes("ms") && !delay.includes("s")) {
              delay += "ms";
            }
            if (!duration.includes("ms") && !duration.includes("s")) {
              duration += "ms";
            }

            console.log(
              `Animating element with: ${animation}, delay: ${delay}, duration: ${duration}`
            );

            el.style.opacity = "1";
            el.style.animationDelay = delay;
            el.style.animationDuration = duration;

            // Add animation classes
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
                console.log(`Animation completed for: ${animation}`);
              },
              { once: true }
            );
          }
        });
      },
      {
        threshold: 0.1, // Lower threshold for earlier trigger
        rootMargin: "0px 0px -20px 0px", // Less aggressive margin
      }
    );

    // Wait for DOM to be fully ready
    setTimeout(() => {
      const elements = document.querySelectorAll("[data-animate]");
      console.log(`Found ${elements.length} elements with data-animate`);

      elements.forEach((el) => {
        el.style.opacity = "0";
        observer.observe(el);
      });
    }, 100); // Small delay to ensure everything is ready
  }

  // ✅ Navbar function
  function initNavbar(lenis) {
    const navbar = document.getElementById("navbar");
    if (!navbar) {
      console.warn("Navbar element not found");
      return;
    }

    let lastScrollY = 0;
    let scrollDirection = "up";

    // Set initial styles
    navbar.style.transition = "all 0.5s ease";
    navbar.style.position = "fixed";
    navbar.style.top = "0";
    navbar.style.left = "0";
    navbar.style.right = "0";
    navbar.style.zIndex = "999997"; // Below scrollbar but above content

    function handleNavbar(scroll) {
      // Direction tracking
      if (scroll > lastScrollY) {
        scrollDirection = "down";
      } else {
        scrollDirection = "up";
      }
      lastScrollY = scroll;

      // Hide/show logic
      if (scrollDirection === "down" && scroll > 50) {
        navbar.style.transform = "translateY(-100%)";
      } else {
        navbar.style.transform = "translateY(0)";
      }

      // Background & color change
      if (scroll > 0) {
        navbar.style.boxShadow = "0 0 20px 0 #2B245D21";
        navbar.style.backgroundColor = "#FFF";
        navbar.style.color = "#000";
      } else {
        navbar.style.boxShadow = "none";
        navbar.style.backgroundColor = "transparent";
        navbar.style.color = "#FFF";
      }
    }

    lenis.on("scroll", ({ scroll }) => {
      handleNavbar(scroll);
    });

    handleNavbar(0);
  }

  async function init() {
    try {
      await loadAnimateCSS();
      await loadLenis();

      const { wrapper, content, track, thumb } = initWrapper();
      const lenis = initLenis(wrapper, content);

      initThumb(lenis, wrapper, content, track, thumb);
      initNavbar(lenis);

      // Initialize animations last to ensure DOM is ready
      initScrollAnimations();

      console.log(
        "🎉 HearthMotion ready! Auto-hide scrollbar + animations active."
      );
    } catch (e) {
      console.error(e);
    }
  }

  document.addEventListener("DOMContentLoaded", init);

  global.HearthMotion = {
    initScrollAnimations,
    getLenis: () => global.HearthMotion._lenis,
  };
})(window);
