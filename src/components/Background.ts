import { Sprite, Texture } from 'pixi.js';

/**
 * Reusable full-screen background using a tinted sprite (cheaper than Graphics).
 */
export class Background {
  readonly graphics: Sprite;

  constructor(color: string) {
    this.graphics = new Sprite(Texture.WHITE);
    this.graphics.tint = color;
  }

  resize(width: number, height: number): void {
    this.graphics.width = width;
    this.graphics.height = height;
  }
}
