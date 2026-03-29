import { Container, Application } from 'pixi.js';

import { ISceneController } from '../../core/interfaces/ISceneController';
import { MenuSceneModel } from './MenuSceneModel';
import { MenuSceneView } from './MenuSceneView';

type NavigateCallback = (sceneName: string) => void;

/**
 * Menu Scene to navigate to a task
 */
export class MenuSceneController implements ISceneController {

  private _container: Container;
  private _model: MenuSceneModel;
  private _view: MenuSceneView;

  public constructor(private _onNavigate: NavigateCallback) {
    this._model = new MenuSceneModel();
    this._view = new MenuSceneView();
    this._container = this._view.container;
  }

  public get container(): Container {
    return this._container;
  }

  public async init(_app: Application): Promise<void> {
    this._model.init();
    this._view.init(this._onNavigate);
  }

  public update(dt: number): void {        
  }

  public resize(width: number, height: number): void {    
    this._view.resize(width, height);
  }

  public destroy(): void {
    this._view.destroy();
  }
}
