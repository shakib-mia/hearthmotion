# HearthMotion 🚀

**HearthMotion** is a lightweight JavaScript library that brings **smooth scrolling, scroll-triggered animations, and a modern custom scrollbar** to your website.

It integrates trusted open-source tools like **Lenis** (for smooth scrolling) and **Animate.css** (for animations) — but wraps them into a single, easy-to-use solution with additional features such as a fully synced custom scrollbar.

## ✨ Features

### 1. **Smooth Scrolling**

GPU-accelerated, buttery-smooth scrolling powered by Lenis. Works with mouse wheel, keyboard, and touchpad.

### 2. **Scroll-Triggered Animations**

Elements with `data-animate` attributes animate into view as they enter the viewport.

### 3. **Customizable Animations**

Control animation type, delay, and duration directly in your HTML with `data-delay` and `data-duration`.

### 4. **Modern Custom Scrollbar**

- Replaces the native scrollbar with a sleek, minimal one
- Fully synced with scrolling (wheel, touchpad, drag)
- Thumb dragging supported
- Clicking on the track scrolls smoothly, just like the default browser scrollbar
- Scrollbar remains hidden by default and **slides in smoothly** when the cursor reaches the right edge of the screen

### 5. **Zero Configuration Needed**

Just include the script file — everything works out of the box.

## 📦 Installation

Add the following script before the closing `</body>` tag:

```html
<script src="https://cdn.jsdelivr.net/gh/shakib-mia/hearthmotion@main/hearthmotion.js"></script>
```

## ⚡ Usage

### 1. Scroll Animations

Add animation attributes directly to your HTML elements:

```html
<h1 data-animate="fade-in-down" data-delay="300" data-duration="1s">
  Welcome to My Site
</h1>

<p data-animate="fade-in-up" data-delay="600">
  This paragraph will animate into view.
</p>
```

**Animation Attributes:**

- `data-animate` → Name of the animation from Animate.css (e.g., `fade-in-up`, `bounce-in`, `slide-in-left`)
- `data-delay` → Delay before animation starts (`500ms` or `0.5s`)
- `data-duration` → How long the animation lasts (`1000ms` or `1s`)

### 2. Smooth Scroll

HearthMotion automatically applies **Lenis smooth scrolling** across your page. No extra setup required.

### 3. Custom Scrollbar

- Hidden by default
- Appears smoothly when the cursor reaches the right screen edge
- Fully interactive (dragging, track clicking, synced with scroll position)

## 🎯 Example Implementation

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HearthMotion Demo</title>
  </head>
  <body>
    <header data-animate="fade-in-down" data-duration="1s">
      <h1>Welcome to HearthMotion</h1>
    </header>

    <section data-animate="fade-in-up" data-delay="500ms">
      <p>This content will smoothly animate into view!</p>
    </section>

    <div data-animate="slide-in-left" data-delay="800ms" data-duration="1.2s">
      <h2>Smooth animations made easy</h2>
    </div>

    <!-- HearthMotion Script -->
    <script src="https://cdn.jsdelivr.net/gh/shakib-mia/hearthmotion@main/hearthmotion.js"></script>
  </body>
</html>
```

## 📂 Technical Details

### Dependencies

- **Animate.css** - CSS Animations library
- **Lenis** - Smooth scrolling engine

### Core Technologies

- **IntersectionObserver** → Efficient animation triggering
- **requestAnimationFrame** → High-performance scroll syncing

### Performance

Optimized to avoid expensive scroll event listeners for better performance.

## ⚙️ Platform Compatibility

### WordPress:

- Can be included via wp_enqueue_script() in your theme or plugin.

- Can also be used in HTML blocks inside pages/posts.

### Other Platforms:

- Shopify, Joomla, Wix (with custom code), plain HTML/JS sites.

- Must allow custom JS inclusion and full-page wrapper for smooth scrolling.

### Limitations:

- Cannot be used in builders that restrict custom JS.
- Smooth scroll wrapper is required for Lenis functionality.

## 🌟 Popular Animation Options

You can use all animation listed of [animate.css](https://animate.style/) in `data-animate` such as:

### Fade Animations

- `fade-in`
- `fade-in-up`
- `fade-in-down`
- `fade-in-left`
- `fade-in-right`

### Slide Animations

- `slide-in-up`
- `slide-in-down`
- `slide-in-left`
- `slide-in-right`

### Bounce Animations

- `bounce-in`
- `bounce-in-up`
- `bounce-in-down`
- `bounce-in-left`
- `bounce-in-right`

### Zoom Animations

- `zoom-in`
- `zoom-in-up`
- `zoom-in-down`

## 🎨 Custom Scrollbar Styling

The Custom Scrollbar features:

- **Minimal Design** - Clean, modern appearance
- **Smooth Interactions** - Fluid animations and transitions
- **Auto-Hide** - Appears only when needed
- **Full Synchronization** - Always matches actual scroll position

## 🚀 Browser Support

HearthMotion works on all modern browsers that support:

- IntersectionObserver API
- requestAnimationFrame
- CSS Animations

## 📋 Changelog

### v1.0.0

- Initial release
- Smooth scrolling with Lenis integration
- Scroll-triggered animations with Animate.css
- Custom scrollbar with auto-hide functionality
- Zero-configuration setup

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📜 Credits

**HearthMotion.js**: Developed & maintained by **Md. Shakib Mia**

Built with:

- [Lenis](https://github.com/studio-freight/lenis) - Smooth scrolling
- [Animate.css](https://github.com/animate-css/animate.css) - CSS animations

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Made with ❤️ by Md. Shakib Mia**
