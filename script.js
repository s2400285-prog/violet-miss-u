/* ================================================
   JULIE2 - VIOLET DREAMSCAPE LOVE WEBSITE
   script.js
   ================================================ */

'use strict';

// ============================================================
// CANVAS BACKGROUND: Floating Hearts, Stars, Petals, Particles
// ============================================================
(function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  });

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Particles (tiny stars & sparkles) ----
  const NUM_PARTICLES = prefersReducedMotion ? 20 : 80;
  const particles = [];

  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 + 0.4,
      speed: Math.random() * 0.3 + 0.05,
      opacity: Math.random(),
      opacityDir: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.01 + 0.003),
      hue: Math.random() * 60 + 260, // violet/purple range
    });
  }

  // ---- Floating Hearts ----
  const NUM_HEARTS = prefersReducedMotion ? 4 : 14;
  const hearts = [];

  function createHeart() {
    return {
      x: Math.random() * W,
      y: H + 40,
      size: Math.random() * 18 + 10,
      speed: Math.random() * 0.8 + 0.3,
      drift: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03,
    };
  }

  for (let i = 0; i < NUM_HEARTS; i++) {
    const h = createHeart();
    h.y = Math.random() * H; // spread initially
    hearts.push(h);
  }

  // Draw a heart shape on canvas
  function drawHeart(ctx, x, y, size, opacity, color) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color || `hsl(${280 + Math.random() * 40}, 80%, 70%)`;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x, y - size * 0.3, x - size * 0.5, y - size, x - size * 0.5, y - size * 0.5);
    ctx.bezierCurveTo(x - size * 0.5, y - size * 1.0, x, y - size * 0.7, x, y - size * 0.4);
    ctx.bezierCurveTo(x, y - size * 0.7, x + size * 0.5, y - size * 1.0, x + size * 0.5, y - size * 0.5);
    ctx.bezierCurveTo(x + size * 0.5, y - size, x, y - size * 0.3, x, y);
    ctx.fill();
    ctx.shadowColor = `rgba(200, 80, 255, 0.6)`;
    ctx.shadowBlur = 8;
    ctx.restore();
  }

  // ---- Falling Petals ----
  const NUM_PETALS = prefersReducedMotion ? 5 : 18;
  const petals = [];

  function createPetal() {
    return {
      x: Math.random() * W,
      y: -20,
      size: Math.random() * 10 + 5,
      speed: Math.random() * 1.2 + 0.4,
      drift: (Math.random() - 0.5) * 1.5,
      sway: Math.random() * 0.04 + 0.02,
      swayAngle: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.5 + 0.2,
      hue: Math.random() * 60 + 260,
    };
  }

  for (let i = 0; i < NUM_PETALS; i++) {
    const p = createPetal();
    p.y = Math.random() * H;
    petals.push(p);
  }

  function drawPetal(ctx, p) {
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = `hsl(${p.hue}, 70%, 75%)`;
    ctx.shadowColor = `rgba(200, 100, 255, 0.4)`;
    ctx.shadowBlur = 6;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.swayAngle);
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // ---- Animation Loop ----
  function animate() {
    ctx.clearRect(0, 0, W, H);

    // Draw particles
    particles.forEach(p => {
      p.opacity += p.opacityDir;
      if (p.opacity <= 0 || p.opacity >= 1) p.opacityDir *= -1;
      p.y -= p.speed;
      if (p.y < 0) { p.y = H; p.x = Math.random() * W; }

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = `hsl(${p.hue}, 80%, 80%)`;
      ctx.shadowColor = `hsl(${p.hue}, 100%, 85%)`;
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw floating hearts
    hearts.forEach((h, i) => {
      h.y -= h.speed;
      h.x += h.drift;
      h.rotation += h.rotSpeed;
      if (h.y < -50) {
        hearts[i] = createHeart();
      }
      ctx.save();
      ctx.translate(h.x, h.y);
      ctx.rotate(h.rotation);
      drawHeart(ctx, 0, 0, h.size, h.opacity, `hsla(${280 + Math.random() * 40}, 80%, 70%, 1)`);
      ctx.restore();
    });

    // Draw petals
    petals.forEach((p, i) => {
      p.y += p.speed;
      p.swayAngle += p.sway;
      p.x += Math.sin(p.swayAngle) * p.drift;
      if (p.y > H + 30) {
        petals[i] = createPetal();
      }
      drawPetal(ctx, p);
    });

    requestAnimationFrame(animate);
  }

  animate();
})();


// ============================================================
// HERO BUTTON: Smooth scroll to Love Letter
// ============================================================
(function initHeroButton() {
  const btn = document.getElementById('openHeartBtn');
  const target = document.getElementById('loveLetter');
  if (!btn || !target) return;

  btn.addEventListener('click', () => {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();


// ============================================================
// REASON CARDS: Modal popup
// ============================================================
(function initReasonCards() {
  const cards = document.querySelectorAll('.reason-card');
  const modal = document.getElementById('reasonModal');
  const closeBtn = document.getElementById('closeReasonBtn');
  const titleEl = document.getElementById('reasonModalTitle');
  const msgEl = document.getElementById('reasonModalMsg');
  const iconEl = document.getElementById('reasonModalIcon');

  if (!modal) return;

  function openReasonModal(card) {
    titleEl.textContent = card.dataset.title || '';
    msgEl.textContent = card.dataset.msg || '';
    iconEl.textContent = card.dataset.icon || '💜';
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeReasonModal() {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  cards.forEach(card => {
    card.addEventListener('click', () => openReasonModal(card));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openReasonModal(card);
      }
    });
  });

  closeBtn.addEventListener('click', closeReasonModal);

  modal.addEventListener('click', e => {
    if (e.target === modal) closeReasonModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closeReasonModal();
  });
})();


// ============================================================
// PROMISE MODAL
// ============================================================
(function initPromiseModal() {
  const openBtn = document.getElementById('openPromiseBtn');
  const modal = document.getElementById('promiseModal');
  const closeBtn = document.getElementById('closePromiseBtn');

  if (!openBtn || !modal) return;

  // Add sparkle stars inside modal
  function addModalStars(starContainer) {
    if (!starContainer) return;
    starContainer.innerHTML = '';
    for (let i = 0; i < 25; i++) {
      const star = document.createElement('span');
      star.style.cssText = `
        position: absolute;
        width: ${Math.random() * 3 + 1}px;
        height: ${Math.random() * 3 + 1}px;
        background: rgba(220, 180, 255, ${Math.random() * 0.8 + 0.2});
        border-radius: 50%;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: starTwinkle ${Math.random() * 2 + 1.5}s ease-in-out ${Math.random() * 2}s infinite;
      `;
      starContainer.appendChild(star);
    }
  }

  function openPromiseModal() {
    addModalStars(modal.querySelector('.modal-stars'));
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closePromiseModal() {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openPromiseModal);
  closeBtn.addEventListener('click', closePromiseModal);

  modal.addEventListener('click', e => {
    if (e.target === modal) closePromiseModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closePromiseModal();
  });
})();


// ============================================================
// MUSIC PLAYER
// ============================================================
(function initMusicPlayer() {
  const audio       = document.getElementById('bgMusic');
  const playBtn     = document.getElementById('playPauseBtn');
  const rewindBtn   = document.getElementById('rewindBtn');
  const fwdBtn      = document.getElementById('fastFwdBtn');
  const progressBg  = document.getElementById('progressBarBg');
  const progressFill= document.getElementById('progressBarFill');
  const progressThumb= document.getElementById('progressThumb');
  const currentDisp = document.getElementById('timeCurrentDisplay');
  const totalDisp   = document.getElementById('timeTotalDisplay');
  const volSlider   = document.getElementById('volumeSlider');
  const tapBtn      = document.getElementById('tapToPlayBtn');
  const vinyl       = document.getElementById('vinyl');
  const bars        = document.querySelectorAll('.visualizer .bar');

  if (!audio) return;

  let isPlaying = false;
  let isDragging = false;

  // Format seconds to M:SS
  function formatTime(s) {
    if (isNaN(s) || s < 0) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  // Update progress bar UI
  function updateProgress() {
    if (!audio.duration || isDragging) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = pct + '%';
    progressThumb.style.left = pct + '%';
    currentDisp.textContent = formatTime(audio.currentTime);
    progressBg.setAttribute('aria-valuenow', Math.round(pct));
  }

  // Update total duration display
  audio.addEventListener('loadedmetadata', () => {
    totalDisp.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('timeupdate', updateProgress);

  // Play / Pause
  function togglePlay() {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().then(() => {
        tapBtn.classList.remove('visible');
        tapBtn.style.display = 'none';
      }).catch(() => {
        // Autoplay blocked — show tap button
        tapBtn.classList.add('visible');
      });
    }
  }

  audio.addEventListener('play', () => {
    isPlaying = true;
    playBtn.textContent = '⏸';
    vinyl && vinyl.classList.add('spinning');
    animateVisualizer(true);
  });

  audio.addEventListener('pause', () => {
    isPlaying = false;
    playBtn.textContent = '▶';
    vinyl && vinyl.classList.remove('spinning');
    animateVisualizer(false);
  });

  audio.addEventListener('ended', () => {
    isPlaying = false;
    playBtn.textContent = '▶';
    vinyl && vinyl.classList.remove('spinning');
    animateVisualizer(false);
    audio.currentTime = 0;
  });

  playBtn.addEventListener('click', togglePlay);
  tapBtn.addEventListener('click', togglePlay);

  rewindBtn.addEventListener('click', () => {
    audio.currentTime = Math.max(0, audio.currentTime - 10);
  });

  fwdBtn.addEventListener('click', () => {
    audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10);
  });

  // Volume
  volSlider.addEventListener('input', () => {
    audio.volume = volSlider.value;
  });
  audio.volume = parseFloat(volSlider.value);

  // Progress bar click/drag
  function seekTo(e) {
    const rect = progressBg.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const pct = Math.min(1, Math.max(0, x / rect.width));
    if (audio.duration) {
      audio.currentTime = pct * audio.duration;
    }
    progressFill.style.width = (pct * 100) + '%';
    progressThumb.style.left = (pct * 100) + '%';
    currentDisp.textContent = formatTime(pct * (audio.duration || 0));
  }

  progressBg.addEventListener('mousedown', e => {
    isDragging = true;
    seekTo(e);
    document.addEventListener('mousemove', seekTo);
    document.addEventListener('mouseup', () => {
      isDragging = false;
      document.removeEventListener('mousemove', seekTo);
    }, { once: true });
  });

  progressBg.addEventListener('touchstart', e => {
    isDragging = true;
    seekTo(e);
  }, { passive: true });

  progressBg.addEventListener('touchmove', e => {
    seekTo(e);
  }, { passive: true });

  progressBg.addEventListener('touchend', () => { isDragging = false; });

  // Keyboard seek on progress bar
  progressBg.addEventListener('keydown', e => {
    if (!audio.duration) return;
    if (e.key === 'ArrowRight') audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
    if (e.key === 'ArrowLeft')  audio.currentTime = Math.max(0, audio.currentTime - 5);
  });

  // Visualizer animation
  let vizAnimId = null;

  function animateVisualizer(active) {
    if (!active) {
      if (vizAnimId) { cancelAnimationFrame(vizAnimId); vizAnimId = null; }
      bars.forEach(b => { b.style.height = '6px'; });
      return;
    }
    function frame() {
      bars.forEach(b => {
        const h = Math.random() * 40 + 6;
        b.style.height = h + 'px';
      });
      vizAnimId = requestAnimationFrame(frame);
    }
    frame();
  }

  // Attempt autoplay
  audio.play().then(() => {
    tapBtn.classList.remove('visible');
  }).catch(() => {
    tapBtn.classList.add('visible');
    tapBtn.style.display = 'inline-block';
  });
})();


// ============================================================
// PHOTO GALLERY & LIGHTBOX
// ============================================================
(function initGallery() {
  const items      = document.querySelectorAll('.gallery-item');
  const lightbox   = document.getElementById('lightbox');
  const lbImg      = document.getElementById('lightboxImg');
  const lbCaption  = document.getElementById('lightboxCaption');
  const lbClose    = document.getElementById('closeLightboxBtn');

  if (!lightbox) return;

  function openLightbox(src, caption) {
    lbImg.src = src;
    lbImg.alt = caption;
    lbCaption.textContent = caption;
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  items.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.dataset.src;
      const caption = item.dataset.caption;
      // Only open if image loaded (not missing)
      if (!item.classList.contains('img-missing')) {
        openLightbox(src, caption);
      }
    });

    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !lightbox.hasAttribute('hidden')) closeLightbox();
  });
})();


// ============================================================
// ENVELOPE INTERACTION
// ============================================================
(function initEnvelope() {
  const env    = document.getElementById('envelopeEl');
  const letter = document.getElementById('envelopeLetter');

  if (!env || !letter) return;

  let opened = false;

  function toggleEnvelope() {
    opened = !opened;
    env.setAttribute('aria-expanded', opened ? 'true' : 'false');
    env.classList.toggle('open', opened);
    if (opened) {
      letter.removeAttribute('hidden');
    } else {
      letter.setAttribute('hidden', '');
    }
  }

  env.addEventListener('click', toggleEnvelope);
  env.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleEnvelope();
    }
  });
})();


// ============================================================
// SEND LOVE BUTTON: Heart Shower
// ============================================================
(function initSendLove() {
  const sendBtn    = document.getElementById('sendLoveBtn');
  const showerDiv  = document.getElementById('heartShower');

  if (!sendBtn || !showerDiv) return;

  const HEARTS = ['💜', '💜', '💜', '💗', '💖', '✨', '💜'];

  function launchHeartShower() {
    showerDiv.innerHTML = '';

    const count = 50;
    for (let i = 0; i < count; i++) {
      const h = document.createElement('span');
      h.className = 'shower-heart';
      h.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
      h.style.cssText = `
        left: ${Math.random() * 100}%;
        font-size: ${Math.random() * 1.5 + 1}rem;
        animation-duration: ${Math.random() * 2 + 2}s;
        animation-delay: ${Math.random() * 1.5}s;
      `;
      showerDiv.appendChild(h);
    }

    // Clean up after shower
    setTimeout(() => { showerDiv.innerHTML = ''; }, 5000);
  }

  sendBtn.addEventListener('click', launchHeartShower);
})();


// ============================================================
// HUG BUTTON & MODAL
// ============================================================
(function initHugModal() {
  const hugBtn   = document.getElementById('hugBtn');
  const modal    = document.getElementById('hugModal');
  const closeBtn = document.getElementById('closeHugBtn');

  if (!hugBtn || !modal) return;

  function openHugModal() {
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeHugModal() {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  hugBtn.addEventListener('click', () => {
    openHugModal();
    // Also trigger a small heart shower
    const showerDiv = document.getElementById('heartShower');
    if (showerDiv) {
      showerDiv.innerHTML = '';
      for (let i = 0; i < 30; i++) {
        const h = document.createElement('span');
        h.className = 'shower-heart';
        h.textContent = ['💜', '🤍', '✨', '💜'][Math.floor(Math.random() * 4)];
        h.style.cssText = `
          left: ${Math.random() * 100}%;
          font-size: ${Math.random() * 1 + 0.8}rem;
          animation-duration: ${Math.random() * 2 + 2}s;
          animation-delay: ${Math.random() * 1}s;
        `;
        showerDiv.appendChild(h);
      }
      setTimeout(() => { showerDiv.innerHTML = ''; }, 5000);
    }
  });

  closeBtn.addEventListener('click', closeHugModal);
  modal.addEventListener('click', e => {
    if (e.target === modal) closeHugModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closeHugModal();
  });
})();


// ============================================================
// TIMELINE: Scroll-reveal animation
// ============================================================
(function initTimelineReveal() {
  const items = document.querySelectorAll('.timeline-item');
  if (!items.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Set initial hidden state
  items.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(item => observer.observe(item));
})();


// ============================================================
// REASON CARDS & GALLERY: Scroll-reveal
// ============================================================
(function initCardReveal() {
  const cards = document.querySelectorAll('.reason-card, .gallery-item');
  if (!cards.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(25px)';
    card.style.transition = `opacity 0.5s ease ${(i % 4) * 0.1}s, transform 0.5s ease ${(i % 4) * 0.1}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => observer.observe(card));
})();


// ============================================================
// SECTION HEADERS: Fade in on scroll
// ============================================================
(function initHeaderReveal() {
  const headers = document.querySelectorAll('.section-header, .final-title, .final-message, .letter-card, .promise-inner');
  if (!headers.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  headers.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  headers.forEach(el => observer.observe(el));
})();


// ============================================================
// PREVENT HORIZONTAL OVERFLOW (safety measure)
// ============================================================
(function preventHorizontalOverflow() {
  document.body.style.overflowX = 'hidden';
})();


// ============================================================
// CONSOLE LOVE NOTE  :)
// ============================================================
console.log('%c💜 Made with love for Baby Julie 💜', 'color: #d8b4fe; font-size: 16px; font-weight: bold;');
console.log('%cEvery line of this code carries a little piece of my heart.', 'color: #a78bca; font-size: 12px;');
