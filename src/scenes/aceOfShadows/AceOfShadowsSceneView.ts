import { Container, Sprite, Application, Texture, Graphics, Text, Point } from 'pixi.js';
import { AssetGenerator } from '../../core/AssetGenerator';
import { Background } from '../../components/Background';
import { BackButton } from '../../components/BackButton';
import { AceOfShadowsConstants } from './AceOfShadowsConstants';
import { AceOfShadowsSceneModel } from './AceOfShadowsSceneModel';
import { IMovingCard } from './interfaces/IMovingCard';

export class AceOfShadowsSceneView {
  private _container: Container; 
  private _background: Background;
  private _stacksHolder: Container;
  private _stackContainers: Container[];
  private _stackAnimationLayer: Container;
  private _cardStacksSprites: Sprite[][];
  
  private _backButton: BackButton;
  private _title: Text;

  private _stacksSize: number[];
  
  private _movingCards: IMovingCard[] = [];

  constructor() {
    this._container = new Container();
  }

  public get container(): Container {
    return this._container;
  }

  public init(model: AceOfShadowsSceneModel, app: Application, onBack: () => void): void {        
    this._initBackground();
    this._initStacks(app, model);
    this._initBackButton(onBack);
    this._initTitle();
  }

  private _initBackground(): void {
    this._background = new Background(AceOfShadowsConstants.BG_COLOR);
    this._container.addChild(this._background.graphics);
  }

  private _initBackButton(onBack: () => void): void {
    // Back button
    this._backButton = new BackButton(onBack);
    this._container.addChild(this._backButton.container);
  }

  private _initTitle(): void {
    this._title = new Text({ text: AceOfShadowsConstants.TITLE_TEXT, style: AceOfShadowsConstants.TITLE_STYLE });
    this._title.anchor.set(0.5, 0);
    this._title.label = 'title';
    this._container.addChild(this._title);
  }

  private _initStacks(app: Application, model: AceOfShadowsSceneModel): void {
    const cardsMap: Map<string, Texture> = AssetGenerator.generateCardTextures(app);
    const cardsTextureNames = Array.from(cardsMap.keys());

    this._stacksSize = model.cardsStacks.concat();

    this._stacksHolder = new Container();
    this._container.addChild(this._stacksHolder);

    this._stackAnimationLayer = new Container();
    this._stacksHolder.addChild(this._stackAnimationLayer);
    
    this._cardStacksSprites = [];
    this._stackContainers = [];

    for (let i = 0; i < this._stacksSize.length; i++) {
      this._stackContainers[i] = new Container();
      this._stackContainers[i].x = -1 * (this._stacksSize.length - 1) * AceOfShadowsConstants.CARDS_STACK_DISTANCE / 2 + i * AceOfShadowsConstants.CARDS_STACK_DISTANCE;

      this._cardStacksSprites[i] = [];

      this._stacksHolder.addChild(this._stackContainers[i]);

      for (let j = 0; j < this._stacksSize[i]; j++) {
        const cardTextureName = cardsTextureNames[j % cardsTextureNames.length];
        const cardTexture = cardsMap.get(cardTextureName);
        const cardSprite = new Sprite(cardTexture);
        const cardSpritePosition = this._getCartPositionInStack(j);
        
        cardSprite.anchor.set(0.5);
        cardSprite.position.set(cardSpritePosition.x, cardSpritePosition.y);        
        this._stackContainers[i].addChild(cardSprite);

        this._cardStacksSprites[i].push(cardSprite);
      }
    }

    this._stackContainers[0].x = -AceOfShadowsConstants.CARDS_STACK_DISTANCE;
    this._stackContainers[1].x = AceOfShadowsConstants.CARDS_STACK_DISTANCE;    
    this._stackAnimationLayer.zIndex = this._stackContainers.length;

    this._cacheStacks(true);
  }


  public startMoveAnimation(model: AceOfShadowsSceneModel, fromStack: number, toStack: number): void {
    this._stacksSize = model.cardsStacks.concat();

    const fromStackContainer = this._stackContainers[fromStack];
    const toStackContainer = this._stackContainers[toStack];    
    const movingCard = this._cardStacksSprites[fromStack].pop();    
    const movingCardGlobalPoint = fromStackContainer.toGlobal(movingCard!.position)
    const movingCardLocalPoint = this._stackAnimationLayer.toLocal(movingCardGlobalPoint);
    const targetStackCardIndex = this._stacksSize[toStack] - 1;
    const targetStackCardLocalPoint = this._getCartPositionInStack(targetStackCardIndex);
    const movingCardLocaTargetGlobalPoint = toStackContainer.toGlobal(targetStackCardLocalPoint);
    const movingCardTargetPoint = this._stackAnimationLayer.toLocal(movingCardLocaTargetGlobalPoint);

    movingCard!.position = movingCardLocalPoint;

    this._movingCards.push({
      card: movingCard!,
      startPoint: movingCardLocalPoint,
      targetPoint: movingCardTargetPoint,
      fromStack,
      toStack,
      targetStackCardIndex,
      time: 0,
      timeMax: AceOfShadowsConstants.MOVE_DURATION
    })

    movingCard!.removeFromParent();
    this._stackAnimationLayer.addChild(movingCard!);
    
    fromStackContainer.updateCacheTexture();
  }

  public update(dt: number): void {
    if (this._movingCards.length > 0) {
      let hasFinishedAniamtions = false;

      for (let i = 0; i < this._movingCards.length; i++) {
        const movingCard: IMovingCard = this._movingCards[i];

        movingCard.time += dt;

        if (movingCard.time > movingCard.timeMax) {
          this._finishCardAnimation(movingCard);
          hasFinishedAniamtions = true;
        } else {
          this._updateCardAnimation(movingCard);          
        }        
      }

      if (hasFinishedAniamtions) {
        this._movingCards = this._movingCards.filter(card => card.time <= card.timeMax);
      }      
    }
  }  

  private _updateCardAnimation(movingCard: IMovingCard): void {
    const progress = movingCard.time / movingCard.timeMax;

    const xx = movingCard.startPoint.x + progress * (movingCard.targetPoint.x - movingCard.startPoint.x);
    const yy = movingCard.startPoint.y + progress * (movingCard.targetPoint.y - movingCard.startPoint.y);

    movingCard.card.position.set(xx, yy);
  }

  private _finishCardAnimation(movingCard: IMovingCard): void {

    this._cardStacksSprites[movingCard.toStack].push(movingCard.card);

    const cardXY = this._getCartPositionInStack(movingCard.targetStackCardIndex);

    movingCard.card.removeFromParent();
    this._stackContainers[movingCard.toStack].addChild(movingCard.card);    
    movingCard.card.position = cardXY;

    this._stackContainers[movingCard.toStack].updateCacheTexture();
  }

  public resize(width: number, height: number): void {
    if (this._background) {
      this._background.resize(width, height);
    }
    
    if (this._title) {
      this._title.position.set(width / 2, AceOfShadowsConstants.TITLE_Y);
    }
    
    if (this._stacksHolder) {
      this._stacksHolder.position.set(width / 2, height / 2);
    }
  }

  public destroy(): void {
    this._cacheStacks(false);
    this._container.removeChildren();

    this._container = null;
    this._background = null;
    this._stacksHolder = null;
    this._stackContainers = null;
    this._cardStacksSprites = null;
    this._backButton = null;
    this._title = null;
    this._movingCards = null;
  }

  private _getCartPositionInStack(index: number): Point {
    const xx: number = AceOfShadowsConstants.CARD_STACK_OFFSET_X * index;
    const yy: number = AceOfShadowsConstants.CARD_STACK_OFFSET_Y * index;
    return new Point(xx, yy);
  }

    private _cacheStacks(value: boolean): void {
    for (let i = 0; i < this._stackContainers.length; i++) {
      this._stackContainers[i].cacheAsTexture(value);      
    }
  }
}
