import { TextStyleOptions } from 'pixi.js';

export class AceOfShadowsConstants {
  // Gameplay
  public static readonly TOTAL_CARDS_COUNT = 144;
  public static readonly CARD_STACK_OFFSET_X = 1.2;
  public static readonly CARD_STACK_OFFSET_Y = 1.5;  
  public static readonly CARDS_STACK_DISTANCE = 200;
  public static readonly MOVE_INTERVAL = 1;
  public static readonly MOVE_DURATION = 2;

  // Colors
  public static readonly BG_COLOR = '#1A3A2A';
  public static readonly TITLE_COLOR = '#D4AF37';

  // Strings
  public static readonly TITLE_TEXT = 'Ace of Shadows';

  // Layout
  public static readonly TITLE_Y = 10;

  // Text styles
  public static readonly TITLE_STYLE: TextStyleOptions = {
    fontFamily: 'Georgia, serif',
    fontSize: 28,
    fill: this.TITLE_COLOR,
    dropShadow: { color: '#000000', blur: 4, distance: 2 },
  };
}
