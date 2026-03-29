import { Container, Graphics, Text } from 'pixi.js';

export interface IMenuButton {
  container: Container;
  bg: Graphics;
  label: Text;
  targetWidth: number;
  targetHeight: number;
}
