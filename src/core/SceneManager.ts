import { Application, Container } from 'pixi.js';
import { ISceneController } from './interfaces/ISceneController';

export type { ISceneController as Scene };

/**
 * Manages scenes, lifecycle handling (init, update, destroy, resize).
 */
export class SceneManager {
  private _currentScene: ISceneController = null;
  private _app: Application;

  constructor(app: Application) {
    this._app = app;
  }

  /** 
   * Transition to a new scene, destoyr the old one 
   */
  public async switchTo(scene: ISceneController): Promise<void> {
    if (this._currentScene) {
      this._app.stage.removeChild(this._currentScene.container);
      this._currentScene.destroy();
    }

    this._currentScene = scene;
    this._app.stage.addChild(scene.container);

    await scene.init(this._app);

    scene.resize(this._app.screen.width, this._app.screen.height);
  }

  public update(dt: number): void {
    this._currentScene?.update(dt);
  }

  public resize(width: number, height: number): void {
    this._currentScene?.resize(width, height);
  }
}
