import { Container, Application } from 'pixi.js';
import { ISceneController } from '../../core/interfaces/ISceneController';
import { AceOfShadowsSceneModel } from './AceOfShadowsSceneModel';
import { AceOfShadowsSceneView } from './AceOfShadowsSceneView';
import { AceOfShadowsConstants } from './AceOfShadowsConstants';

export class AceOfShadowsSceneController implements ISceneController {
  
  private _container: Container;
  private _model: AceOfShadowsSceneModel;
  private _view: AceOfShadowsSceneView;

  private _moveTimer: number = 0;

  constructor(private onBack: () => void) {
    this._model = new AceOfShadowsSceneModel();
    this._view = new AceOfShadowsSceneView();    
    this._container = this._view.container;
  }

  public get container(): Container {
    return this._container;
  }

  public async init(app: Application): Promise<void> {
    this._model.init();
    this._view.init(this._model, app, this.onBack);
  }

  public update(dt: number): void {
    this._view.update(dt);

    this._moveTimer += dt;

    if (this._moveTimer > AceOfShadowsConstants.MOVE_INTERVAL) {
      const fromStack = 0;
      const toStack = 1;

      if (this._model.cardsStacks[fromStack] > 0) {
        this._model.cardsStacks[fromStack]--;
        this._model.cardsStacks[toStack]++;
        
        this._view.startMoveAnimation(this._model, fromStack, toStack);
      }

      this._moveTimer = 0;
    }
  }

  public resize(width: number, height: number): void {
    this._view.resize(width, height);
  }

  public destroy(): void {
    this._view.destroy();
  }
}
