/**
 * ========================================================
 * ARTISANAL 3D BIRTHDAY CAKE (WebGL Three.js Engine)
 * ========================================================
 * - Chú Hổ chibi siêu cute đội mũ sinh nhật ngồi giữa bánh
 * - Vành nến tròn cắm đều xung quanh viền bánh như bánh kem thật
 * - Xoay 360 độ tự do bằng vuốt ngón tay
 * - Đèn nến phát ánh sáng thật chiếu rọi lên kem bơ
 * - Khói 3D bốc lên từ từng ngọn nến khi thổi tắt
 */

class BirthdayCake3D {
  constructor(canvasId, containerId) {
    this.canvas = document.getElementById(canvasId);
    this.container = document.getElementById(containerId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.cakeGroup = null;

    this.candles = [];
    this.flames = [];
    this.flameLights = [];
    this.smokeParticles = [];

    this.isLit = true;
    this.isDragging = false;
    this.previousTouchX = 0;
    this.lastDragTime = 0;
    this.angularVelocity = 0;
    this.rotationSpeed = 0.005;
    this.time = 0;

    this.tiger = null;
    this.tigerHead = null;
    this.tigerTail = null;
    this.tigerHat = null;

    this.onExtinguishCallback = null;
  }

  init() {
    if (!this.canvas || !window.THREE) {
      console.warn("Three.js or Canvas not found, fallback enabled.");
      return;
    }

    const width = this.container ? this.container.clientWidth : 280;
    const height = this.container ? this.container.clientHeight : 220;

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera - Góc nhìn hơi chúc xuống để thấy rõ chú hổ và vành nến
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    this.camera.position.set(0, 2.12, 4.15);
    this.camera.lookAt(0, 0.52, 0);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    // 4. Nhóm bánh kem có thể xoay
    this.cakeGroup = new THREE.Group();
    this.cakeGroup.position.y = -0.42;
    this.scene.add(this.cakeGroup);

    // 5. Ánh sáng môi trường
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.85);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(2, 4, 3);
    this.scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0xb84a5b, 0.3);
    rimLight.position.set(-2, 2, -3);
    this.scene.add(rimLight);

    // 6. Dựng mô hình bánh kem 3D & Chú Hổ Cute
    this.buildCake();

    // 7. Lắng nghe sự kiện xoay 360 độ bằng ngón tay
    this.initInteraction();

    // 8. Bắt đầu vòng lặp render
    this.animate();
  }

  buildCake() {
    // --- VẬT LIỆU CAO CẤP ---
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4a359,
      metalness: 0.85,
      roughness: 0.25
    });

    const bottomFrostingMaterial = new THREE.MeshStandardMaterial({
      color: 0xfcf8f2,
      roughness: 0.7,
      metalness: 0.05
    });

    const topFrostingMaterial = new THREE.MeshStandardMaterial({
      color: 0xfbf4ed,
      roughness: 0.65,
      metalness: 0.05
    });

    const creamMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
      metalness: 0.05
    });

    const berryMaterial = new THREE.MeshStandardMaterial({
      color: 0xb52236,
      roughness: 0.3,
      metalness: 0.1
    });

    const candleColors = [0xfdfbf7, 0xfceee3, 0xf9f1df, 0xfce7eb];
    const wickMaterial = new THREE.MeshBasicMaterial({ color: 0x221f26 });

    // --- 1. ĐẾ BÁNH KEM (PEDESTAL STAND) ---
    const standBaseGeo = new THREE.CylinderGeometry(1.35, 1.48, 0.08, 48);
    const standBase = new THREE.Mesh(standBaseGeo, goldMaterial);
    standBase.position.y = 0;
    this.cakeGroup.add(standBase);

    // --- 2. TẦNG BÁNH DƯỚI (BOTTOM TIER) ---
    const bottomTierGeo = new THREE.CylinderGeometry(1.15, 1.15, 0.52, 48);
    const bottomTier = new THREE.Mesh(bottomTierGeo, bottomFrostingMaterial);
    bottomTier.position.y = 0.3;
    this.cakeGroup.add(bottomTier);

    // Viền kem trang trí quanh chân tầng dưới
    const bottomRosetteCount = 22;
    const rosetteGeo = new THREE.SphereGeometry(0.05, 12, 12);
    rosetteGeo.scale(1, 0.75, 1);
    for (let i = 0; i < bottomRosetteCount; i++) {
      const angle = (i / bottomRosetteCount) * Math.PI * 2;
      const rosette = new THREE.Mesh(rosetteGeo, creamMaterial);
      rosette.position.set(Math.cos(angle) * 1.16, 0.06, Math.sin(angle) * 1.16);
      this.cakeGroup.add(rosette);
    }

    // Viền quả mọng đỏ quanh mép bậc tầng dưới
    const stepBerryCount = 16;
    const berryGeo = new THREE.SphereGeometry(0.04, 12, 12);
    for (let i = 0; i < stepBerryCount; i++) {
      const angle = (i / stepBerryCount) * Math.PI * 2;
      const berry = new THREE.Mesh(berryGeo, berryMaterial);
      berry.position.set(Math.cos(angle) * 0.98, 0.57, Math.sin(angle) * 0.98);
      this.cakeGroup.add(berry);
    }

    // --- 3. TẦNG BÁNH TRÊN (TOP TIER) ---
    const topTierGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.48, 48);
    const topTier = new THREE.Mesh(topTierGeo, topFrostingMaterial);
    topTier.position.y = 0.8;
    this.cakeGroup.add(topTier);

    // Viền kem sò uốn lượn quanh đỉnh tầng trên
    const topRosetteCount = 18;
    for (let i = 0; i < topRosetteCount; i++) {
      const angle = (i / topRosetteCount) * Math.PI * 2;
      const rosette = new THREE.Mesh(rosetteGeo, creamMaterial);
      rosette.position.set(Math.cos(angle) * 0.78, 1.04, Math.sin(angle) * 0.78);
      this.cakeGroup.add(rosette);
    }

    // --- 4. CHÚ HỔ CON CUTE Ở CHÍNH GIỮA BÁNH (CUTE 3D CHIBI TIGER) ---
    this.buildCuteTiger(goldMaterial);

    // --- 5. VÀNH NẾN XUNG QUANH VIỀN BÁNH (8 CANDLES AROUND RIM) ---
    const candleCount = 8;
    const candleRadius = 0.60;
    const candleHeight = 0.34;
    const topSurfaceY = 1.04;

    for (let i = 0; i < candleCount; i++) {
      // Dịch chuyển góc quay (Math.PI / 8) để mặt trước không bị nến chắn tầm nhìn chú hổ
      const angle = (i / candleCount) * Math.PI * 2 + (Math.PI / candleCount);
      const cx = Math.cos(angle) * candleRadius;
      const cz = Math.sin(angle) * candleRadius;

      // Đế kem giữ chân nến
      const candleBaseGeo = new THREE.SphereGeometry(0.045, 10, 10);
      candleBaseGeo.scale(1, 0.6, 1);
      const candleBase = new THREE.Mesh(candleBaseGeo, creamMaterial);
      candleBase.position.set(cx, topSurfaceY + 0.02, cz);
      this.cakeGroup.add(candleBase);

      // Thân nến
      const candleGeo = new THREE.CylinderGeometry(0.026, 0.026, candleHeight, 16);
      const cMat = new THREE.MeshStandardMaterial({
        color: candleColors[i % candleColors.length],
        roughness: 0.35,
        metalness: 0.1
      });
      const candle = new THREE.Mesh(candleGeo, cMat);
      candle.position.set(cx, topSurfaceY + candleHeight / 2 + 0.02, cz);
      this.cakeGroup.add(candle);
      this.candles.push(candle);

      // Tim nến
      const wickGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.05, 8);
      const wick = new THREE.Mesh(wickGeo, wickMaterial);
      wick.position.set(cx, topSurfaceY + candleHeight + 0.04, cz);
      this.cakeGroup.add(wick);

      // Ngọn lửa 3D hình giọt nước ấm áp
      const flameGeo = new THREE.SphereGeometry(0.046, 16, 16);
      flameGeo.scale(0.9, 1.85, 0.9);
      const flameMat = new THREE.MeshBasicMaterial({ color: 0xffe279 });
      const flame = new THREE.Mesh(flameGeo, flameMat);
      flame.position.set(cx, topSurfaceY + candleHeight + 0.11, cz);
      this.cakeGroup.add(flame);
      this.flames.push(flame);

      // Nguồn sáng động chiếu sáng bề mặt bánh
      if (i % 2 === 0) {
        const flameLight = new THREE.PointLight(0xff9933, 1.15, 2.6);
        flameLight.position.set(cx, topSurfaceY + candleHeight + 0.12, cz);
        this.cakeGroup.add(flameLight);
        this.flameLights.push(flameLight);
      }
    }
  }

  // Xây dựng chú Hổ Chibi siêu đáng yêu
  buildCuteTiger(goldMaterial) {
    const tiger = new THREE.Group();
    // Vị trí chú hổ ngồi giữa tầng trên, phóng to tỉ lệ để nổi bật đáng yêu
    tiger.position.set(0, 1.04, 0);
    tiger.scale.set(1.32, 1.32, 1.32);

    // Vật liệu lông hổ: Màu cam mật ong ấm áp & bắt mắt
    const tigerFurMat = new THREE.MeshStandardMaterial({
      color: 0xf68b1f,
      roughness: 0.55,
      metalness: 0.05
    });

    // Vật liệu yếm bụng & mõm: Màu kem trắng sữa mềm mại
    const tigerCreamMat = new THREE.MeshStandardMaterial({
      color: 0xfffcf5,
      roughness: 0.6,
      metalness: 0.02
    });

    // Vật liệu vằn hổ: Nâu socola đen tuyền ấm áp
    const tigerDarkMat = new THREE.MeshBasicMaterial({ color: 0x2e1a12 });

    // Vật liệu má hồng đào & đệm mũi
    const tigerBlushMat = new THREE.MeshStandardMaterial({
      color: 0xff6b81,
      roughness: 0.4
    });

    const eyeGlintMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // 1. Thân hổ mập mạp ngồi tròn xoe
    const bodyGeo = new THREE.SphereGeometry(0.18, 20, 20);
    bodyGeo.scale(1.06, 0.98, 0.96);
    const body = new THREE.Mesh(bodyGeo, tigerFurMat);
    body.position.set(0, 0.15, 0);
    tiger.add(body);

    // Yếm bụng trắng sữa hình trái tim/giọt nước
    const bellyGeo = new THREE.SphereGeometry(0.13, 16, 16);
    bellyGeo.scale(0.88, 1.06, 0.46);
    const belly = new THREE.Mesh(bellyGeo, tigerCreamMat);
    belly.position.set(0, 0.14, 0.11);
    tiger.add(belly);

    // 2. Cụm Đầu Hổ tròn má phính kawaii (Tất cả ngũ quan gắn cùng đầu để lắc lư đồng bộ)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.35, 0.02);

    const headGeo = new THREE.SphereGeometry(0.19, 24, 24);
    headGeo.scale(1.18, 0.98, 1.04);
    const head = new THREE.Mesh(headGeo, tigerFurMat);
    head.position.set(0, 0, 0);
    headGroup.add(head);

    // 3. Đôi tai tròn xoe
    const earGeo = new THREE.SphereGeometry(0.068, 16, 16);
    const innerEarGeo = new THREE.SphereGeometry(0.044, 12, 12);

    // Tai trái
    const leftEar = new THREE.Mesh(earGeo, tigerFurMat);
    leftEar.position.set(-0.14, 0.16, 0);
    headGroup.add(leftEar);
    const leftInnerEar = new THREE.Mesh(innerEarGeo, tigerBlushMat);
    leftInnerEar.position.set(-0.14, 0.16, 0.025);
    headGroup.add(leftInnerEar);

    // Tai phải
    const rightEar = new THREE.Mesh(earGeo, tigerFurMat);
    rightEar.position.set(0.14, 0.16, 0);
    headGroup.add(rightEar);
    const rightInnerEar = new THREE.Mesh(innerEarGeo, tigerBlushMat);
    rightInnerEar.position.set(0.14, 0.16, 0.025);
    headGroup.add(rightInnerEar);

    // 4. Mõm hổ trắng tròn
    const muzzleGeo = new THREE.SphereGeometry(0.082, 16, 16);
    muzzleGeo.scale(1.36, 0.85, 0.88);
    const muzzle = new THREE.Mesh(muzzleGeo, tigerCreamMat);
    muzzle.position.set(0, -0.05, 0.135);
    headGroup.add(muzzle);

    // Chiếc mũi tam giác hồng xinh xắn
    const noseGeo = new THREE.SphereGeometry(0.024, 12, 12);
    noseGeo.scale(1.15, 0.82, 0.8);
    const nose = new THREE.Mesh(noseGeo, tigerBlushMat);
    nose.position.set(0, -0.025, 0.195);
    headGroup.add(nose);

    // 5. Đôi mắt long lanh to tròn (Chibi anime sparkling eyes)
    const eyeGeo = new THREE.SphereGeometry(0.038, 16, 16);
    const glintGeo = new THREE.SphereGeometry(0.013, 8, 8);
    const glintSmallGeo = new THREE.SphereGeometry(0.007, 8, 8);

    // Mắt trái
    const leftEye = new THREE.Mesh(eyeGeo, tigerDarkMat);
    leftEye.position.set(-0.085, 0.035, 0.165);
    headGroup.add(leftEye);
    const leftGlint = new THREE.Mesh(glintGeo, eyeGlintMat);
    leftGlint.position.set(-0.076, 0.048, 0.196);
    headGroup.add(leftGlint);
    const leftGlint2 = new THREE.Mesh(glintSmallGeo, eyeGlintMat);
    leftGlint2.position.set(-0.094, 0.022, 0.194);
    headGroup.add(leftGlint2);

    // Mắt phải
    const rightEye = new THREE.Mesh(eyeGeo, tigerDarkMat);
    rightEye.position.set(0.085, 0.035, 0.165);
    headGroup.add(rightEye);
    const rightGlint = new THREE.Mesh(glintGeo, eyeGlintMat);
    rightGlint.position.set(0.094, 0.048, 0.196);
    headGroup.add(rightGlint);
    const rightGlint2 = new THREE.Mesh(glintSmallGeo, eyeGlintMat);
    rightGlint2.position.set(0.076, 0.022, 0.194);
    headGroup.add(rightGlint2);

    // 6. Đôi má hồng đào phúng phính (Blush)
    const cheekGeo = new THREE.SphereGeometry(0.046, 12, 12);
    cheekGeo.scale(1.0, 0.65, 0.32);
    const leftCheek = new THREE.Mesh(cheekGeo, tigerBlushMat);
    leftCheek.position.set(-0.145, -0.04, 0.13);
    headGroup.add(leftCheek);

    const rightCheek = new THREE.Mesh(cheekGeo, tigerBlushMat);
    rightCheek.position.set(0.145, -0.04, 0.13);
    headGroup.add(rightCheek);

    // 7. Vằn hổ trên trán (Dấu chữ Vương 王 cách điệu cute)
    const stripeMat = tigerDarkMat;
    const stripeVertical = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.055, 0.02), stripeMat);
    stripeVertical.position.set(0, 0.125, 0.175);
    headGroup.add(stripeVertical);

    const stripeBar1 = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.014, 0.02), stripeMat);
    stripeBar1.position.set(0, 0.14, 0.175);
    headGroup.add(stripeBar1);

    const stripeBar2 = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.014, 0.02), stripeMat);
    stripeBar2.position.set(0, 0.105, 0.185);
    headGroup.add(stripeBar2);

    // Vằn bên má
    const cheekStripeGeo = new THREE.BoxGeometry(0.042, 0.012, 0.02);
    const leftStripe1 = new THREE.Mesh(cheekStripeGeo, stripeMat);
    leftStripe1.rotation.z = 0.22;
    leftStripe1.position.set(-0.175, 0.02, 0.11);
    headGroup.add(leftStripe1);

    const rightStripe1 = new THREE.Mesh(cheekStripeGeo, stripeMat);
    rightStripe1.rotation.z = -0.22;
    rightStripe1.position.set(0.175, 0.02, 0.11);
    headGroup.add(rightStripe1);

    // 8. Mũ sinh nhật đội lệch đáng yêu trên đầu chú Hổ
    const hatGeo = new THREE.ConeGeometry(0.07, 0.15, 16);
    const hat = new THREE.Mesh(hatGeo, goldMaterial);
    hat.rotation.z = -0.18;
    hat.position.set(0.03, 0.22, 0);
    headGroup.add(hat);
    this.tigerHat = hat;

    const pompomGeo = new THREE.SphereGeometry(0.026, 10, 10);
    const pompom = new THREE.Mesh(pompomGeo, tigerCreamMat);
    pompom.position.set(0.058, 0.305, 0);
    headGroup.add(pompom);

    tiger.add(headGroup);
    this.tigerHead = headGroup;

    // 9. Đôi chân trước mũm mĩm ôm bụng
    const pawGeo = new THREE.SphereGeometry(0.05, 12, 12);
    const leftPaw = new THREE.Mesh(pawGeo, tigerFurMat);
    leftPaw.position.set(-0.08, 0.08, 0.16);
    tiger.add(leftPaw);

    const rightPaw = new THREE.Mesh(pawGeo, tigerFurMat);
    rightPaw.position.set(0.08, 0.08, 0.16);
    tiger.add(rightPaw);

    // Đệm móng chân hồng xinh xắn
    const pawPadGeo = new THREE.SphereGeometry(0.022, 8, 8);
    pawPadGeo.scale(1, 0.8, 0.3);
    const leftPad = new THREE.Mesh(pawPadGeo, tigerBlushMat);
    leftPad.position.set(-0.08, 0.08, 0.198);
    tiger.add(leftPad);

    const rightPad = new THREE.Mesh(pawPadGeo, tigerBlushMat);
    rightPad.position.set(0.08, 0.08, 0.198);
    tiger.add(rightPad);

    // 10. Chiếc đuôi hổ cong vểnh lên phía sau
    const tailGeo = new THREE.CylinderGeometry(0.026, 0.032, 0.19, 12);
    const tail = new THREE.Mesh(tailGeo, tigerFurMat);
    tail.rotation.x = -0.8;
    tail.position.set(0, 0.14, -0.16);
    tiger.add(tail);
    this.tigerTail = tail;

    const tailTipGeo = new THREE.SphereGeometry(0.034, 12, 12);
    const tailTip = new THREE.Mesh(tailTipGeo, tigerDarkMat);
    tailTip.position.set(0, 0.22, -0.22);
    tiger.add(tailTip);

    this.tiger = tiger;
    this.cakeGroup.add(tiger);
  }

  initInteraction() {
    const onStart = (clientX) => {
      this.isDragging = true;
      this.previousTouchX = clientX;
      this.lastDragTime = performance.now();
      this.angularVelocity = 0;
    };

    const onMove = (clientX) => {
      if (!this.isDragging) return;
      const now = performance.now();
      const dt = Math.max(now - this.lastDragTime, 16);
      const delta = clientX - this.previousTouchX;

      this.cakeGroup.rotation.y += delta * 0.008;
      // Tính toán vận tốc góc theo lực vuốt ngón tay
      this.angularVelocity = (delta / dt) * 0.16;

      this.previousTouchX = clientX;
      this.lastDragTime = now;
    };

    const onEnd = () => {
      this.isDragging = false;
    };

    this.canvas.addEventListener('mousedown', (e) => onStart(e.clientX));
    window.addEventListener('mousemove', (e) => onMove(e.clientX));
    window.addEventListener('mouseup', onEnd);

    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) onStart(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) onMove(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', onEnd);

    this.canvas.addEventListener('click', () => {
      if (this.isLit && this.onExtinguishCallback) {
        this.onExtinguishCallback();
      }
    });

    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.renderer || !this.camera || !this.container) return;
    const w = this.container.clientWidth || 280;
    const h = this.container.clientHeight || 220;
    if (w > 0 && h > 0) {
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    }
  }

  extinguish() {
    if (!this.isLit) return;
    this.isLit = false;

    this.flames.forEach(flame => {
      flame.scale.set(0.001, 0.001, 0.001);
      flame.visible = false;
    });

    this.flameLights.forEach(light => {
      light.intensity = 0;
    });

    this.candles.forEach((candle) => {
      for (let i = 0; i < 6; i++) {
        const smokeGeo = new THREE.SphereGeometry(0.02 + Math.random() * 0.015, 8, 8);
        const smokeMat = new THREE.MeshBasicMaterial({
          color: 0xcccccc,
          transparent: true,
          opacity: 0.6
        });
        const particle = new THREE.Mesh(smokeGeo, smokeMat);
        particle.position.copy(candle.position);
        particle.position.y += 0.22;
        particle.userData = {
          vy: 0.007 + Math.random() * 0.01,
          vx: (Math.random() - 0.5) * 0.005,
          vz: (Math.random() - 0.5) * 0.005,
          life: 1.0
        };
        this.cakeGroup.add(particle);
        this.smokeParticles.push(particle);
      }
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.time += 0.05;

    // Quán tính vật lý & Lực hãm đà (Inertia & Damping physics)
    if (!this.isDragging && this.cakeGroup) {
      if (Math.abs(this.angularVelocity) > 0.0002) {
        this.cakeGroup.rotation.y += this.angularVelocity;
        this.angularVelocity *= 0.94; // Lực hãm tự nhiên
      } else {
        this.cakeGroup.rotation.y += this.rotationSpeed; // Tốc độ trôi êm dịu mặc định
      }
    }

    // Nhịp thở vi mô 3D của chú Hổ (Micro-idle breathing & tail wag)
    if (this.tiger) {
      this.tiger.position.y = 1.04 + Math.sin(this.time * 2.2) * 0.006;
      if (this.tigerTail) {
        this.tigerTail.rotation.z = Math.sin(this.time * 3) * 0.12;
      }
      if (this.tigerHead) {
        this.tigerHead.rotation.z = Math.sin(this.time * 1.6) * 0.025;
      }
      if (this.tigerHat) {
        this.tigerHat.rotation.z = -0.18 + Math.sin(this.time * 2.2) * 0.03;
      }
    }

    if (this.isLit) {
      this.flames.forEach((flame, idx) => {
        const offset = idx * 0.9;
        const scaleFlicker = 1.0 + Math.sin(this.time * 4 + offset) * 0.12 + (Math.random() - 0.5) * 0.05;
        flame.scale.set(scaleFlicker, scaleFlicker * 1.08, scaleFlicker);
        flame.rotation.z = Math.sin(this.time * 3 + offset) * 0.07;
      });

      this.flameLights.forEach((light, idx) => {
        const offset = idx * 1.4;
        light.intensity = 1.05 + Math.sin(this.time * 5 + offset) * 0.25;
      });
    }

    for (let i = this.smokeParticles.length - 1; i >= 0; i--) {
      const p = this.smokeParticles[i];
      p.position.y += p.userData.vy;
      p.position.x += p.userData.vx;
      p.position.z += p.userData.vz;
      p.userData.life -= 0.018;
      p.scale.multiplyScalar(1.02);
      p.material.opacity = p.userData.life * 0.55;

      if (p.userData.life <= 0) {
        this.cakeGroup.remove(p);
        p.geometry.dispose();
        p.material.dispose();
        this.smokeParticles.splice(i, 1);
      }
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

window.BirthdayCake3D = BirthdayCake3D;
