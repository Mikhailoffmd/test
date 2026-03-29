import { TextStyleOptions } from 'pixi.js';

export class PhoenixFlameConstants {
  // Colors
  public static readonly BG_COLOR = '#0a0505';
  public static readonly TITLE_COLOR = '#ff8844';

  // Strings
  public static readonly TITLE_TEXT = 'Phoenix Flame';

  // Layout
  public static readonly TITLE_Y = 10;
  public static readonly LABEL_OFFSET_Y = 30;
  public static readonly BASE_Y_RATIO = 0.5;
  public static readonly GLOW_RADIUS = 60;
  public static readonly GLOW_BLUR = 18;
  public static readonly PARTICLES_PER_EFFECT = 10;

  // Text styles
  public static readonly TITLE_STYLE: TextStyleOptions = {
    fontFamily: 'Georgia, serif',
    fontSize: 28,
    fill: this.TITLE_COLOR,
    dropShadow: { color: '#000000', blur: 4, distance: 2 },
  };

  public static readonly LABEL_STYLE: TextStyleOptions = {
    fontFamily: 'Arial, sans-serif',
    fontSize: 14,
    fill: '#cccccc',
    align: 'center',
  };
}
