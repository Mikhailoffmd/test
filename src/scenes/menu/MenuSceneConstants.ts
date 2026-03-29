import { TextStyleOptions } from 'pixi.js';

export class MenuSceneConstants {
  // Colors
  public static readonly BG_COLOR = '#0a0a1a';

  // Strings
  public static readonly TITLE_TEXT = 'SOFTGAMES';
  public static readonly BACK_BUTTON_TEXT = 'Menu';

  // Layout
  public static readonly TITLE_Y_RATIO = 0.15;
  public static readonly BUTTON_START_Y_OFFSET = 40;
  public static readonly MOBILE_SCALE_BREAKPOINT = 400;

  // Button
  public static readonly BUTTON_WIDTH = 320;
  public static readonly BUTTON_HEIGHT = 80;
  public static readonly BUTTON_BORDER_RADIUS = 12;
  public static readonly BUTTON_GAP = 100;
  public static readonly BUTTON_HOVER_SCALE = 1.03;

  // Text styles
  public static readonly TITLE_STYLE: TextStyleOptions = {
    fontFamily: 'Georgia, serif',
    fontSize: 48,
    fill: '#ffffff',
    letterSpacing: 4,
    dropShadow: {
      color: '#4a00e0',
      blur: 15,
      distance: 0,
    },
  };

  public static readonly BUTTON_LABEL_STYLE: TextStyleOptions = {
    fontFamily: 'Georgia, serif',
    fontSize: 22,
    fill: '#ffffff',
    fontWeight: 'bold',
  };

  // Menu items
  public static readonly MENU_ITEMS = [
    { name: 'aceOfShadows', label: 'Ace of Shadows', color: '#2c3e50' },
    { name: 'magicWords', label: 'Magic Words', color: '#8e44ad' },
    { name: 'phoenixFlame', label: 'Phoenix Flame', color: '#c0392b' },
  ];
}
