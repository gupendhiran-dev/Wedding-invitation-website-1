/* ══════════════════════════════════════════════════════
   WEDDING INVITATION — animations.js
   Handles: Three.js particles, petals, butterflies,
            stars, loader, countdown, RSVP, cursor, music
   ══════════════════════════════════════════════════════ */

// ── Loader ────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('hidden');
    document.body.classList.add('loaded');
    initAll();
  }, 2000);
});

function initAll() {
  initCursor();
  initStars();
  initPetals();
  initThreeJS();
  initCountdown();
  initGallery();
  initMusicToggle();
  initFloatingHearts();
  initCountdownParticles();
  initRsvpPetals();
  // Initialize scroll-based GSAP animations (defined in scroll-effects.js)
  if (typeof window.initScrollEffectsDeferred === 'function') {
    window.initScrollEffectsDeferred();
  } else {
    // Fallback: wait for scroll-effects.js to register then call
    setTimeout(() => {
      if (typeof window.initScrollEffectsDeferred === 'function') {
        window.initScrollEffectsDeferred();
      }
    }, 200);
  }
}

// ── Custom Cursor ─────────────────────────────────────
function initCursor() {
  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = 0, my = 0;
  let rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  });

  // Smooth ring follow
  (function animate() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animate);
  })();

  // Hover state
  document.querySelectorAll('a, button, .event-card, .gallery-item, .toggle-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.transform  = 'translate(-50%,-50%) scale(2)';
      ring.style.width     = '50px';
      ring.style.height    = '50px';
      ring.style.borderColor = 'rgba(200,140,160,0.9)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.transform  = 'translate(-50%,-50%) scale(1)';
      ring.style.width     = '32px';
      ring.style.height    = '32px';
      ring.style.borderColor = 'rgba(200,140,160,0.5)';
    });
  });
}

// ── Stars ─────────────────────────────────────────────
function initStars() {
  const container = document.getElementById('stars');
  if (!container) return;
  const count = 120;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    const size = Math.random() * 3 + 1;
    star.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: white;
      top: ${Math.random() * 60}%;
      left: ${Math.random() * 100}%;
      opacity: ${Math.random() * 0.8 + 0.2};
      animation: starTwinkle ${2 + Math.random() * 4}s ease-in-out ${Math.random() * 4}s infinite;
      box-shadow: 0 0 ${size * 2}px rgba(255,255,255,0.6);
    `;
    container.appendChild(star);
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes starTwinkle {
      0%,100% { opacity: 0.2; transform: scale(0.8); }
      50%      { opacity: 1;   transform: scale(1.3); }
    }
  `;
  document.head.appendChild(style);
}

// ── Falling Petals ────────────────────────────────────
function initPetals() {
  const container = document.getElementById('petals');
  if (!container) return;

  const colors = [
    '#f4a7b9', '#e8c5d0', '#f9d0dc',
    '#d4b0e0', '#c5a0d8', '#fbd5e0',
    '#ffb3c6', '#e0c0f0'
  ];

  function createPetal() {
    const petal = document.createElement('div');
    petal.className = 'petal';
    const size = 8 + Math.random() * 14;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const duration = 6 + Math.random() * 10;
    const delay = Math.random() * 12;
    const startX = Math.random() * 100;
    const rotateStart = Math.random() * 360;

    petal.style.cssText = `
      width: ${size}px;
      height: ${size * 1.3}px;
      background: ${color};
      left: ${startX}%;
      opacity: ${0.5 + Math.random() * 0.5};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      transform: rotate(${rotateStart}deg);
      border-radius: ${Math.random() > 0.5 ? '50% 0 50% 0' : '50% 50% 0 50%'};
      box-shadow: 0 0 4px rgba(200,140,160,0.2);
    `;
    container.appendChild(petal);

    // Remove and recreate
    setTimeout(() => {
      petal.remove();
      createPetal();
    }, (duration + delay) * 1000 + 500);
  }

  // Initial burst
  for (let i = 0; i < 30; i++) createPetal();
}

// ── Three.js Particles ────────────────────────────────
function initThreeJS() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // ── Particle Field ──────────────────────────────────
  const particleCount = 600;
  const positions = new Float32Array(particleCount * 3);
  const colors_arr = new Float32Array(particleCount * 3);
  const sizes_arr  = new Float32Array(particleCount);

  const palette = [
    new THREE.Color('#f4a7b9'),
    new THREE.Color('#d4b0e0'),
    new THREE.Color('#fbd5e0'),
    new THREE.Color('#ffcc88'),
    new THREE.Color('#c5b0d4'),
    new THREE.Color('#ffffff'),
  ];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

    const c = palette[Math.floor(Math.random() * palette.length)];
    colors_arr[i * 3]     = c.r;
    colors_arr[i * 3 + 1] = c.g;
    colors_arr[i * 3 + 2] = c.b;

    sizes_arr[i] = Math.random() * 3 + 0.5;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors_arr, 3));
  geo.setAttribute('size',     new THREE.BufferAttribute(sizes_arr, 1));

  const mat = new THREE.PointsMaterial({
    size: 0.06,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // ── Floating Lanterns (small glows) ────────────────
  const lanternGroup = new THREE.Group();
  scene.add(lanternGroup);

  for (let i = 0; i < 12; i++) {
    const lanternGeo = new THREE.SphereGeometry(0.05 + Math.random() * 0.08, 8, 8);
    const lanternMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(0.9 + Math.random() * 0.15, 0.8, 0.7),
      transparent: true,
      opacity: 0.8,
    });
    const lantern = new THREE.Mesh(lanternGeo, lanternMat);
    lantern.position.set(
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 4
    );
    lantern.userData = {
      speed: 0.2 + Math.random() * 0.4,
      amp:   0.3 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2
    };
    lanternGroup.add(lantern);
  }

  // ── Mouse interaction ───────────────────────────────
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.5;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
  });

  // ── Resize ──────────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ── Animation Loop ──────────────────────────────────
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Drift particles slowly
    particles.rotation.y = t * 0.02 + mouseX * 0.3;
    particles.rotation.x = mouseY * 0.2;

    // Float individual particles
    const pos = geo.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3 + 1] += Math.sin(t * 0.5 + i * 0.1) * 0.0005;
    }
    geo.attributes.position.needsUpdate = true;

    // Animate lanterns
    lanternGroup.children.forEach((l, i) => {
      const d = l.userData;
      l.position.y += Math.sin(t * d.speed + d.offset) * 0.002;
      l.position.x += Math.cos(t * d.speed * 0.7 + d.offset) * 0.001;
      l.material.opacity = 0.4 + 0.4 * Math.abs(Math.sin(t * d.speed + d.offset));
    });

    renderer.render(scene, camera);
  }
  animate();
}

// ── Countdown Timer ───────────────────────────────────
function initCountdown() {
  const target = new Date('2026-02-14T09:30:00');

  function update() {
    const now  = new Date();
    const diff = target - now;
    if (diff <= 0) {
      document.getElementById('days').textContent    = '00';
      document.getElementById('hours').textContent   = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    const pad = n => String(n).padStart(2, '0');

    animateNumber('days',    pad(d));
    animateNumber('hours',   pad(h));
    animateNumber('minutes', pad(m));
    animateNumber('seconds', pad(s));
  }

  function animateNumber(id, val) {
    const el = document.getElementById(id);
    if (!el || el.textContent === val) return;
    el.style.transform = 'translateY(-10px)';
    el.style.opacity   = '0';
    setTimeout(() => {
      el.textContent   = val;
      el.style.transition = 'all 0.3s ease';
      el.style.transform = 'translateY(0)';
      el.style.opacity   = '1';
    }, 150);
  }

  update();
  setInterval(update, 1000);
}

// ── Gallery Lightbox ──────────────────────────────────
function initGallery() {
  const items   = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn  = document.getElementById('lightboxPrev');
  const nextBtn  = document.getElementById('lightboxNext');
  const content  = lightbox.querySelector('.lightbox-content');
  let current = 0;

  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      current = i;
      openLightbox(i);
    });
  });

  function openLightbox(index) {
    lightbox.classList.add('active');
    updateLightboxContent(index);
    document.body.style.overflow = 'hidden';
  }

  function updateLightboxContent(index) {
    const total = items.length;
    current = (index + total) % total;
    const label = items[current].querySelector('p');
    const emoji = items[current].querySelector('.gallery-placeholder span');
    content.innerHTML = `
      <div class="lightbox-placeholder">
        <span>${emoji ? emoji.textContent : '📸'}</span>
        <p>${label ? label.textContent : 'Photo ' + (current + 1)}</p>
        <small style="color:rgba(100,60,80,0.6);font-size:0.75rem;margin-top:8px;">${current + 1} / ${total}</small>
      </div>`;
  }

  closeBtn.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  });
  prevBtn.addEventListener('click', () => updateLightboxContent(current - 1));
  nextBtn.addEventListener('click', () => updateLightboxContent(current + 1));
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') { lightbox.classList.remove('active'); document.body.style.overflow=''; }
    if (e.key === 'ArrowLeft')  updateLightboxContent(current - 1);
    if (e.key === 'ArrowRight') updateLightboxContent(current + 1);
  });
}

// ── Music Toggle ──────────────────────────────────────
function initMusicToggle() {
  const btn   = document.getElementById('music-toggle');
  const audio = document.getElementById('bg-music');
  const play  = btn.querySelector('.play-icon');
  const pause = btn.querySelector('.pause-icon');
  const label = btn.querySelector('.music-label');

  if (!audio) return;

  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().catch(() => {});
      play.classList.add('hidden');
      pause.classList.remove('hidden');
      label.textContent = 'Pause';
    } else {
      audio.pause();
      play.classList.remove('hidden');
      pause.classList.add('hidden');
      label.textContent = 'Music';
    }
  });
}

// ── Floating Hearts (Thank You section) ──────────────
function initFloatingHearts() {
  const container = document.getElementById('floatingHearts');
  if (!container) return;

  const heartEmojis = ['💕', '💖', '💗', '💓', '💘', '✨', '🌸'];

  function createHeart() {
    const h = document.createElement('div');
    h.className = 'floating-heart';
    h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    const size = 0.8 + Math.random() * 1.2;
    h.style.cssText = `
      left: ${5 + Math.random() * 90}%;
      bottom: ${Math.random() * 30}%;
      font-size: ${size}rem;
      animation-duration: ${4 + Math.random() * 5}s;
      animation-delay: ${Math.random() * 5}s;
    `;
    container.appendChild(h);
    setTimeout(() => h.remove(), (9 + Math.random() * 5) * 1000);
  }

  setInterval(createHeart, 600);
  for (let i = 0; i < 8; i++) setTimeout(createHeart, i * 300);
}

// ── Countdown Section Sparkle Particles ──────────────
function initCountdownParticles() {
  const container = document.getElementById('countdownParticles');
  if (!container) return;

  function createSparkle() {
    const s = document.createElement('div');
    const size = 2 + Math.random() * 4;
    s.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: rgba(200,140,160,${0.3 + Math.random() * 0.7});
      box-shadow: 0 0 ${size * 3}px rgba(200,140,160,0.6);
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: sparkleFloat ${3 + Math.random() * 5}s ease-in-out ${Math.random() * 3}s infinite;
    `;
    container.appendChild(s);
    if (container.children.length > 60) container.removeChild(container.firstChild);
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes sparkleFloat {
      0%,100% { transform: translate(0,0) scale(1); opacity:0.3; }
      50%      { transform: translate(${(Math.random()-0.5)*40}px, -${20+Math.random()*40}px) scale(1.5); opacity:1; }
    }
  `;
  document.head.appendChild(style);

  for (let i = 0; i < 40; i++) createSparkle();
  setInterval(createSparkle, 500);
}

// ── RSVP Section Petals ───────────────────────────────
function initRsvpPetals() {
  const container = document.getElementById('rsvpPetals');
  if (!container) return;
  const colors = ['#f4a7b9','#e8c5d0','#d4b0e0'];
  for (let i = 0; i < 15; i++) {
    const p = document.createElement('div');
    const sz = 6 + Math.random() * 10;
    p.style.cssText = `
      position: absolute;
      width: ${sz}px; height: ${sz * 1.4}px;
      border-radius: 50% 0 50% 0;
      background: ${colors[Math.floor(Math.random()*colors.length)]};
      left: ${Math.random()*100}%;
      top: -10px;
      opacity: 0.3;
      animation: petalFall ${8+Math.random()*8}s linear ${Math.random()*10}s infinite;
    `;
    container.appendChild(p);
  }
}

// ── RSVP Submit ───────────────────────────────────────
function handleRSVP(e) {
  e.preventDefault();
  const form    = document.getElementById('rsvpForm');
  const success = document.getElementById('rsvpSuccess');
  const btn     = document.getElementById('rsvpBtn');

  btn.textContent = '💕 Sending…';
  btn.disabled = true;

  // Simulate submission
  setTimeout(() => {
    form.classList.add('hidden');
    success.classList.remove('hidden');

    // Burst of hearts
    const container = document.getElementById('rsvpPetals');
    if (container) {
      for (let i = 0; i < 20; i++) {
        const h = document.createElement('div');
        h.style.cssText = `
          position: absolute;
          font-size: ${1 + Math.random()}rem;
          left: ${20 + Math.random() * 60}%;
          top: ${20 + Math.random() * 60}%;
          animation: heartBurst 1.5s ease-out ${Math.random() * 0.5}s forwards;
          pointer-events: none;
        `;
        h.textContent = ['💕','💖','💗','✨','🌸'][Math.floor(Math.random() * 5)];
        container.appendChild(h);
      }
    }
  }, 1500);
}

const heartBurstStyle = document.createElement('style');
heartBurstStyle.textContent = `
  @keyframes heartBurst {
    0%   { transform: scale(0) translate(0,0); opacity:1; }
    100% { transform: scale(1.5) translate(${(Math.random()-0.5)*100}px, -80px); opacity:0; }
  }
`;
document.head.appendChild(heartBurstStyle);
