/**
 * ========================================================
 * SOUND & AUDIO ENGINE (Web Audio API Synthesizer)
 * ========================================================
 * Tạo âm thanh Music Box sinh nhật ngọt ngào và các hiệu ứng âm thanh sống động
 * hoàn toàn bằng Web Audio API, không lo lỗi 404 hay CORS trên GitHub Pages!
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.customAudio = null;
    this.isMuted = false;
    this.isPlayingBgm = false;
    this.melodyTimer = null;
    this.notes = {
      'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
      'G4': 392.00, 'A4': 440.00, 'B4': 493.88, 'C5': 523.25,
      'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99,
      'A5': 880.00, 'B5': 987.77, 'C6': 1046.50
    };
    
    // Bản nhạc "Happy Birthday" ấm áp như hộp âm nhạc
    this.happyBirthdaySong = [
      { note: 'G4', duration: 0.35, pause: 0.1 },
      { note: 'G4', duration: 0.25, pause: 0.05 },
      { note: 'A4', duration: 0.6, pause: 0.1 },
      { note: 'G4', duration: 0.6, pause: 0.1 },
      { note: 'C5', duration: 0.6, pause: 0.1 },
      { note: 'B4', duration: 1.1, pause: 0.2 },

      { note: 'G4', duration: 0.35, pause: 0.1 },
      { note: 'G4', duration: 0.25, pause: 0.05 },
      { note: 'A4', duration: 0.6, pause: 0.1 },
      { note: 'G4', duration: 0.6, pause: 0.1 },
      { note: 'D5', duration: 0.6, pause: 0.1 },
      { note: 'C5', duration: 1.1, pause: 0.2 },

      { note: 'G4', duration: 0.35, pause: 0.1 },
      { note: 'G4', duration: 0.25, pause: 0.05 },
      { note: 'G5', duration: 0.6, pause: 0.1 },
      { note: 'E5', duration: 0.6, pause: 0.1 },
      { note: 'C5', duration: 0.6, pause: 0.1 },
      { note: 'B4', duration: 0.6, pause: 0.1 },
      { note: 'A4', duration: 1.0, pause: 0.2 },

      { note: 'F5', duration: 0.35, pause: 0.1 },
      { note: 'F5', duration: 0.25, pause: 0.05 },
      { note: 'E5', duration: 0.6, pause: 0.1 },
      { note: 'C5', duration: 0.6, pause: 0.1 },
      { note: 'D5', duration: 0.6, pause: 0.1 },
      { note: 'C5', duration: 1.4, pause: 0.6 }
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Chơi nốt đơn hộp âm nhạc (Music Box tone với harmonic ấm áp)
  playMusicBoxNote(freq, duration = 0.8, volume = 0.2) {
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    
    // Oscillator 1: Fundamental Sine
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    // Oscillator 2: Overtone lấp lánh (2x freq)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now);

    // Filter làm mềm tiếng
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 3.5, now);

    // Envelope dạng gõ đàn/music box
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(volume, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(volume * 0.35, now + 0.015);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + (duration * 0.7));

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(filter);
    gain2.connect(filter);
    filter.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  // Phát giai điệu chúc mừng sinh nhật lặp lại
  startMelodyLoop() {
    if (CONFIG.bgmUrl && CONFIG.bgmUrl.trim() !== "") {
      this.playCustomBgm(CONFIG.bgmUrl);
      return;
    }

    this.isPlayingBgm = true;
    let index = 0;

    const playNext = () => {
      if (!this.isPlayingBgm || this.isMuted) return;

      const item = this.happyBirthdaySong[index];
      const freq = this.notes[item.note] || 440;
      this.playMusicBoxNote(freq, item.duration * 1.5, 0.22);

      const delayMs = (item.duration + item.pause) * 1000;
      index = (index + 1) % this.happyBirthdaySong.length;

      // Nếu hết bài thì nghỉ 2 giây rồi hát lại
      const actualDelay = (index === 0) ? 2500 : delayMs;
      this.melodyTimer = setTimeout(playNext, actualDelay);
    };

    playNext();
  }

  stopMelody() {
    this.isPlayingBgm = false;
    if (this.melodyTimer) {
      clearTimeout(this.melodyTimer);
      this.melodyTimer = null;
    }
    if (this.customAudio) {
      this.customAudio.pause();
    }
  }

  playCustomBgm(url) {
    if (!this.customAudio) {
      this.customAudio = new Audio(url);
      this.customAudio.loop = true;
      this.customAudio.volume = 0.5;
    }
    this.customAudio.play().catch(e => console.log("Audio play error:", e));
    this.isPlayingBgm = true;
  }

  toggleSound() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopMelody();
    } else {
      this.init();
      this.startMelodyLoop();
    }
    return !this.isMuted;
  }

  // --- SOUND EFFECTS ĐỘC ĐÁO ---

  // Tiếng nổ pháo hoa / confetti pop
  playPop() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.15);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);

    // Chime lấp lánh đi kèm
    setTimeout(() => {
      this.playMusicBoxNote(880, 0.4, 0.12);
      this.playMusicBoxNote(1318.51, 0.5, 0.1);
    }, 80);
  }

  // Tiếng gió / thổi nến
  playBlow() {
    if (!this.ctx || this.isMuted) return;
    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 0.5);
  }

  // Tiếng bấm nút
  playClick() {
    if (!this.ctx || this.isMuted) return;
    this.playMusicBoxNote(659.25, 0.15, 0.08);
  }
}

window.soundEngine = new SoundEngine();
