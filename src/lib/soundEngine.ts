/**
 * Moteur de synthèse sonore procédurale (Web Audio API) pour NUKEMAP EDU.
 * Ne dépend d'aucun fichier audio externe : fonctionne 100 % hors-ligne (PWA)
 * et module dynamiquement la signature acoustique selon la puissance (kt/Mt) et le type d'arme.
 */

export interface DetonationSoundProfile {
  durationSec: number;
  subFreqStartHz: number;
  subFreqEndHz: number;
  noiseFilterHz: number;
  peakGain: number;
  geigerClicks: number;
}

/**
 * Calcule les paramètres acoustiques déterministes d'une détonation à partir de la puissance
 * et du type d'ogive. Pure fonction exportée pour la testabilité unitaire.
 */
export const computeDetonationSoundProfile = (
  yieldKt: number,
  weaponType: 'fission' | 'fusion' | 'dirty' = 'fission'
): DetonationSoundProfile => {
  const safeYield = Math.max(0.01, Number.isFinite(yieldKt) ? yieldKt : 0.01);
  // Échelle logarithmique bornée entre 0 (0.01 kt) et 1 (100 Mt)
  const logNorm = Math.min(1, Math.max(0, (Math.log10(safeYield) + 2) / 7));

  if (weaponType === 'dirty') {
    return {
      durationSec: 1.4,
      subFreqStartHz: 140,
      subFreqEndHz: 42,
      noiseFilterHz: 1100,
      peakGain: 0.45,
      geigerClicks: 14,
    };
  }

  return {
    durationSec: parseFloat((1.3 + logNorm * 2.1).toFixed(2)),
    subFreqStartHz: Math.round(135 - logNorm * 55),
    subFreqEndHz: Math.round(38 - logNorm * 16),
    noiseFilterHz: Math.round(950 - logNorm * 550),
    peakGain: parseFloat((0.42 + logNorm * 0.32).toFixed(2)),
    geigerClicks: weaponType === 'fission' ? 6 : 4,
  };
};

class ProceduralSoundEngine {
  private ctx: AudioContext | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private enabled = true;
  private userActivated = false;
  private lastDetonationAtMs = 0;

  public setEnabled(next: boolean): void {
    this.enabled = next;
    if (!next && this.ctx && this.ctx.state === 'running') {
      // Suspend immédiatement tout son résiduel lorsque l'utilisateur coupe le son
      void this.ctx.suspend().catch(() => {});
    } else if (next && this.userActivated && this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume().catch(() => {});
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Signale qu'un geste utilisateur authentique vient d'avoir lieu et déverrouille AudioContext.
   */
  public unlockFromGesture(): AudioContext | null {
    this.userActivated = true;
    return this.unlock();
  }

  /**
   * Initialise ou réactive paresseusement le contexte AudioContext uniquement après un geste utilisateur,
   * évitant tout avertissement navigateur d'autoplay sur chargement initial passif.
   */
  public unlock(): AudioContext | null {
    if (!this.enabled || typeof window === 'undefined') return null;

    const browserActive =
      this.userActivated ||
      Boolean((navigator as unknown as { userActivation?: { hasBeenActive?: boolean } })?.userActivation?.hasBeenActive);

    if (!browserActive) {
      return null;
    }

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioCtx) return null;

    if (!this.ctx) {
      try {
        this.ctx = new AudioCtx();
      } catch {
        return null;
      }
    }

    if (this.ctx.state === 'suspended') {
      void this.ctx.resume().catch(() => {});
    }

    return this.ctx.state === 'running' || this.userActivated ? this.ctx : null;
  }

  private getNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (this.noiseBuffer && this.noiseBuffer.sampleRate === ctx.sampleRate) {
      return this.noiseBuffer;
    }
    const durationSec = 3.6;
    const length = Math.floor(ctx.sampleRate * durationSec);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Bruit brun/rose filtré approximatif pour un grondement organique non criard
    let lastOut = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.08 * white) / 1.08;
      data[i] = Math.max(-1, Math.min(1, lastOut * 2.8));
    }

    this.noiseBuffer = buffer;
    return buffer;
  }

  /**
   * Clic tactile discret pour les contrôles de l'interface Bunker Chic.
   */
  public playUiClick(): void {
    const ctx = this.unlock();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(920, now);
    osc.frequency.exponentialRampToValueAtTime(360, now + 0.045);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.055);
  }

  /**
   * Bip sonar / verrouillage lors du choix d'une cible ou d'un point d'origine sur la carte.
   */
  public playTargetLock(mode: 'target' | 'origin'): void {
    const ctx = this.unlock();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = mode === 'target' ? [880, 1320] : [520, 680];

    freqs.forEach((freq, idx) => {
      const start = now + idx * 0.055;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.09, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.095);
    });
  }

  /**
   * Double tonalité d'avertissement en cas d'erreur de portée balistique.
   */
  public playAlert(): void {
    const ctx = this.unlock();
    if (!ctx) return;

    const now = ctx.currentTime;
    [420, 310].forEach((freq, idx) => {
      const start = now + idx * 0.11;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, start);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, start);

      gain.gain.setValueAtTime(0.08, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.1);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.11);
    });
  }

  /**
   * Souffle propulsif de mise à feu balistique.
   */
  public playMissileLaunch(): void {
    const ctx = this.unlock();
    if (!ctx) return;

    const now = ctx.currentTime;
    const noise = ctx.createBufferSource();
    noise.buffer = this.getNoiseBuffer(ctx);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(1.4, now);
    filter.frequency.setValueAtTime(220, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + 0.45);
    filter.frequency.exponentialRampToValueAtTime(380, now + 1.25);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.24, now + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 1.35);

    // Sifflement de télémétrie d'ignition
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(920, now + 0.35);
    oscGain.gain.setValueAtTime(0.06, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  /**
   * Série brève de crépitements type compteur Geiger lors des retombées radioactives.
   */
  public playGeigerBurst(clicksCount = 8): void {
    const ctx = this.unlock();
    if (!ctx) return;

    const now = ctx.currentTime;
    const count = Math.max(1, Math.min(20, clicksCount));

    for (let i = 0; i < count; i++) {
      // Espacement pseudo-aléatoire réaliste sur ~1.1 s
      const offset = ((Math.sin(i * 19.37) + 1) * 0.5) * 1.1;
      const t = now + offset;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(2400 + (i % 3) * 450, t);

      gain.gain.setValueAtTime(0.045, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.012);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.014);
    }
  }

  /**
   * Effet sonore complet de détonation (flash initial, onde de choc sismique et grondement prolongé),
   * calibré dynamiquement selon la puissance en kilotonnes/mégatonnes et le milieu (terre/mer).
   */
  public playDetonation(
    yieldKt: number,
    weaponType: 'fission' | 'fusion' | 'dirty' = 'fission',
    isWater = false
  ): void {
    const ctx = this.unlock();
    if (!ctx) return;

    // Anti-rebond (180 ms) lors des glissements rapides du curseur de puissance
    const nowMs = performance.now();
    if (nowMs - this.lastDetonationAtMs < 180) return;
    this.lastDetonationAtMs = nowMs;

    const profile = computeDetonationSoundProfile(yieldKt, weaponType);
    const now = ctx.currentTime;

    // 1. Sub-bass sismique (onde de choc primaire)
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(profile.subFreqStartHz, now);
    subOsc.frequency.exponentialRampToValueAtTime(
      Math.max(18, profile.subFreqEndHz),
      now + Math.min(1.2, profile.durationSec * 0.65)
    );

    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.linearRampToValueAtTime(profile.peakGain, now + 0.025);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + profile.durationSec * 0.85);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + profile.durationSec * 0.9);

    // 2. Grondement barométrique large bande (bruit filtré passe-bas)
    const noise = ctx.createBufferSource();
    noise.buffer = this.getNoiseBuffer(ctx);

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    const baseFilterHz = isWater ? profile.noiseFilterHz * 0.55 : profile.noiseFilterHz;
    lowpass.frequency.setValueAtTime(baseFilterHz * 1.8, now);
    lowpass.frequency.exponentialRampToValueAtTime(Math.max(95, baseFilterHz * 0.35), now + profile.durationSec);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.linearRampToValueAtTime(profile.peakGain * 0.85, now + 0.035);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + profile.durationSec);

    noise.connect(lowpass);
    lowpass.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + profile.durationSec + 0.05);

    // 3. Impulsion haute fréquence (éclair gamma / claquement initial, atténué sous l'eau)
    if (!isWater) {
      const crackOsc = ctx.createOscillator();
      const crackGain = ctx.createGain();
      crackOsc.type = 'sawtooth';
      crackOsc.frequency.setValueAtTime(520, now);
      crackOsc.frequency.exponentialRampToValueAtTime(85, now + 0.14);

      crackGain.gain.setValueAtTime(profile.peakGain * 0.25, now);
      crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      crackOsc.connect(crackGain);
      crackGain.connect(ctx.destination);
      crackOsc.start(now);
      crackOsc.stop(now + 0.18);
    }

    // 4. Crépitements radiologiques spécifiques pour bombe sale
    if (weaponType === 'dirty') {
      this.playGeigerBurst(profile.geigerClicks);
    }
  }
}

export const soundEngine = new ProceduralSoundEngine();
