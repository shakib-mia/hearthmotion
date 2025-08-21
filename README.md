# HearthMotion

HearthMotion is a lightweight JavaScript library that adds elegant, smooth-scrolling and scroll-triggered animations to web pages. It leverages popular open-source libraries like Animate.css for animations and Lenis for smooth scrolling.

## Features

1. Scroll-Triggered Animations: Elements with a data-animate attribute become visible with an animation when they enter the viewport.

2. Customizable Animations: You can easily configure the animation type, delay, and duration using data attributes directly in your HTML.

3. Smooth Scrolling: Integrates the Lenis library to provide a fluid, high-performance smooth-scrolling experience across your site.

4. Easy to Use: No complex setup is required. Just include the script, and you can start adding animations to your elements immediately.

## How to Use

1. Add the Script

Include the hearthmotion.js file at the end of your <body> tag.

```bash
<script src="hearthmotion.js"></script>
```

2. Add Animations to HTML Elements

Use the data-animate attribute to specify the animation you want to apply. You can also use data-delay and data-duration to customize the timing of the animation.

`data-animate`: Specifies the name of the Animate.css animation to use (e.g., fade-in-up, bounce-in, slide-in-left).

`data-delay`: Sets a delay before the animation starts. Accepts values in milliseconds (e.g., 500ms) or seconds (e.g., 0.5s).

`data-duration`: Specifies how long the animation should run. Accepts values in milliseconds (e.g., 1000ms) or seconds (e.g., 1s).

## Example

```HTML
<h1 data-animate="fade-in-down" data-delay="300" data-duration="1s">
  Welcome to My Site
</h1>
<p data-animate="fade-in-up" data-delay="600">
  This is a paragraph that will animate into view.
</p>
```

## Technical Details

**Dependencies**: The library relies on animate.css and lenis. These dependencies are automatically loaded from CDNs.

**Animation Triggering**: An Intersection Observer is used to efficiently monitor when elements become visible in the viewport. This is more performant than listening for scroll events.

**Opacity Handling**: Initially, all elements with the data-animate attribute are set to opacity: 0 to ensure they are hidden before the animation.

**Browser Support**: The library's core features, like IntersectionObserver, are widely supported in modern browsers.

---

### Credits

This project uses the following third-party libraries:

- **HearthMotion.js**: A custom script for scroll-triggered animations and smooth scrolling.

  - Author: Md. Shakib Mia
  - Repository: [https://github.com/shakib-mia](https://github.com/shakib-mia)

- **Animate.css**: For the animation effects.

  - Website: [https://animate.style/](https://github.com/shakib-mia)

- **Lenis**: For the smooth scrolling functionality.
  - Website: [https://github.com/studio-freight/lenis](https://github.com/shakib-mia)

---
