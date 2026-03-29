import { Container, Graphics, Text, TextStyle } from 'pixi.js';

/**
 * Reusable back-to-menu button used across all scenes.
 */
export class BackButton {
  readonly container: Container;

  constructor(onBack: () => void) {
    this.container = new Container();

    const bg = new Graphics();
    bg.roundRect(0, 0, 100, 40, 8);
    bg.fill({ color: '#333333', alpha: 0.8 });
    bg.roundRect(0, 0, 100, 40, 8);
    bg.stroke({ width: 1, color: '#666666' });
    this.container.addChild(bg);

    const text = new Text({
      text: 'BACK',
      style: new TextStyle({ fontSize: 16, fill: '#ffffff', fontFamily: 'Arial' }),
    });
    text.position.set(28, 10);
    this.container.addChild(text);

    this.container.cacheAsTexture(true);
    this.container.eventMode = 'static';
    this.container.cursor = 'pointer';
    this.container.on('pointertap', () => onBack());
    this.container.position.set(10, 50);
  }
}
