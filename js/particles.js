/**
 * ========================================================
 * REFINED VISUAL PARTICLES (GOLDEN FOIL & AMBER EMBERS)
 * ========================================================
 * Thay thế confetti sặc sỡ kiểu casino bằng:
 * - Vảy vàng champagne (Golden Foil) & Cánh hồng nhung (Velvet Rose Petals)
 * - Bụi sao vàng ấm áp theo vệt ngón tay
 * - Bầu trời sao đêm trầm ấm, tinh tế
 */

class VisualEffects {
  constructor() {
    this.bgCanvas = document.getElementById('bg-canvas');
    this.confettiCanvas = document.getElementById('confetti-canvas');
    this.bgCtx = this.bgCanvas ? this.bgCanvas.getContext('2d') : null;
    this.confettiCtx = this.confettiCanvas ? this.confettiCanvas.getContext('2d') : null;

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.stars = [];
    this.shootingStars = [];
    this.particles = [];
    this.mouseTrails = [];
    this.mousePos = { x: -100, y: -100 };
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Tạo bầu trời sao trầm
    this.createStars(85);

    // Bắt sự kiện ngón tay / chuột tạo bụi vàng ấm áp
    window.addEventListener('mousemove', (e) => {
      this.mousePos.x = e.clientX;
      this.mousePos.y = e.clientY;
      if (Math.random() < 0.35) {
        this.addMouseParticle(e.clientX, e.clientY);
      }
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        this.mousePos.x = touch.clientX;
        this.mousePos.y = touch.clientY;
        if (Math.random() < 0.4) {
          this.addMouseParticle(touch.clientX, touch.clientY);
        }
      }
    }, { passive: true });

    this.animate();
    this.scheduleShootingStar();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    if (this.bgCanvas) {
      this.bgCanvas.width = this.width;
      this.bgCanvas.height = this.height;
    }
    if (this.confettiCanvas) {
      this.confettiCanvas.width = this.width;
      this.confettiCanvas.height = this.height;
    }
  }

  createStars(count) {
    this.stars = [];
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 1.2 + 0.3,
        alpha: Math.random() * 0.7 + 0.1,
        speed: Math.random() * 0.015 + 0.005,
        twinkleFactor: Math.random() * 0.03 + 0.008
      });
    }
  }

  scheduleShootingStar() {
    const nextTime = Math.random() * 5000 + 4000;
    setTimeout(() => {
      this.createShootingStar();
      this.scheduleShootingStar();
    }, nextTime);
  }

  createShootingStar() {
    const startX = Math.random() * this.width * 0.75;
    const startY = Math.random() * this.height * 0.35;
    const length = Math.random() * 90 + 70;
    const speed = Math.random() * 8 + 10;

    this.shootingStars.push({
      x: startX,
      y: startY,
      len: length,
      speed: speed,
      size: 1.1,
      opacity: 0.85,
      angle: Math.PI / 4 + (Math.random() * 0.15 - 0.075)
    });
  }

  // Bụi vàng và vệt sáng ấm áp
  addMouseParticle(x, y) {
    const colors = ['#d4a359', '#e8c48a', '#f5e6cf', '#b84a5b'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    this.mouseTrails.push({
      x: x + (Math.random() * 10 - 5),
      y: y + (Math.random() * 10 - 5),
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2 - 0.8,
      size: Math.random() * 2.8 + 1.2,
      color: color,
      alpha: 0.9,
      decay: Math.random() * 0.025 + 0.02
    });
  }

  // Chùm pháo hoa vảy vàng & cánh hoa nhung thanh lịch
  burstConfetti(originX = this.width / 2, originY = this.height / 2, count = 70) {
    // Bảng màu quý phái: Vàng champagne, vàng đồng, cánh hoa hồng nhung, trắng ngà
    const colors = ['#d4a359', '#edd29d', '#b8863b', '#b84a5b', '#fbf8f2', '#8c3240'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 9 + 3;
      this.particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - (Math.random() * 3 + 1.5),
        gravity: 0.18,
        drag: 0.965,
        width: Math.random() * 6 + 4,
        height: Math.random() * 9 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.16,
        decay: Math.random() * 0.007 + 0.005
      });
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // 1. Render Bầu trời đêm
    if (this.bgCtx) {
      this.bgCtx.clearRect(0, 0, this.width, this.height);

      for (const star of this.stars) {
        star.alpha += star.twinkleFactor;
        if (star.alpha > 0.85 || star.alpha < 0.15) {
          star.twinkleFactor = -star.twinkleFactor;
        }

        this.bgCtx.fillStyle = `rgba(240, 230, 215, ${Math.min(1, Math.max(0, star.alpha))})`;
        this.bgCtx.beginPath();
        this.bgCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        this.bgCtx.fill();
      }

      // Sao băng
      for (let i = this.shootingStars.length - 1; i >= 0; i--) {
        const ss = this.shootingStars[i];
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.opacity -= 0.016;

        if (ss.opacity <= 0 || ss.x > this.width || ss.y > this.height) {
          this.shootingStars.splice(i, 1);
          continue;
        }

        const tailX = ss.x - Math.cos(ss.angle) * ss.len;
        const tailY = ss.y - Math.sin(ss.angle) * ss.len;

        const grad = this.bgCtx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        grad.addColorStop(0, 'rgba(212, 163, 89, 0)');
        grad.addColorStop(1, `rgba(245, 230, 205, ${ss.opacity})`);

        this.bgCtx.strokeStyle = grad;
        this.bgCtx.lineWidth = ss.size;
        this.bgCtx.beginPath();
        this.bgCtx.moveTo(tailX, tailY);
        this.bgCtx.lineTo(ss.x, ss.y);
        this.bgCtx.stroke();
      }
    }

    // 2. Render Confetti & Touch Trails
    if (this.confettiCtx) {
      this.confettiCtx.clearRect(0, 0, this.width, this.height);

      // Vệt ngón tay
      for (let i = this.mouseTrails.length - 1; i >= 0; i--) {
        const p = this.mouseTrails[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          this.mouseTrails.splice(i, 1);
          continue;
        }

        this.confettiCtx.save();
        this.confettiCtx.globalAlpha = p.alpha;
        this.confettiCtx.fillStyle = p.color;
        this.confettiCtx.beginPath();
        this.confettiCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.confettiCtx.fill();
        this.confettiCtx.restore();
      }

      // Vảy vàng & cánh hoa confetti
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.vx *= p.drag;
        p.vy = p.vy * p.drag + p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y > this.height + 40) {
          this.particles.splice(i, 1);
          continue;
        }

        this.confettiCtx.save();
        this.confettiCtx.globalAlpha = Math.max(0, p.alpha);
        this.confettiCtx.translate(p.x, p.y);
        this.confettiCtx.rotate(p.rotation);

        this.confettiCtx.fillStyle = p.color;
        // Dáng vảy vàng chữ nhật mềm mại
        this.confettiCtx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);

        this.confettiCtx.restore();
      }
    }
  }
}

window.visualEffects = new VisualEffects();
