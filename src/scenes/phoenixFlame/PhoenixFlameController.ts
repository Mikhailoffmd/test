import { Container, Application, Assets, Texture } from 'pixi.js';

import { ISceneController } from '../../core/interfaces/ISceneController';
import { PhoenixFlameView } from './PhoenixFlameView';
import { Fire } from './fire_effects/Fire';
import { FireConfig } from './fire_effects/FireConfig';

export class PhoenixFlameController implements ISceneController {
  private _container: Container;
  private _view: PhoenixFlameView;
  private _fire: Fire;
  private _time = 0;

  public constructor(private _onBack: () => void) {
    this._view = new PhoenixFlameView();
    this._fire = new Fire(FireConfig);
    this._container = this._view.container;
  }

  public get container(): Container {
    return this._container;
  }

  public async init(app: Application): Promise<void> {
    await this._loadTextures();
    await this._view.init(app, this._fire, this._onBack);
  }

  private async _loadTextures(): Promise<void> {
    await Assets.load<Texture>(this._fire.particleTexture);
    await Assets.load<Texture>(this._fire.baseImage);
  }

  public update(dt: number): void {
    this._time += dt;
    
    const states = this._fire.update(dt);
    const glowPulse = 0.75 + Math.sin(this._time) * 0.25;

    this._view.updateFire(states, glowPulse);
  }

  public resize(width: number, height: number): void {
    this._view.resize(width, height);
  }

  public destroy(): void {
    this._view.destroy();
  }
}
