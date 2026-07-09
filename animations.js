/* ══════════════════════════════════════════════════════
   WEDDING INVITATION — animations.js
   ══════════════════════════════════════════════════════ */

window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    document.body.classList.add('loaded');
    initAll();
  }, 2000);
});

function initAll() {
  initCursor();
  initMagneticUI();
  initThreeJS();
  initMusicToggle();
  // ... call other existing functions (initCountdown, etc.)
  if (typeof window.initScrollEffectsDeferred === 'function') {
    window.initScrollEffectsDeferred();
  }
}

// ── Magnetic UI Buttons ───────────────────────────────
function initMagneticUI() {
  const magnets = document.querySelectorAll('.magnetic');
  magnets.forEach(magnet => {
    magnet.addEventListener('mousemove', (e) => {
      const rect = magnet.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(magnet, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power2.out' });
      gsap.to(magnet.querySelector('svg, span'), { x: x * 0.15, y: y * 0.15, duration: 0.4, ease: 'power2.out' });
    });

    magnet.addEventListener('mouseleave', () => {
      gsap.to(magnet, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' });
      gsap.to(magnet.querySelector('svg, span'), { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' });
    });
  });
}

// ── Advanced Custom WebGL Three.js ────────────────────
function initThreeJS() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const particleCount = 800;
  const positions = new Float32Array(particleCount * 3);
  const colors_arr = new Float32Array(particleCount * 3);
  const sizes_arr  = new Float32Array(particleCount);

  const palette = [ '#f4a7b9', '#d4b0e0', '#fbd5e0', '#ffcc88', '#ffffff' ];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 25;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

    const c = new THREE.Color(palette[Math.floor(Math.random() * palette.length)]);
    colors_arr[i * 3] = c.r; colors_arr[i * 3 + 1] = c.g; colors_arr[i * 3 + 2] = c.b;
    sizes_arr[i] = Math.random() * 8.0 + 2.0; // Larger for glowing effect
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('customColor', new THREE.BufferAttribute(colors_arr, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(sizes_arr, 1));

  // Custom Shader for True Volumetric Glow & Mouse Repulsion
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      mouse: { value: new THREE.Vector3(0, 0, 0) }
    },
    vertexShader: `
      uniform float time;
      uniform vec3 mouse;
      attribute float size;
      attribute vec3 customColor;
      varying vec3 vColor;
      
      void main() {
        vColor = customColor;
        vec3 pos = position;
        
        // Organic repelling physics from mouse
        float dist = distance(pos.xy, mouse.xy);
        float force = max(0.0, 2.5 - dist); // radius of interaction
        pos.xy += normalize(pos.xy - mouse.xy) * (force * 0.5);
        
        // Gentle undulating float
        pos.y += sin(time * 0.4 + pos.x) * 0.15;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        // Create a soft glowing radial gradient
        vec2 xy = gl_PointCoord.xy - vec2(0.5);
        float ll = length(xy);
        if(ll > 0.5) discard;
        float alpha = exp(-ll * ll * 15.0); // Gaussian falloff for bloom
        gl_FragColor = vec4(vColor, alpha * 0.85);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particles = new THREE.Points(geo, material);
  scene.add(particles);

  // Translate Mouse to 3D Space for Shaders
  let mouse = new THREE.Vector2();
  let targetMouse = new THREE.Vector3(0, 0, 0);

  document.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    
    let vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    vector.unproject(camera);
    let dir = vector.sub(camera.position).normalize();
    let distance = -camera.position.z / dir.z;
    targetMouse.copy(camera.position).add(dir.multiplyScalar(distance));
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    
    // Smooth lerp mouse physics
    material.uniforms.time.value = t;
    material.uniforms.mouse.value.lerp(targetMouse, 0.05);

    // Subtle scene drift
    particles.rotation.y = t * 0.03;

    renderer.render(scene, camera);
  }
  animate();
}

// ── Cinematic Audio Fading ────────────────────────────
function initMusicToggle() {
  const btn = document.getElementById('music-toggle');
  const audio = document.getElementById('bg-music');
  if (!audio) return;

  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.volume = 0;
      audio.play().catch(() => {});
      gsap.to(audio, { volume: 0.7, duration: 2, ease: 'power2.inOut' });
      
      btn.querySelector('.play-icon').classList.add('hidden');
      btn.querySelector('.pause-icon').classList.remove('hidden');
      btn.querySelector('.music-label').textContent = 'Pause';
    } else {
      gsap.to(audio, { 
        volume: 0, 
        duration: 1.5, 
        ease: 'power2.inOut',
        onComplete: () => audio.pause() 
      });
      
      btn.querySelector('.play-icon').classList.remove('hidden');
      btn.querySelector('.pause-icon').classList.add('hidden');
      btn.querySelector('.music-label').textContent = 'Music';
    }
  });
}

// ... Keep your existing custom cursor logic, it will now override the hidden default cursor.
