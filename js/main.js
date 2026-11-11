/**
 * ========================================================
 * MOBILE SINGLE-SCREEN STAGE CONTROLLER (EDITORIAL ANTI-SLOP)
 * ========================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Khởi tạo hiệu ứng hạt & bầu trời sao
  window.visualEffects.init();

  // 2. Khởi tạo Bánh kem 3D WebGL thực thụ (Three.js)
  if (window.BirthdayCake3D) {
    window.cake3D = new BirthdayCake3D('cake-3d-canvas', 'cake-3d-wrapper');
    window.cake3D.init();
    window.cake3D.onExtinguishCallback = () => extinguishCandles();
  }

  // 3. Load dữ liệu từ config vào DOM
  loadConfigData();

  // 4. Khởi tạo các tương tác
  initStageNavigation();
  initCakeCandles();
  initSendLoveButton();
  initSoundButton();
});

// --- LOAD DỮ LIỆU TỪ CONFIG ---
function loadConfigData() {
  document.querySelectorAll('.recipient-name').forEach(el => {
    el.textContent = CONFIG.recipientName;
  });

  const introBadge = document.getElementById('intro-badge');
  if (introBadge) introBadge.textContent = CONFIG.intro.badge;
  const introTitle = document.getElementById('intro-title');
  if (introTitle) introTitle.textContent = CONFIG.intro.title;
  const introSub = document.getElementById('intro-sub');
  if (introSub) introSub.textContent = CONFIG.intro.subtitle;
  const startBtnText = document.getElementById('start-btn-text');
  if (startBtnText) startBtnText.textContent = CONFIG.intro.buttonText;

  // Cập nhật ngày sinh trên chip nhỏ nếu có
  const dateChip = document.getElementById('current-date-chip');
  if (dateChip && CONFIG.birthDate) {
    const parts = CONFIG.birthDate.split('-');
    if (parts.length === 3) {
      dateChip.textContent = `${parts[2]}.${parts[1]} • Birthday Edition`;
    }
  }
}

// --- QUẢN LÝ CHUYỂN MÀN HÌNH TẠI CHỖ (STAGE MANAGER) ---
function switchStage(fromStageId, toStageId) {
  const fromStage = document.getElementById(fromStageId);
  const toStage = document.getElementById(toStageId);

  if (fromStage) {
    fromStage.classList.remove('active');
  }

  setTimeout(() => {
    if (toStage) {
      toStage.classList.add('active');
      if (toStageId === 'stage-cake' && window.cake3D) {
        window.cake3D.resize();
      }
    }
  }, 320);
}

// --- MODULE 1: ĐIỀU HƯỚNG GIAI ĐOẠN ---
function initStageNavigation() {
  const startBtn = document.getElementById('btn-start');
  const gotoLetterBtn = document.getElementById('btn-goto-letter');
  const backCakeBtn = document.getElementById('btn-back-cake');

  // Chặng 1 -> Chặng 2 (Intro -> Bánh kem)
  startBtn.addEventListener('click', () => {
    window.soundEngine.init();
    window.soundEngine.playClick();

    const rect = startBtn.getBoundingClientRect();
    window.visualEffects.burstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 35);

    switchStage('stage-intro', 'stage-cake');
  });

  // Chặng 2 -> Chặng 3 (Bánh kem -> Bức thư)
  gotoLetterBtn.addEventListener('click', () => {
    window.soundEngine.playClick();
    switchStage('stage-cake', 'stage-letter');
    setTimeout(() => {
      startTypewriter();
    }, 450);
  });

  // Quay lại xem bánh kem
  backCakeBtn.addEventListener('click', () => {
    window.soundEngine.playClick();
    switchStage('stage-letter', 'stage-cake');
  });
}

// --- MODULE 2: BÁNH KEM & THỔI NẾN (INTERACTIVE CAKE & BLOW) ---
let candlesLit = true;
let micStream = null;
let audioContext = null;
let analyser = null;

function initCakeCandles() {
  const blowBtn = document.getElementById('btn-blow-candle');
  const micBtn = document.getElementById('btn-mic-blow');
  const flames = document.querySelectorAll('.flame');

  // Chạm trực tiếp vào ngọn lửa
  flames.forEach(flame => {
    flame.addEventListener('click', () => {
      extinguishCandles();
    });
  });

  // Nút thổi thủ công
  if (blowBtn) {
    blowBtn.addEventListener('click', () => {
      window.soundEngine.playClick();
      extinguishCandles();
    });
  }

  // Bật micro để thổi thật
  if (micBtn) {
    micBtn.addEventListener('click', () => {
      toggleMicDetection(micBtn);
    });
  }
}

// Thổi tắt nến và kích hoạt pháo hoa
function extinguishCandles() {
  if (!candlesLit) return;
  candlesLit = false;

  // Thổi tắt nến 3D WebGL
  if (window.cake3D) {
    window.cake3D.extinguish();
  }

  const cakeControls = document.getElementById('cake-controls');
  const celebrationBox = document.getElementById('celebration-box');
  const wishOverlay = document.getElementById('wish-overlay');

  window.soundEngine.playBlow();

  // Ẩn bảng điều khiển
  if (cakeControls) {
    cakeControls.style.opacity = '0';
    cakeControls.style.pointerEvents = 'none';
  }

  // Màn hình tối dịu 2.4s để nhắm mắt ước nguyện
  if (wishOverlay) {
    wishOverlay.classList.add('active');
  }

  setTimeout(() => {
    if (wishOverlay) {
      wishOverlay.classList.remove('active');
    }

    // Bắt đầu nhạc Happy Birthday
    window.soundEngine.startMelodyLoop();

    // Bắn vảy vàng & cánh hoa chúc mừng
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const x = Math.random() * (window.innerWidth * 0.7) + (window.innerWidth * 0.15);
        const y = Math.random() * (window.innerHeight * 0.35) + 90;
        window.soundEngine.playPop();
        window.visualEffects.burstConfetti(x, y, 65);
      }, i * 300);
    }

    setTimeout(() => {
      if (cakeControls) cakeControls.classList.add('hidden');
      if (celebrationBox) {
        celebrationBox.classList.remove('hidden');
      }
    }, 350);

    stopMicDetection();
  }, 2400);
}

// Nhận diện tiếng thổi nến qua micro
async function toggleMicDetection(micBtn) {
  const label = micBtn.querySelector('.mic-label');

  if (micStream) {
    stopMicDetection();
    if (label) label.textContent = 'Thổi Bằng Mic';
    return;
  }

  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(micStream);
    source.connect(analyser);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    if (label) label.textContent = 'Đang lắng nghe...';
    micBtn.classList.add('mic-active');

    let consecutiveBlowCount = 0;

    const checkBlow = () => {
      if (!micStream || !candlesLit) return;
      analyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const average = sum / bufferLength;

      if (average > 65) {
        consecutiveBlowCount++;
        if (consecutiveBlowCount >= 3) {
          extinguishCandles();
          return;
        }
      } else {
        consecutiveBlowCount = Math.max(0, consecutiveBlowCount - 1);
      }

      requestAnimationFrame(checkBlow);
    };

    checkBlow();
  } catch (err) {
    alert("Không thể truy cập microphone. Bạn có thể bấm nút 'Thổi Nến' nhé!");
  }
}

function stopMicDetection() {
  if (micStream) {
    micStream.getTracks().forEach(track => track.stop());
    micStream = null;
  }
  const micBtn = document.getElementById('btn-mic-blow');
  if (micBtn) {
    const label = micBtn.querySelector('.mic-label');
    if (label) label.textContent = 'Thổi Bằng Mic';
    micBtn.classList.remove('mic-active');
  }
}

// --- MODULE 3: BỨC THƯ TAY (LETTERPRESS TYPEWRITER) ---
let isTypewriterDone = false;

function startTypewriter() {
  if (isTypewriterDone) return;
  isTypewriterDone = true;

  const textEl = document.getElementById('typewriter-text');
  const footerActions = document.querySelector('.letter-actions');
  if (!textEl) return;

  const paragraphs = CONFIG.letter.paragraphs;
  textEl.innerHTML = '';

  let pIndex = 0;
  let charIndex = 0;
  let currentP = document.createElement('p');
  textEl.appendChild(currentP);
  let timeoutId = null;

  function finishInstantly() {
    if (timeoutId) clearTimeout(timeoutId);
    textEl.innerHTML = '';
    paragraphs.forEach(p => {
      const pEl = document.createElement('p');
      pEl.textContent = p;
      textEl.appendChild(pEl);
    });
    const sig = document.createElement('div');
    sig.className = 'letter-signature';
    sig.textContent = CONFIG.letter.signature;
    textEl.appendChild(sig);

    if (footerActions) {
      footerActions.classList.add('visible');
    }
    pIndex = paragraphs.length;
    textEl.scrollTop = 0;
  }

  // Chạm vào bức thư để hiển thị đầy đủ ngay lập tức
  const letterSheet = document.querySelector('.letter-sheet');
  if (letterSheet) {
    letterSheet.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      if (pIndex < paragraphs.length) {
        finishInstantly();
      }
    });
  }

  function typeNext() {
    if (pIndex >= paragraphs.length) {
      const sig = document.createElement('div');
      sig.className = 'letter-signature';
      sig.textContent = CONFIG.letter.signature;
      textEl.appendChild(sig);

      if (footerActions) {
        footerActions.classList.add('visible');
      }
      textEl.scrollTop = textEl.scrollHeight;
      return;
    }

    const text = paragraphs[pIndex];
    if (charIndex < text.length) {
      const char = text.charAt(charIndex);
      currentP.textContent += char;
      charIndex++;

      // Tự động cuộn theo dòng chữ đang được gõ nắn nót
      textEl.scrollTop = textEl.scrollHeight;

      // Nhịp thở tự nhiên (Human Cadence Typing)
      let delay = 15 + Math.floor(Math.random() * 6);
      if (char === '.' || char === '!' || char === '?') {
        delay = 240; // Nghỉ lắng đọng sau dấu chấm câu
      } else if (char === ',' || char === '—' || char === ';') {
        delay = 130; // Nghỉ nhẹ sau dấu phẩy
      }

      timeoutId = setTimeout(typeNext, delay);
    } else {
      pIndex++;
      charIndex = 0;
      if (pIndex < paragraphs.length) {
        currentP = document.createElement('p');
        textEl.appendChild(currentP);
        timeoutId = setTimeout(typeNext, 180); // Nghỉ giữa các đoạn văn
      } else {
        typeNext();
      }
    }
  }

  typeNext();
}

// --- MODULE 4: NÚT THẢ TIM YÊU THƯƠNG ---
function initSendLoveButton() {
  const loveBtn = document.getElementById('btn-send-love');
  if (!loveBtn) return;

  loveBtn.addEventListener('click', () => {
    window.soundEngine.playPop();

    const rect = loveBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    window.visualEffects.burstConfetti(centerX, centerY, 50);

    const textSpan = loveBtn.querySelector('.love-btn-text');
    if (textSpan) {
      textSpan.textContent = 'Đã Nhận Yêu Thương';
    }
    loveBtn.style.transform = 'scale(1.03)';
    setTimeout(() => {
      loveBtn.style.transform = 'scale(1)';
    }, 200);
  });
}

// --- MODULE 5: NÚT ÂM THANH (MUTE/UNMUTE) ---
function initSoundButton() {
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (!soundBtn) return;

  const iconOn = soundBtn.querySelector('.icon-sound-on');
  const iconOff = soundBtn.querySelector('.icon-sound-off');

  soundBtn.addEventListener('click', () => {
    const isPlaying = window.soundEngine.toggleSound();
    if (iconOn && iconOff) {
      if (isPlaying) {
        iconOn.classList.remove('hidden');
        iconOff.classList.add('hidden');
      } else {
        iconOn.classList.add('hidden');
        iconOff.classList.remove('hidden');
      }
    }
  });
}
