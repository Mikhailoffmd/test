import { Text, TextStyle, Container } from 'pixi.js';

/**
 * Displays a live FPS counter.
 * Updates every 500ms to avoid excessive text re-rendering.
 */
export class FpsCounter {
  private _container: Container;
  private _text: Text;
  private _elapsed = 0;
  private _frames = 0;

  constructor() {
    this._container = new Container(); 

    const style = new TextStyle({
      fontFamily: 'monospace',
      fontSize: 16,
      fill: '#00ff88'
    });

    this._text = new Text({ text: 'FPS: --', style });
    this._text.position.set(10, 10);
    this.container.addChild(this._text);
  }

  public get container(): Container {
    return this._container;
  }

  public update(dt: number): void {
    this._frames++;
    this._elapsed += dt;

    if (this._elapsed >= 0.5) {
      const fps = Math.round(this._frames / this._elapsed);
      this._text.text = `FPS: ${fps}`;
      this._frames = 0;
      this._elapsed = 0;
    }
  }
}
