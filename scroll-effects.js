/* ══════════════════════════════════════════════════════
   WEDDING INVITATION — scroll-effects.js
   Handles: GSAP ScrollTrigger parallax, section reveals,
            timeline animations, pinned panels
   ══════════════════════════════════════════════════════ */

// Wait for DOM + loader before initializing scroll effects
function initScrollEffects() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP not loaded, using fallback scroll.');
    initFallbackScroll();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // ── Parallax Hero Layers ──────────────────────────────
  const heroLayers = document.querySelectorAll('.parallax-layer');
  heroLayers.forEach(layer => {
    const speed  = parseFloat(layer.dataset.speed || 0.3);
    const invert = speed < 0.3 ? 1 : -1;

    gsap.to(layer, {
      yPercent: invert * speed * 80,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });
  });

  // ── Hero Content Fade Out ─────────────────────────────
  gsap.to('.hero-content', {
    opacity: 0,
    y: -60,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: '60% top',
      end: 'bottom top',
      scrub: 1,
    }
  });

  gsap.to('.scroll-indicator', {
    opacity: 0,
    scrollTrigger: {
      trigger: '#hero',
      start: '20% top',
      end: '40% top',
      scrub: true,
    }
  });

  // ── Birds Parallax ────────────────────────────────────
  gsap.to('.birds-container', {
    yPercent: -20,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 2,
    }
  });

  // ── SECTION REVEAL ANIMATIONS ─────────────────────────

  // Generic scroll-reveal for all marked elements
  function revealElements(selector, vars = {}) {
    gsap.utils.toArray(selector).forEach((el, i) => {
      const dir  = el.classList.contains('reveal-left')  ? { x: -50 } :
                   el.classList.contains('reveal-right') ? { x:  50 } :
                   el.classList.contains('reveal-scale') ? { scale: 0.88 } :
                                                           { y: 40 };
      gsap.fromTo(el,
        { opacity: 0, ...dir },
        {
          opacity: 1, x: 0, y: 0, scale: 1,
          duration: 0.9,
          ease: 'power3.out',
          delay: i * 0.08,
          ...vars,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          }
        }
      );
    });
  }

  revealElements('.reveal-up');
  revealElements('.reveal-left');
  revealElements('.reveal-right');
  revealElements('.reveal-scale');

  // ── Couple Section ────────────────────────────────────
  gsap.from('.couple-card', {
    opacity: 0,
    y: 60,
    stagger: 0.25,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#couple',
      start: 'top 70%',
    }
  });

  gsap.from('.couple-center-ornament', {
    opacity: 0,
    scale: 0.5,
    rotate: 45,
    duration: 1.2,
    ease: 'elastic.out(1, 0.6)',
    scrollTrigger: {
      trigger: '#couple',
      start: 'top 60%',
    }
  });

  // ── Rings pulse on scroll ─────────────────────────────
  gsap.fromTo('.photo-ring.outer', 
    { scale: 0.95, opacity: 0.3 },
    {
      scale: 1.05, opacity: 0.8,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      duration: 2,
    }
  );

  // ── Story Timeline ────────────────────────────────────
  const timelineItems = gsap.utils.toArray('.timeline-item');
  timelineItems.forEach((item, i) => {
    const isOdd = i % 2 === 0;
    const fromX = isOdd ? -80 : 80;

    gsap.fromTo(item,
      { opacity: 0, x: fromX },
      {
        opacity: 1, x: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );

    // Dot pop
    gsap.fromTo(item.querySelector('.timeline-dot'),
      { scale: 0 },
      {
        scale: 1,
        duration: 0.5,
        delay: 0.3,
        ease: 'back.out(2)',
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
        }
      }
    );
  });

  // Timeline line draw
  gsap.fromTo('.timeline-line',
    { scaleY: 0, transformOrigin: 'top center' },
    {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '.timeline',
        start: 'top 70%',
        end: 'bottom 80%',
        scrub: 1,
      }
    }
  );

  // ── Countdown Section Entrance ────────────────────────
  gsap.from('.timer-block', {
    opacity: 0,
    y: 50,
    scale: 0.8,
    stagger: 0.12,
    duration: 0.8,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: '#countdown',
      start: 'top 75%',
    }
  });

  gsap.from('.countdown-heading', {
    opacity: 0,
    scale: 0.7,
    duration: 1.2,
    ease: 'elastic.out(1, 0.5)',
    scrollTrigger: {
      trigger: '#countdown',
      start: 'top 80%',
    }
  });

  // ── Events Cards ──────────────────────────────────────
  gsap.from('.event-card', {
    opacity: 0,
    y: 60,
    stagger: {
      each: 0.12,
      from: 'start',
    },
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#events',
      start: 'top 70%',
    }
  });

  // Featured card glow pulse
  gsap.to('.featured-card', {
    boxShadow: '0 12px 60px rgba(200,140,160,0.4)',
    duration: 2,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut',
  });

  // ── Gallery Items ─────────────────────────────────────
  gsap.from('.gallery-item', {
    opacity: 0,
    scale: 0.85,
    stagger: {
      each: 0.08,
      from: 'random',
    },
    duration: 0.7,
    ease: 'back.out(1.5)',
    scrollTrigger: {
      trigger: '#gallery',
      start: 'top 75%',
    }
  });

  // ── Venue Section ─────────────────────────────────────
  gsap.from('.venue-card', {
    opacity: 0,
    x: -80,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#venue',
      start: 'top 70%',
    }
  });

  gsap.from('.venue-map-wrap', {
    opacity: 0,
    x: 80,
    duration: 1,
    delay: 0.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#venue',
      start: 'top 70%',
    }
  });

  // Moving clouds behind venue
  gsap.to('.vc1', { x: 'calc(100vw + 300px)', duration: 25, ease: 'none', repeat: -1 });
  gsap.to('.vc2', { x: 'calc(100vw + 300px)', duration: 35, ease: 'none', repeat: -1, delay: 8 });
  gsap.to('.vc3', { x: 'calc(100vw + 300px)', duration: 20, ease: 'none', repeat: -1, delay: 15 });

  // ── RSVP Section ──────────────────────────────────────
  gsap.from('.rsvp-form-wrap', {
    opacity: 0,
    y: 60,
    scale: 0.95,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#rsvp',
      start: 'top 75%',
    }
  });

  // Form fields stagger
  gsap.from('.form-group', {
    opacity: 0,
    y: 20,
    stagger: 0.1,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.rsvp-form',
      start: 'top 80%',
    }
  });

  // ── Thank You Section ─────────────────────────────────
  gsap.from('.thankyou-couple-photo', {
    opacity: 0,
    scale: 0.6,
    duration: 1.5,
    ease: 'elastic.out(1, 0.5)',
    scrollTrigger: {
      trigger: '#thankyou',
      start: 'top 75%',
    }
  });

  gsap.from('.thankyou-title', {
    opacity: 0,
    y: 40,
    duration: 1,
    delay: 0.4,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#thankyou',
      start: 'top 75%',
    }
  });

  gsap.from('.thankyou-message', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 0.7,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#thankyou',
      start: 'top 75%',
    }
  });

  // ── Section Header Stagger ────────────────────────────
  gsap.utils.toArray('.section-header').forEach(header => {
    const children = header.children;
    gsap.from(children, {
      opacity: 0,
      y: 30,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
      }
    });
  });

  // ── Floating Petals Parallax ──────────────────────────
  gsap.to('.petals-container', {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 2,
    }
  });

  // ── Butterflies Drift ─────────────────────────────────
  gsap.to('.butterflies-container', {
    yPercent: -10,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 3,
    }
  });

  // ── Event Card Hover Sparkle ──────────────────────────
  document.querySelectorAll('.event-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card.querySelector('.event-icon'), {
        scale: 1.3,
        rotate: 10,
        duration: 0.4,
        ease: 'back.out(2)',
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card.querySelector('.event-icon'), {
        scale: 1,
        rotate: 0,
        duration: 0.4,
        ease: 'power2.out',
      });
    });
  });

  // ── Smooth Scrolling Enhancement ─────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        gsap.to(window, {
          scrollTo: { y: target, offsetY: 0 },
          duration: 1.5,
          ease: 'power3.inOut',
        });
      }
    });
  });

  // ── Add GSAP ScrollTo if available ───────────────────
  // (polyfill if plugin not loaded)
  if (!gsap.plugins || !gsap.plugins.scrollTo) {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }
}

// ── Fallback scroll reveal (no GSAP) ─────────────────
function initFallbackScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale')
    .forEach(el => observer.observe(el));
}

// ── Navigation active state ───────────────────────────
function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');

  ScrollTrigger.create({
    onUpdate: () => {
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 200 && rect.bottom >= 200) {
          document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
          const link = document.querySelector(`.nav-link[href="#${section.id}"]`);
          if (link) link.classList.add('active');
        }
      });
    }
  });
}

// ── Initialize when ready ─────────────────────────────
// Called from animations.js initAll()
function initScrollEffectsDeferred() {
  initScrollEffects();
  if (typeof ScrollTrigger !== 'undefined') {
    initNavHighlight();
  }
}

// Trigger when loader finishes (animations.js calls initAll → but we also hook here)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Will be called by animations.js initAll()
    // But provide fallback:
    setTimeout(() => {
      if (!document.body.classList.contains('loaded')) {
        initFallbackScroll();
      }
    }, 3500);
  });
} else {
  setTimeout(() => {
    if (!document.body.classList.contains('loaded')) {
      initFallbackScroll();
    }
  }, 3500);
}

// Expose to animations.js
window.initScrollEffectsDeferred = initScrollEffectsDeferred;
