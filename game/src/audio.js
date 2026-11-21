// Tiny WebAudio synth for Lantern Lane: no sound files, every tone is an
// oscillator shaped by a small gain envelope. The audio context is created
// lazily on the first user gesture, so the page never tries to play before
// the player has interacted with it.

export class SoundSynth {
  constructor() {
    this.context = null;
    this.muted = false;
  }

  ensureContext() {
    if (!this.context) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      this.context = new AudioContext();
    }
    if (this.context.state === 'suspended') {
      this.context.resume();
    }
    return this.context;
  }

  toggleMuted() {
    this.muted = !this.muted;
    return this.muted;
  }

  playTone(frequency, startDelay, duration, wave, peakVolume) {
    if (this.muted) return;
    const context = this.ensureContext();
    if (!context) return;
    const startAt = context.currentTime + startDelay;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = wave;
    oscillator.frequency.setValueAtTime(frequency, startAt);
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(peakVolume, startAt + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + duration + 0.05);
  }

  playChime() {
    this.playTone(880, 0, 0.28, 'sine', 0.16);
    this.playTone(1318.5, 0.07, 0.34, 'sine', 0.12);
    this.playTone(1760, 0.14, 0.4, 'sine', 0.08);
  }

  playBuzz() {
    this.playTone(140, 0, 0.22, 'sawtooth', 0.1);
    this.playTone(98, 0.05, 0.26, 'square', 0.06);
  }

  playTick() {
    this.playTone(1200, 0, 0.05, 'square', 0.05);
  }

  playHint() {
    this.playTone(659.25, 0, 0.16, 'triangle', 0.1);
    this.playTone(987.77, 0.09, 0.2, 'triangle', 0.08);
  }

  playWinFanfare() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
    notes.forEach((note, index) => {
      this.playTone(note, index * 0.13, 0.32, 'triangle', 0.12);
    });
  }

  playLevelDone() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((note, index) => {
      this.playTone(note, index * 0.11, 0.26, 'triangle', 0.11);
    });
  }
}
