import {
  Container,
  Graphics,
  Text,
  TextStyle,
  Sprite,
  Texture,
} from 'pixi.js';

import { Background } from '../../components/Background';
import { BackButton } from '../../components/BackButton';
import { MagicWordsConstants } from './MagicWordsSceneConstants';
import { IDialogueLine } from './interfaces/IDialogueLine';

export class MagicWordsView {
  
  private _container: Container; 
  private _background: Background;
  private _title: Text;
  private _backButton: BackButton;
  private _dialogueContainer: Container;
  private _loadingText: Text;
  private _screenW = 0;

  constructor() {
    this._container = new Container(); 
  }

  public get container(): Container {
    return this._container;
  }

  public init(onBack: () => void): void {
    this._initBackground();
    this._initTitle();
    this._initBackButton(onBack);
    this._initLoadingText();
    this._initDialogueContainer();
  }

  private _initBackground(): void {
    this._background = new Background(MagicWordsConstants.BG_COLOR);    
    this.container.addChild(this._background.graphics);
  }

  private _initTitle(): void {
    this._title = new Text({ text: MagicWordsConstants.TITLE_TEXT, style: MagicWordsConstants.TITLE_STYLE });
    this._title.anchor.set(0.5, 0);
    this.container.addChild(this._title);
  }

  private _initBackButton(onBack: () => void): void {        
    this._backButton = new BackButton(onBack);
    this.container.addChild(this._backButton.container);
  }

  private _initLoadingText(): void {
    this._loadingText = new Text({
      text: MagicWordsConstants.LOADING_TEXT,
      style: MagicWordsConstants.LOADING_STYLE,
    });
    this._loadingText.anchor.set(0.5);
    this.container.addChild(this._loadingText);
  }

  private _initDialogueContainer(): void {
    this._dialogueContainer = new Container();
    this.container.addChild(this._dialogueContainer);
  }

  public hideLoading(): void {
    this._loadingText.visible = false;
  }

  public showError(message: string): void {
    this._loadingText.text = message;
    this._loadingText.alpha = 1;
  }

  public updateLoadingAlpha(): void {
    if (this._loadingText.visible) {
      this._loadingText.alpha = 0.5 + Math.sin(Date.now() / 300) * 0.5;
    }
  }

  /**
   * Render all dialogue lines into the dialogue container.
   * Returns the total content height.
   */
  public renderDialogue(
    dialogue: IDialogueLine[],
    emojiTextures: Map<string, Texture>,
    avatarTextures: Map<string, Texture>,
    avatarPositions: Map<string, 'left' | 'right'>,
  ): number {
    const maxWidth = Math.min(this._screenW - MagicWordsConstants.DIALOGUE_PADDING, MagicWordsConstants.MAX_DIALOGUE_WIDTH);
    let yOffset = 0;

    for (const line of dialogue) {
      const lineContainer = new Container();
      const charColor = MagicWordsConstants.CHARACTER_COLORS[line.name] || MagicWordsConstants.CHARACTER_COLORS.default;
      const isRight = avatarPositions.get(line.name) === 'right';

      const avatarSize = MagicWordsConstants.AVATAR_SIZE;
      const avatarTexture = avatarTextures.get(line.name);
      const avatarX = isRight ? maxWidth - avatarSize : 0;

      if (avatarTexture) {
        const avatarSprite = new Sprite(avatarTexture);
        avatarSprite.width = avatarSize;
        avatarSprite.height = avatarSize;
        avatarSprite.position.set(avatarX, 0);
        const avatarMask = new Graphics();
        avatarMask.circle(avatarX + avatarSize / 2, avatarSize / 2, avatarSize / 2);
        avatarMask.fill('#ffffff');
        lineContainer.addChild(avatarMask);
        avatarSprite.mask = avatarMask;
        lineContainer.addChild(avatarSprite);
      } else {
        const avatar = new Graphics();
        avatar.circle(avatarX + avatarSize / 2, avatarSize / 2, avatarSize / 2);
        avatar.fill(charColor);
        lineContainer.addChild(avatar);

        const initial = new Text({
          text: line.name.charAt(0),
          style: MagicWordsConstants.AVATAR_INITIAL_STYLE,
        });
        initial.anchor.set(0.5);
        initial.position.set(avatarX + avatarSize / 2, avatarSize / 2);
        lineContainer.addChild(initial);
      }

      const nameText = new Text({
        text: line.name,
        style: { ...MagicWordsConstants.NAME_STYLE, fill: charColor },
      });

      const bubble = new Graphics();
      lineContainer.addChild(bubble);

      const bubbleMargin = avatarSize + MagicWordsConstants.AVATAR_MARGIN;
      const bubbleMaxW = maxWidth - bubbleMargin;
      const textContent = this._renderRichText(line.text, bubbleMaxW - MagicWordsConstants.BUBBLE_PADDING, emojiTextures);

      const bubbleW = Math.min(Math.max(textContent.width + MagicWordsConstants.BUBBLE_PADDING, MagicWordsConstants.BUBBLE_MIN_WIDTH), bubbleMaxW);
      const bubbleH = textContent.height + MagicWordsConstants.BUBBLE_HEIGHT_PADDING;

      if (isRight) {
        const bubbleX = maxWidth - bubbleMargin - bubbleW;
        nameText.anchor.set(1, 0);
        nameText.position.set(maxWidth - bubbleMargin, MagicWordsConstants.BUBBLE_NAME_Y);
        lineContainer.addChild(nameText);

        bubble.roundRect(bubbleX, MagicWordsConstants.BUBBLE_TOP_OFFSET, bubbleW, bubbleH + MagicWordsConstants.BUBBLE_EXTRA_HEIGHT, MagicWordsConstants.BUBBLE_BORDER_RADIUS);
        bubble.fill({ color: MagicWordsConstants.BUBBLE_COLOR, alpha: MagicWordsConstants.BUBBLE_ALPHA });
        bubble.roundRect(bubbleX, MagicWordsConstants.BUBBLE_TOP_OFFSET, bubbleW, bubbleH + MagicWordsConstants.BUBBLE_EXTRA_HEIGHT, MagicWordsConstants.BUBBLE_BORDER_RADIUS);
        bubble.stroke({ width: 1, color: charColor, alpha: MagicWordsConstants.BUBBLE_BORDER_ALPHA });

        textContent.position.set(bubbleX + 12, MagicWordsConstants.BUBBLE_CONTENT_Y);
      } else {
        const bubbleX = bubbleMargin;
        nameText.position.set(bubbleMargin, MagicWordsConstants.BUBBLE_NAME_Y);
        lineContainer.addChild(nameText);

        bubble.roundRect(bubbleX, MagicWordsConstants.BUBBLE_TOP_OFFSET, bubbleW, bubbleH + MagicWordsConstants.BUBBLE_EXTRA_HEIGHT, MagicWordsConstants.BUBBLE_BORDER_RADIUS);
        bubble.fill({ color: MagicWordsConstants.BUBBLE_COLOR, alpha: MagicWordsConstants.BUBBLE_ALPHA });
        bubble.roundRect(bubbleX, MagicWordsConstants.BUBBLE_TOP_OFFSET, bubbleW, bubbleH + MagicWordsConstants.BUBBLE_EXTRA_HEIGHT, MagicWordsConstants.BUBBLE_BORDER_RADIUS);
        bubble.stroke({ width: 1, color: charColor, alpha: MagicWordsConstants.BUBBLE_BORDER_ALPHA });

        textContent.position.set(bubbleX + 12, MagicWordsConstants.BUBBLE_CONTENT_Y);
      }

      lineContainer.addChild(textContent);
      const lineHeight = Math.max(MagicWordsConstants.MIN_LINE_HEIGHT, textContent.height + MagicWordsConstants.LINE_HEIGHT_PADDING);
      lineContainer.position.set(0, yOffset);
      this._dialogueContainer.addChild(lineContainer);

      yOffset += lineHeight;
    }

    return yOffset;
  }

  private _renderRichText(text: string, maxWidth: number, emojiTextures: Map<string, Texture>): Container {
    const container = new Container();
    const emojiRegex = /\{([a-zA-Z0-9_]+)\}/g;
    const PLACEHOLDER = '\u00A0\u00A0\u00A0\u00A0';

    const textStyle = new TextStyle({ ...MagicWordsConstants.MESSAGE_STYLE, wordWrapWidth: maxWidth });

    const emojiSlots: { name: string; placeholderIndex: number }[] = [];
    let displayText = '';
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = emojiRegex.exec(text)) !== null) {
      displayText += text.slice(lastIndex, match.index);
      const placeholderIndex = displayText.length;
      displayText += PLACEHOLDER;
      emojiSlots.push({ name: match[1], placeholderIndex });
      lastIndex = match.index + match[0].length;
    }
    displayText += text.slice(lastIndex);

    const textObj = new Text({ text: displayText, style: textStyle });
    container.addChild(textObj);

    if (emojiSlots.length === 0) return container;

    const emojiSize = MagicWordsConstants.EMOJI_SIZE;

    for (const slot of emojiSlots) {
      const texture = emojiTextures.get(slot.name);
      const beforeText = displayText.slice(0, slot.placeholderIndex);
      const pos = this._measureTextPosition(beforeText, textStyle, maxWidth);

      if (texture) {
        const sprite = new Sprite(texture);
        sprite.width = emojiSize;
        sprite.height = emojiSize;
        sprite.position.set(pos.x, pos.y + 1);
        container.addChild(sprite);
      } else {
        const fb = new Text({
          text: `[${slot.name}]`,
          style: MagicWordsConstants.EMOJI_FALLBACK_STYLE,
        });
        fb.position.set(pos.x, pos.y + 2);
        container.addChild(fb);
      }
    }

    return container;
  }

  private _measureTextPosition(
    text: string,
    style: TextStyle,
    maxWidth: number,
  ): { x: number; y: number } {
    if (!text) return { x: 0, y: 0 };

    const measure = new Text({ text, style });
    const fullHeight = measure.height;
    const lineHeight = style.lineHeight || MagicWordsConstants.TEXT_LINE_HEIGHT;
    const lineCount = Math.max(1, Math.round(fullHeight / lineHeight));

    if (lineCount <= 1) {
      const x = measure.width;
      measure.destroy();
      return { x, y: 0 };
    }

    const lastNewline = text.lastIndexOf('\n');
    if (lastNewline >= 0) {
      const lastLineText = text.slice(lastNewline + 1);
      const lastMeasure = new Text({ text: lastLineText, style });
      const x = lastMeasure.width;
      lastMeasure.destroy();
      measure.destroy();
      return { x, y: (lineCount - 1) * lineHeight };
    }

    const wrapW = style.wordWrapWidth || maxWidth;
    const words = text.split(/(\s+)/);
    let lineW = 0;
    const tempStyle = style.clone();
    tempStyle.wordWrap = false;

    for (const word of words) {
      if (!word) continue;
      const wMeasure = new Text({ text: word, style: tempStyle });
      const wW = wMeasure.width;
      wMeasure.destroy();

      if (lineW + wW > wrapW && lineW > 0) {
        lineW = wW;
      } else {
        lineW += wW;
      }
    }

    measure.destroy();
    return { x: lineW, y: (lineCount - 1) * lineHeight };
  }

  public updateDialoguePosition(): void {
    this._dialogueContainer.position.y = MagicWordsConstants.SCROLL_TOP_MARGIN;
    this._dialogueContainer.position.x = Math.max(
      MagicWordsConstants.DIALOGUE_LEFT_MIN,
      (this._screenW - MagicWordsConstants.DIALOGUE_CENTER_WIDTH) / 2,
    );
  }

  public resize(width: number, height: number): void {
    this._screenW = width;

    this._background.resize(width, height);

    if (this._title) {
      this._title.position.set(width / 2, MagicWordsConstants.TITLE_Y);
    }

    if (this._loadingText) {
      this._loadingText.position.set(width / 2, height / 2);
    }
  }

  public destroy(): void {    
    this._container.removeChildren();

    this._container = null;
    this._background = null;
    this._title = null;
    this._backButton = null;
    this._dialogueContainer = null;
    this._loadingText = null;
  }
}
