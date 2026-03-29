import { Point, Sprite } from "pixi.js";

export interface IMovingCard {
  card: Sprite;

  startPoint: Point;
  targetPoint: Point;

  fromStack: number;
  toStack: number;

  targetStackCardIndex: number;

  time: number;
  timeMax: number;
}
