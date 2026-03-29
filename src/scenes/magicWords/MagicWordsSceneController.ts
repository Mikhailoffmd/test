import { Container, Application } from 'pixi.js';
import { ISceneController as ISceneController } from '../../core/interfaces/ISceneController';
import { MagicWordsModel } from './MagicWordsSceneModel';
import { MagicWordsAssetsLoader } from './MagicWordsSceneAssetsLoader';
import { MagicWordsView } from './MagicWordsView';
import { MagicWordsConstants } from './MagicWordsSceneConstants';

export class MagicWordsController implements ISceneController {
  private _container: Container;

  private _model: MagicWordsModel;
  private _loader: MagicWordsAssetsLoader;
  private _view: MagicWordsView;  
  private _isLoading = true;

  public constructor(private onBack: () => void) {
    this._model = new MagicWordsModel();
    this._loader = new MagicWordsAssetsLoader();
    this._view = new MagicWordsView();
    this._container = this._view.container;
  }

  public get container(): Container {
    return this._container;
  }

  public async init(app: Application): Promise<void> {
    this._isLoading = true;
    
    this._view.init(this.onBack);
    this.resize(app.screen.width, app.screen.height);    

    await this._model.fetchData();

    const data = this._model.dialogsData;

    if (!data) {
      this._isLoading = false;
      this._view.showError(MagicWordsConstants.ERROR_TEXT);
      return;
    }

    await this._loader.load(data);

    this._view.hideLoading();
    this._isLoading = false;

    this._renderDialogue();
  }

  private _renderDialogue(): void {
    this._view.renderDialogue(
      this._model.dialogue,
      this._loader.emojiTextures,
      this._loader.avatarTextures,
      this._model.avatarPositions,
    );    
    this._view.updateDialoguePosition();
  }

  public update(_dt: number): void {
    if (this._isLoading) {
      this._view.updateLoadingAlpha();
    }
  }

  public resize(width: number, height: number): void {
    this._view.resize(width, height);
    this._view.updateDialoguePosition();
  }

  public destroy(): void {
    this._view.destroy();
    this._loader.emojiTextures.clear();
    this._loader.avatarTextures.clear();
  }
}
