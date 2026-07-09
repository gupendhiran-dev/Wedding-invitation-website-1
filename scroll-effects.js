/* ══════════════════════════════════════════════════════
   WEDDING INVITATION — scroll-effects.js
   ══════════════════════════════════════════════════════ */

function initScrollEffects() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

  // ── Organic Wildlife Flight Paths (GSAP MotionPath) ───
  // Butterflies
  gsap.to(".b1", {
    duration: 25, repeat: -1, ease: "none",
    motionPath: {
      path: [{x:0, y:0}, {x:150, y:-100}, {x:300, y:50}, {x:450, y:-150}, {x:window.innerWidth, y:-50}],
      curviness: 2, autoRotate: true
    }
  });
  
  gsap.to(".b2", {
    duration: 35, repeat: -1, ease: "none", delay: 2,
    motionPath: {
      path: [{x:window.innerWidth, y:200}, {x:window.innerWidth-300, y:50}, {x:window.innerWidth-600, y:150}, {x:-100, y:-50}],
      curviness: 1.5, autoRotate: true
    }
  });

  // Birds (Parallax combined with MotionPath)
  gsap.to(".bird-1", {
    duration: 22, repeat: -1, ease: "sine.inOut",
    motionPath: {
      path: [{x:-100, y:100}, {x: window.innerWidth * 0.3, y: 50}, {x: window.innerWidth * 0.7, y: 120}, {x: window.innerWidth + 100, y: 20}],
      curviness: 1.2
    }
  });

  gsap.to(".bird-2", {
    duration: 28, repeat: -1, ease: "sine.inOut", delay: 4,
    motionPath: {
      path: [{x:-100, y:50}, {x: window.innerWidth * 0.4, y: 150}, {x: window.innerWidth * 0.8, y: 80}, {x: window.innerWidth + 100, y: 150}],
      curviness: 1.2
    }
  });

  // Keep the rest of your ScrollTrigger animations intact exactly as they were!
  // (Parallax hero layers, Couple card reveals, Timeline reveals, etc.)
}
