// ABOUTME: Main JavaScript for Etc. Collective website
// ABOUTME: Handles sticky nav, globe spin on scroll, and dotted world map rendering

(function () {
  'use strict';

  /* ═══════════════════════════════════════════
     STICKY NAV — IntersectionObserver
     ═══════════════════════════════════════════ */
  const hero = document.getElementById('hero');
  const nav = document.getElementById('nav');

  if (hero && nav) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            nav.classList.remove('nav--visible');
          } else {
            nav.classList.add('nav--visible');
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(hero);
  }

  /* ═══════════════════════════════════════════
     GLOBE SPIN ON SCROLL
     ═══════════════════════════════════════════ */
  const globe = document.getElementById('globe');
  if (globe) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var scrollY = window.scrollY || window.pageYOffset;
          var rotation = scrollY * 0.15;
          globe.style.transform = 'translateY(-50%) rotateY(' + rotation + 'deg)';
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* ═══════════════════════════════════════════
     DOTTED WORLD MAP — Canvas rendering
     ═══════════════════════════════════════════ */
  var canvas = document.getElementById('dot-map');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    drawDotMap(canvas, ctx);

    var resizeTimeout;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function () {
        drawDotMap(canvas, ctx);
      }, 200);
    });
  }

  function drawDotMap(canvas, ctx) {
    var container = canvas.parentElement;
    var dpr = window.devicePixelRatio || 1;
    var width = container.clientWidth;
    var height = container.clientHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    // Dot grid parameters
    var dotSize = Math.max(2, width / 300);
    var gap = dotSize * 1.8;
    var dotColor = '#4a4a4a';

    // Simplified world map outline using a bitmap-style approach
    // Each row is a range of columns where dots should appear (land masses)
    // Normalized to 0-1 range, mapped to canvas dimensions
    var worldMap = generateWorldMapData();

    for (var row = 0; row < worldMap.length; row++) {
      var ranges = worldMap[row];
      var y = (row / worldMap.length) * height;

      if (y < 0 || y > height) continue;

      for (var r = 0; r < ranges.length; r += 2) {
        var startX = ranges[r] * width;
        var endX = ranges[r + 1] * width;

        for (var x = startX; x < endX; x += gap) {
          ctx.fillStyle = dotColor;
          ctx.fillRect(x, y, dotSize, dotSize);
        }
      }
    }
  }

  function generateWorldMapData() {
    // Simplified world map as horizontal line ranges [startX, endX, startX, endX, ...]
    // Normalized 0-1. Each entry in the array represents a horizontal scan line.
    // This is an approximate dot-matrix representation of world continents.
    var gap = 0.012; // vertical gap between rows
    var rows = [];
    var y = 0;

    // Helper to push a row
    function addRow() {
      var args = Array.prototype.slice.call(arguments);
      rows.push(args);
      y += gap;
    }

    // North America + Europe + Asia (top rows)
    // Row ~10% from top (Arctic/Greenland/Northern Russia)
    addRow(0.15, 0.20, 0.42, 0.48, 0.55, 0.58, 0.65, 0.95);
    addRow(0.14, 0.21, 0.41, 0.49, 0.55, 0.58, 0.63, 0.96);
    addRow(0.08, 0.10, 0.13, 0.22, 0.40, 0.50, 0.55, 0.58, 0.62, 0.97);
    addRow(0.07, 0.11, 0.12, 0.24, 0.39, 0.50, 0.55, 0.58, 0.60, 0.97);
    addRow(0.06, 0.24, 0.39, 0.51, 0.54, 0.58, 0.60, 0.96);
    addRow(0.06, 0.25, 0.38, 0.51, 0.54, 0.58, 0.59, 0.96);

    // ~20% (Canada, Northern Europe, Russia)
    addRow(0.05, 0.26, 0.37, 0.41, 0.43, 0.51, 0.54, 0.56, 0.59, 0.95);
    addRow(0.05, 0.27, 0.36, 0.41, 0.43, 0.52, 0.54, 0.56, 0.58, 0.94);
    addRow(0.04, 0.27, 0.36, 0.40, 0.43, 0.52, 0.54, 0.55, 0.58, 0.93);
    addRow(0.04, 0.27, 0.35, 0.40, 0.43, 0.52, 0.54, 0.55, 0.57, 0.93);

    // ~30% (US/Mexico, Western Europe, Central Asia, China, Japan)
    addRow(0.04, 0.26, 0.35, 0.39, 0.43, 0.53, 0.57, 0.92);
    addRow(0.05, 0.25, 0.35, 0.39, 0.43, 0.54, 0.57, 0.90, 0.91, 0.92);
    addRow(0.05, 0.24, 0.35, 0.38, 0.43, 0.54, 0.56, 0.88, 0.91, 0.92);
    addRow(0.06, 0.23, 0.35, 0.38, 0.43, 0.54, 0.56, 0.87, 0.91, 0.92);
    addRow(0.06, 0.22, 0.36, 0.38, 0.43, 0.54, 0.56, 0.86);

    // ~40% (Southern US, Mediterranean, Middle East, India, China, Japan)
    addRow(0.07, 0.21, 0.36, 0.38, 0.43, 0.55, 0.56, 0.85);
    addRow(0.08, 0.20, 0.43, 0.54, 0.57, 0.60, 0.62, 0.84);
    addRow(0.08, 0.20, 0.43, 0.54, 0.57, 0.60, 0.62, 0.82);
    addRow(0.09, 0.19, 0.43, 0.46, 0.48, 0.53, 0.58, 0.60, 0.62, 0.80);
    addRow(0.10, 0.19, 0.43, 0.45, 0.49, 0.53, 0.58, 0.60, 0.63, 0.78);

    // ~50% (Central America, North Africa, India, SE Asia)
    addRow(0.11, 0.18, 0.37, 0.38, 0.43, 0.56, 0.58, 0.60, 0.64, 0.76);
    addRow(0.11, 0.17, 0.37, 0.38, 0.43, 0.56, 0.59, 0.61, 0.65, 0.76);
    addRow(0.11, 0.16, 0.27, 0.28, 0.43, 0.56, 0.59, 0.62, 0.66, 0.76);
    addRow(0.11, 0.15, 0.26, 0.29, 0.43, 0.56, 0.60, 0.62, 0.67, 0.76);

    // ~55% (Caribbean, Sahel, Arabian Peninsula, India, SE Asia)
    addRow(0.11, 0.14, 0.26, 0.30, 0.43, 0.55, 0.61, 0.63, 0.68, 0.76);
    addRow(0.26, 0.31, 0.43, 0.55, 0.62, 0.64, 0.69, 0.76);
    addRow(0.26, 0.32, 0.43, 0.55, 0.63, 0.64, 0.70, 0.76);
    addRow(0.26, 0.33, 0.43, 0.55, 0.71, 0.76);

    // ~60% (South America, Central Africa, Indonesia)
    addRow(0.27, 0.34, 0.43, 0.55, 0.72, 0.78);
    addRow(0.27, 0.35, 0.44, 0.55, 0.73, 0.80);
    addRow(0.27, 0.36, 0.44, 0.55, 0.74, 0.80);
    addRow(0.27, 0.37, 0.45, 0.55, 0.74, 0.78);

    // ~70% (South America, Southern Africa)
    addRow(0.28, 0.37, 0.46, 0.55, 0.85, 0.87);
    addRow(0.28, 0.37, 0.47, 0.54, 0.85, 0.88);
    addRow(0.29, 0.36, 0.47, 0.53, 0.85, 0.88);
    addRow(0.29, 0.36, 0.48, 0.53, 0.85, 0.89);

    // ~80% (Southern South America, tip of Africa, Australia)
    addRow(0.30, 0.35, 0.49, 0.52, 0.85, 0.90);
    addRow(0.30, 0.34, 0.49, 0.52, 0.85, 0.90);
    addRow(0.31, 0.34, 0.85, 0.90);
    addRow(0.31, 0.33, 0.86, 0.90);

    // ~85% (Argentina/Chile, Australia)
    addRow(0.31, 0.33, 0.86, 0.89);
    addRow(0.31, 0.32, 0.86, 0.89);
    addRow(0.31, 0.32);

    // ~90% (Patagonia, New Zealand)
    addRow(0.31, 0.32, 0.90, 0.91);
    addRow(0.31, 0.32, 0.90, 0.91);

    return rows;
  }
})();
