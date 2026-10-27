  let isOpening = false;
  let confettiRainInterval = null;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const birthdaySong = document.getElementById('birthday-song');

  function startBirthdaySong() {
    birthdaySong.play().catch(error => {
      if (error.name !== 'NotAllowedError') {
        console.error('Could not play the birthday song:', error);
      }
    });
  }

  startBirthdaySong();

  function openGift() {
    if (isOpening) return;
    isOpening = true;
    if (birthdaySong.paused) startBirthdaySong();

    const giftScreen = document.getElementById('gift-screen');
    const wrapper    = document.getElementById('gift-wrapper');
    const glow       = document.getElementById('giftGlow');
    wrapper.setAttribute('aria-disabled', 'true');

    if (reducedMotion) {
      showLetter();
      return;
    }

    wrapper.classList.add('opening');
    glow.classList.add('active');
    spawnParticles();
    spawnConfetti();
    startConfettiRain();

    setTimeout(() => {
      giftScreen.classList.add('fade-out');
    }, 1400);

    setTimeout(() => {
      showLetter();
    }, 2000);
  }

  function showLetter() {
    document.getElementById('gift-screen').style.display = 'none';

    const letterScreen = document.getElementById('letter-screen');
    letterScreen.classList.add('visible');

    const delays = [0.1, 0.5, 0.9, 1.3, 1.8, 2.3];
    const ids = ['p1', 'p2', 'p3', 'p4', 'greeting', 'p5'];

    ids.forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;

      const reveal = () => {
        el.classList.add('revealed');
        el.style.animationDelay = '0s';
      };

      if (reducedMotion) {
        reveal();
      } else {
        setTimeout(reveal, delays[i] * 1000);
      }
    });

    if (!reducedMotion) setTimeout(spawnSparkles, 450);
  }

  function resetToGift() {
    const letterScreen = document.getElementById('letter-screen');
    const giftScreen   = document.getElementById('gift-screen');
    const wrapper = document.getElementById('gift-wrapper');

    letterScreen.classList.remove('visible');
    letterScreen.style.display = '';

    ['p1', 'p2', 'p3', 'p4', 'greeting', 'p5'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.classList.remove('revealed'); el.style.opacity = '0'; }
    });

    giftScreen.style.display = '';
    giftScreen.classList.remove('fade-out');
    giftScreen.style.opacity = '1';

    wrapper.classList.remove('opening');
    wrapper.removeAttribute('aria-disabled');

    const glow = document.getElementById('giftGlow');
    glow.classList.remove('active');

    window.clearInterval(confettiRainInterval);
    confettiRainInterval = null;
    document.getElementById('confetti-layer').replaceChildren();
    document.getElementById('sparkle-canvas').getContext('2d').clearRect(
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );
    isOpening = false;
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    wrapper.focus({ preventScroll: true });
  }

  function spawnConfetti() {
    const layer = document.getElementById('confetti-layer');
    const colors = ['#78D6AD', '#a8e8cc', '#F0E58A', '#f4b7a9', '#ffffff'];
    const box = document.getElementById('gift-wrapper').getBoundingClientRect();
    const originX = box.left + box.width / 2;
    const originY = box.top + box.height / 2;

    for (let i = 0; i < 64; i++) {
      const piece = document.createElement('span');
      const size = 6 + Math.random() * 7;
      const angle = Math.random() * Math.PI * 2;
      const burstDistance = 110 + Math.random() * 260;
      piece.className = 'confetti-piece';
      piece.style.setProperty('--confetti-origin-x', `${originX}px`);
      piece.style.setProperty('--confetti-origin-y', `${originY}px`);
      piece.style.setProperty('--confetti-size', `${size}px`);
      piece.style.setProperty('--confetti-color', colors[Math.floor(Math.random() * colors.length)]);
      piece.style.setProperty('--confetti-duration', `${5.5 + Math.random() * 2}s`);
      piece.style.setProperty('--confetti-delay', `${Math.random() * 0.16}s`);
      piece.style.setProperty('--confetti-burst-x', `${Math.cos(angle) * burstDistance}px`);
      piece.style.setProperty('--confetti-burst-y', `${Math.sin(angle) * burstDistance}px`);
      piece.style.setProperty('--confetti-drift', `${Math.random() * 120 - 60}px`);
      piece.style.setProperty('--confetti-fall-distance', `${45 + Math.random() * 40}vh`);
      piece.style.setProperty('--confetti-rotation', `${Math.random() * 720 + 360}deg`);
      layer.appendChild(piece);
      piece.addEventListener('animationend', () => piece.remove(), { once: true });
    }
  }

  function startConfettiRain() {
    const layer = document.getElementById('confetti-layer');
    const colors = ['#78D6AD', '#a8e8cc', '#F0E58A', '#f4b7a9', '#ffffff'];

    confettiRainInterval = window.setInterval(() => {
      const piece = document.createElement('span');
      const size = 5 + Math.random() * 6;
      piece.className = 'confetti-rain-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.setProperty('--confetti-size', `${size}px`);
      piece.style.setProperty('--confetti-color', colors[Math.floor(Math.random() * colors.length)]);
      piece.style.setProperty('--confetti-duration', `${6 + Math.random() * 3}s`);
      piece.style.setProperty('--confetti-drift', `${Math.random() * 180 - 90}px`);
      piece.style.setProperty('--confetti-rotation', `${Math.random() * 720 - 360}deg`);
      layer.appendChild(piece);
      piece.addEventListener('animationend', () => piece.remove(), { once: true });
    }, 220);
  }

  /* ─ Particles ──────────────────────────────────────────────────────── */
  function spawnParticles() {
    const container = document.getElementById('gift-wrapper');
    const colors    = ['#78D6AD','#a8e8cc','#F0E58A','#ffffff'];

    for (let i = 0; i < 18; i++) {
      const dot = document.createElement('div');
      dot.className = 'particle';

      const size = 4 + Math.random() * 6;
      dot.style.cssText = `
        width:${size}px; height:${size}px;
        background:${colors[Math.floor(Math.random()*colors.length)]};
        left:${40+Math.random()*120}px;
        top:${40+Math.random()*80}px;
        border-radius:50%;
      `;

      const angle = (Math.random() * 360) * (Math.PI/180);
      const dist  = 60 + Math.random() * 80;
      const dx    = Math.cos(angle) * dist;
      const dy    = Math.sin(angle) * dist - 40;
      const dur   = 0.8 + Math.random() * 0.6;
      const delay = 0.4 + Math.random() * 0.4;

      dot.style.animation = `none`;
      dot.style.opacity   = '0';

      container.appendChild(dot);

      dot.animate([
        { opacity: 0,   transform: 'translate(0,0) scale(0)',   offset: 0    },
        { opacity: 0.9, transform: `translate(${dx/2}px,${dy/2}px) scale(1)`, offset: 0.3 },
        { opacity: 0,   transform: `translate(${dx}px,${dy}px) scale(0.5)`,  offset: 1   }
      ], { duration: dur*1000, delay: delay*1000, fill: 'forwards', easing: 'ease-out' });

      setTimeout(() => dot.remove(), (dur + delay + 0.2) * 1000);
    }
  }

  /* ─ Sparkles ───────────────────────────────────────────────────────── */
  function spawnSparkles() {
    const canvas = document.getElementById('sparkle-canvas');
    const ctx    = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const sparks = Array.from({length:30}, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 1 + Math.random() * 2.5,
      opacity: 0,
      speed: 0.02 + Math.random() * 0.03,
      maxOp: 0.4 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparks.forEach(s => {
        s.opacity = Math.max(0, s.maxOp * Math.sin(t * s.speed * 60 + s.phase));
        if (s.opacity > 0.01) {
          ctx.save();
          ctx.globalAlpha = s.opacity;
          ctx.fillStyle = '#78D6AD';
          ctx.beginPath();
          // 4-point star
          const r1 = s.r, r2 = s.r * 0.4;
          for (let i = 0; i < 8; i++) {
            const ang = (i * Math.PI / 4) - Math.PI/2;
            const r   = i % 2 === 0 ? r1 : r2;
            i === 0
              ? ctx.moveTo(s.x + r*Math.cos(ang), s.y + r*Math.sin(ang))
              : ctx.lineTo(s.x + r*Math.cos(ang), s.y + r*Math.sin(ang));
          }
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      });

      t++;

      if (t < 120) {
        requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    requestAnimationFrame(draw);
  }

  document.getElementById('gift-wrapper').addEventListener('click', openGift);
  document.getElementById('read-again').addEventListener('click', resetToGift);
