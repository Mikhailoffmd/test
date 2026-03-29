import {
  Container,
  Graphics,
  Text,
  FederatedPointerEvent,
} from 'pixi.js';


import { IMenuButton } from '../../core/interfaces/IMenuButton';
import { Background } from '../../components/Background';
import { MenuSceneConstants } from './MenuSceneConstants';

type NavigateCallback = (sceneName: string) => void;

export class MenuSceneView {
  private _container: Container;
  private _background: Background;
  private _title: Text;
  private _buttons: IMenuButton[] = [];

  public constructor() {
    this._container = new Container();
    this._background = new Background(MenuSceneConstants.BG_COLOR);
  }

  public get container(): Container {
    return this._container;
  }

  public init(onNavigate: NavigateCallback): void {
    this._initBackground();
    this._initTitle();
    this._initButtons(onNavigate);
  }

  private _initBackground(): void {
    this._container.addChild(this._background.graphics);
  }

  private _initTitle(): void {
    this._title = new Text({ text: MenuSceneConstants.TITLE_TEXT, style: MenuSceneConstants.TITLE_STYLE });
    this._title.anchor.set(0.5);
    this._container.addChild(this._title);
  }

  private _initButtons(onNavigate: NavigateCallback): void {
    for (const item of MenuSceneConstants.MENU_ITEMS) {
      const btn = this._createButton(item.label, item.color);
      btn.container.eventMode = 'static';
      btn.container.cursor = 'pointer';

      btn.container.on('pointerover', () => {
        btn.bg.tint = 0xcccccc;
        btn.container.scale.set(MenuSceneConstants.BUTTON_HOVER_SCALE);
      });
      btn.container.on('pointerout', () => {
        btn.bg.tint = 0xffffff;
        btn.container.scale.set(1.0);
      });
      btn.container.on('pointertap', (_e: FederatedPointerEvent) => {
        onNavigate(item.name);
      });

      this._container.addChild(btn.container);
      this._buttons.push(btn);
    }
  }

  private _createButton(label: string, color: string): IMenuButton {
    const w = MenuSceneConstants.BUTTON_WIDTH;
    const h = MenuSceneConstants.BUTTON_HEIGHT;
    const container = new Container();

    const bg = new Graphics();
    bg.roundRect(0, 0, w, h, MenuSceneConstants.BUTTON_BORDER_RADIUS);
    bg.fill(color);
    bg.roundRect(0, 0, w, h, MenuSceneConstants.BUTTON_BORDER_RADIUS);
    bg.stroke({ width: 1, color: '#ffffff', alpha: 0.15 });
    container.addChild(bg);

    const labelText = new Text({ text: label, style: MenuSceneConstants.BUTTON_LABEL_STYLE });
    labelText.anchor.set(0.5);
    labelText.position.set(w / 2, h / 2);
    container.addChild(labelText);

    container.pivot.set(w / 2, h / 2);

    return { container, bg, label: labelText, targetWidth: w, targetHeight: h };
  }

  public updateTitleAlpha(alpha: number): void {
    this._title.alpha = alpha;
  }

  public resize(width: number, height: number): void {
    this._background.resize(width, height);

    const scale = Math.min(1, width / MenuSceneConstants.MOBILE_SCALE_BREAKPOINT);

    this._title.scale.set(scale);

    const btnGap = MenuSceneConstants.BUTTON_GAP * scale;
    const totalH = this._buttons.length * btnGap;
    const startY = (height - totalH) / 2 + MenuSceneConstants.BUTTON_START_Y_OFFSET;

    const titleY = Math.max(10, Math.min(height * MenuSceneConstants.TITLE_Y_RATIO, startY - this._title.height * scale - 10));
    this._title.position.set(width / 2, titleY);

    for (let i = 0; i < this._buttons.length; i++) {
      const btn = this._buttons[i];
      const btnH = btn.targetHeight * scale;

      btn.container.scale.set(scale);      
      btn.container.position.set(width / 2, startY + i * btnGap + btnH / 2);
    }
  }

  public destroy(): void {
    this._container.removeChildren();

    this._container = null;
    this._background = null;
    this._title = null;
    this._buttons = [];
  }
}
