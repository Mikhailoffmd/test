import {
  Container,
  Sprite,
  Application,
  Texture,
  Graphics,
  Text,
  BlurFilter,
  Assets,
} from 'pixi.js';

import { Background } from '../../components/Background';
import { BackButton } from '../../components/BackButton';
import { PhoenixFlameConstants } from './PhoenixFlameConstants';
import { Fire } from './fire_effects/Fire';
import type { IFireParticleState } from './fire_effects/interfaces/IFireParticleState';

export class PhoenixFlameView {
  private _container: Container;
  private _background: Background;
  private _effect: Fire;
  private _baseSprite: Sprite;
  private _sprites: Sprite[] = [];
  private _glow: Graphics;
  private _title: Text;
  private _label: Text;
  private _backButton: BackButton;

  public constructor() {
    this._container = new Container();
  }

  public get container(): Container {
    return this._container;
  }

  public async init(app: Application, effect: Fire, onBack: () => void): Promise<void> {
    this._effect = effect;

    this._initBackground();
    this._initGlow();
    this._initBaseSprite();
    this._initFireParticles();
    this._initTitle();
    this._initLabel();
    this._initBackButton(onBack);
  }

  private _initBackground(): void {
    this._background = new Background(PhoenixFlameConstants.BG_COLOR);
    this._container.addChild(this._background.graphics);
  }

  private _initGlow(): void {
    this._glow = new Graphics();
    this._glow.circle(0, 0, PhoenixFlameConstants.GLOW_RADIUS);
    this._glow.fill({ color: '#ff4400', alpha: 0.12 });
    this._glow.circle(0, 0, PhoenixFlameConstants.GLOW_RADIUS * 0.6);
    this._glow.fill({ color: '#ff6600', alpha: 0.08 });
    this._glow.filters = [new BlurFilter({ strength: PhoenixFlameConstants.GLOW_BLUR })];
    this._container.addChild(this._glow);
  }

  private _initBaseSprite(): void {
    const baseTex = Assets.get<Texture>(this._effect.baseImage);
    this._baseSprite = new Sprite(baseTex);
    this._baseSprite.anchor.set(0.5, 1);
    this._baseSprite.scale.set(this._effect.baseScale);
    this._container.addChild(this._baseSprite);
  }

  private _initFireParticles(): void {
    const particleTex = Assets.get<Texture>(this._effect.particleTexture);
    const fireContainer = new Container();

    for (let i = 0; i < PhoenixFlameConstants.PARTICLES_PER_EFFECT; i++) {
      const sprite = new Sprite(particleTex);
      sprite.anchor.set(0.5, 0.8);
      sprite.blendMode = this._effect.blendMode;
      this._sprites.push(sprite);
      fireContainer.addChild(sprite);
    }

    this._container.addChild(fireContainer);
  }

  private _initTitle(): void {
    this._title = new Text({
      text: PhoenixFlameConstants.TITLE_TEXT,
      style: PhoenixFlameConstants.TITLE_STYLE,
    });
    this._title.anchor.set(0.5, 0);
    this._container.addChild(this._title);
  }

  private _initLabel(): void {
    this._label = new Text({
      text: this._effect.name,
      style: PhoenixFlameConstants.LABEL_STYLE,
    });
    this._label.anchor.set(0.5, 0);
    this._container.addChild(this._label);
  }

  private _initBackButton(onBack: () => void): void {
    this._backButton = new BackButton(onBack);
    this._container.addChild(this._backButton.container);
  }

  public updateFire(states: IFireParticleState[], glowPulse: number): void {
    if (!this._sprites.length) {
      return;
    }

    this._glow.alpha = glowPulse;

    for (let i = 0; i < states.length; i++) {
      const s = states[i];
      const sprite = this._sprites[i];
      sprite.position.set(s.x, s.y);
      sprite.scale.set(s.scaleX, s.scaleY);
      sprite.alpha = s.alpha;
      sprite.rotation = s.rotation;
      sprite.tint = s.tint;
    }
  }

  public resize(width: number, height: number): void {
    this._background.resize(width, height);

    const x = width / 2;
    const baseY = height * PhoenixFlameConstants.BASE_Y_RATIO;

    this._baseSprite.position.set(x, baseY);

    const fx = x + this._effect.fireOffsetX;
    const fy = baseY + this._effect.fireOffsetY;
    this._effect.setPosition(fx, fy);
    this._glow.position.set(fx, fy - 20);

    this._title.position.set(width / 2, PhoenixFlameConstants.TITLE_Y);
    this._label.position.set(x, baseY + PhoenixFlameConstants.LABEL_OFFSET_Y);
  }

  public destroy(): void {
    this._container.removeChildren();
    this._sprites = [];

    this._container = null;
    this._background = null;
    this._effect = null;
    this._baseSprite = null;    
    this._glow = null;
    this._title = null;
    this._label = null;
    this._backButton = null;
  }
}
