import { PhoenixFlameConstants } from '../PhoenixFlameConstants';
import { IFireConfig } from './interfaces/IFireConfig';
import { IFireParticle } from './interfaces/IFireParticle';
import { IFireParticleState } from './interfaces/IFireParticleState';

export class Fire {
  public readonly name: string;
  public readonly particleTexture: string;
  public readonly baseImage: string;
  public readonly blendMode: 'add' | 'normal';
  public readonly baseScale: number;
  public readonly fireOffsetX: number;
  public readonly fireOffsetY: number;

  private _config: IFireConfig;
  private _baseX = 0;
  private _baseY = 0;
  private _particles: IFireParticle[] = [];

  public constructor(config: IFireConfig) {
    this._config = config;
    this.name = config.name;
    this.particleTexture = config.particleTexture;
    this.baseImage = config.baseImage;
    this.blendMode = config.blendMode;
    this.baseScale = config.baseScale;
    this.fireOffsetX = config.fireOffsetX;
    this.fireOffsetY = config.fireOffsetY;

    for (let i = 0; i < PhoenixFlameConstants.PARTICLES_PER_EFFECT; i++) {
      this._particles.push(this._spawn(true));
    }
  }

  public setPosition(x: number, y: number): void {
    this._baseX = x;
    this._baseY = y;
  }

  /**
   * Returns visual state for each particle.
   *
   * Each particle goes up (negative vy).
   *
   * `t` (0 ... 1) is how far the particle is in its life. It controls:
   * - **Scale**: grows fast in first 10% of life, then slowly shrinks with `1 - t^1.5`.
   * - **Alpha**: appears fast in first 5%, then fades out with `1 - t^2`, max 90% opacity.
   * - **Tint**: changes color from yellow (255,240,180) to red (220,50,0) over life.
   */
  public update(dt: number): IFireParticleState[] {
    return this._particles.map((p, i) => {
      p.life += dt;
      if (p.life >= p.maxLife) this._particles[i] = p = this._spawn(false);

      // t goes from 0 to 1 during particle life
      const t = p.life / p.maxLife;
      // X position: start point + spawn offset
      const x = this._baseX + p.ox;
      // Y position: start point + move up (vy is negative, so goes up)
      const y = this._baseY + p.vy * p.life;

      // Scale: grow fast at start, then shrink slowly
      const scaleT = t < 0.1 ? t / 0.1 : 1 - Math.pow(t, 1.5);
      const s = p.scale * Math.max(0, scaleT);

      // Alpha: appear fast, then fade out, max 0.9
      let alpha = t < 0.05 ? t / 0.05 : 1 - Math.pow(t, 2);
      alpha = Math.max(0, alpha * 0.9);

      // Color: yellow to red over lifetime
      const tint = this._lerpColor(255, 240, 180, 220, 50, 0, t);

      return { x, y, scaleX: s * p.flipX, scaleY: s * 1.2, alpha, rotation: 0, tint };
    });
  }

  private _rand(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }

  /**
   * Mixes two RGB colors. `t` controls the mix: 0 = first color, 1 = second color.
   * Each channel (R, G, B) is mixed separately, then packed into one number: R << 16 | G << 8 | B.
   */
  private _lerpColor(
    r1: number, g1: number, b1: number,
    r2: number, g2: number, b2: number,
    t: number,
  ): number {
    return (
      (Math.floor(r1 + (r2 - r1) * t) << 16) |
      (Math.floor(g1 + (g2 - g1) * t) << 8) |
      Math.floor(b1 + (b2 - b1) * t)
    );
  }

  /**
   * Creates a new particle with random values from config ranges.
   * If `stagger` is true, the particle starts at a random point in its life
   * so the fire looks already burning from the first frame.
   */
  private _spawn(stagger: boolean): IFireParticle {
    const config = this._config;
    const particle: IFireParticle = {
      life: 0,
      maxLife: this._rand(...config.maxLife),
      vy: this._rand(...config.velocityY),
      scale: this._rand(...config.scale),
      ox: this._rand(...config.spawnSpreadX),
      flipX: Math.random() > 0.5 ? 1 : -1,
    };
    if (stagger) particle.life = this._rand(0, particle.maxLife);
    return particle;
  }
}
