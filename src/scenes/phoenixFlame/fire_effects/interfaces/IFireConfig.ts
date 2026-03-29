export interface IFireConfig {
  name: string;
  particleTexture: string;
  baseImage: string;
  blendMode: 'add' | 'normal';
  baseScale: number;
  fireOffsetX: number;
  fireOffsetY: number;
  velocityY: [number, number];
  maxLife: [number, number];
  scale: [number, number];
  spawnSpreadX: [number, number];
}
