// Web Audio API Synthesizer for 100 Argentinos Dicen / Family Feud TV Sound Effects

class SoundManager {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.8;

  constructor() {
    // Lazily initialize AudioContext on user action
  }

  private getContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  // 1. Correct Answer Ding (Familia Feud High Bell / Chime)
  public playCorrect() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume, now);
    masterGain.connect(ctx.destination);

    // Play a shiny 3-note ascending synth chord (C5 -> E5 -> G5 -> C6)
    const freqs = [523.25, 659.25, 783.99, 1046.5];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      const noteStart = now + idx * 0.04;
      noteGain.gain.setValueAtTime(0.001, noteStart);
      noteGain.gain.exponentialRampToValueAtTime(0.3, noteStart + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.6);

      osc.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start(noteStart);
      osc.stop(noteStart + 0.65);
    });
  }

  // 2. Wrong Answer / Strike Buzzer ("X" Chicharra)
  public playWrong() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume, now);
    masterGain.connect(ctx.destination);

    // Iconic low buzzy square wave synth (sawtooth + square detuned)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const buzzGain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(125, now);

    osc2.type = 'square';
    osc2.frequency.setValueAtTime(130, now);

    buzzGain.gain.setValueAtTime(0.4, now);
    buzzGain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);

    osc1.connect(buzzGain);
    osc2.connect(buzzGain);
    buzzGain.connect(masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.7);
    osc2.stop(now + 0.7);
  }

  // 3. Triple Strike (3 Error Buzzer)
  public playTripleStrike() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    // Play two sharp buzzes in rapid succession
    this.playWrong();
    setTimeout(() => this.playWrong(), 250);
    setTimeout(() => this.playWrong(), 500);
  }

  // 4. Points Transfer (Count-up Cash sound)
  public playPointsTransfer() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.6, now);
    masterGain.connect(ctx.destination);

    for (let i = 0; i < 8; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const time = now + i * 0.05;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400 + i * 120, time);

      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(time);
      osc.stop(time + 0.09);
    }
  }

  // 5. Fanfare / Winner Celebration
  public playWinner() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume, now);
    masterGain.connect(ctx.destination);

    // Major triumph arpeggio
    const notes = [
      { f: 523.25, t: 0 },
      { f: 659.25, t: 0.12 },
      { f: 783.99, t: 0.24 },
      { f: 1046.5, t: 0.36 },
      { f: 1046.5, t: 0.55 },
      { f: 1046.5, t: 0.75 },
    ];

    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + n.t;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, start);

      gain.gain.setValueAtTime(0.35, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(start);
      osc.stop(start + 0.45);
    });
  }

  // 6. Fast Money Timer Tick
  public playTimerTick() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);

    gain.gain.setValueAtTime(this.volume * 0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }
}

export const sound = new SoundManager();
