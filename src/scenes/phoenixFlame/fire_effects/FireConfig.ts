import { IFireConfig } from './interfaces/IFireConfig';

export const FireConfig: IFireConfig = {
  name: 'Torch',
  particleTexture: 'assets/flame_particle.png',
  baseImage: 'assets/torch.png',
  blendMode: 'add',
  baseScale: 0.22,
  fireOffsetX: 0,
  fireOffsetY: -85,
  velocityY: [-20, -30],
  maxLife: [0.4, 1.0],
  scale: [0.1, 0.25],
  spawnSpreadX: [-4, 4],
};
