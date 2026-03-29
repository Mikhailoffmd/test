import { TextStyleOptions } from 'pixi.js';

export class MagicWordsConstants {
  // Colors
  public static readonly BG_COLOR = '#1a1025';
  public static readonly TITLE_COLOR = '#e8c547';
  public static readonly BUBBLE_COLOR = '#2a2040';
  public static readonly BUBBLE_ALPHA = 0.8;
  public static readonly BUBBLE_BORDER_ALPHA = 0.3;
  public static readonly TEXT_COLOR = '#ddd8f0';
  public static readonly LOADING_COLOR = '#888888';
  public static readonly EMOJI_FALLBACK_COLOR = '#ffaa00';

  // Character color palette
  public static readonly CHARACTER_COLORS: Record<string, string> = {
    Sheldon: '#4a90d9',
    Leonard: '#f0c040',
    Penny: '#e85480',
    Neighbour: '#50c878',
    default: '#a0a0c0',
  };

  // Strings
  public static readonly TITLE_TEXT = 'Magic Words';
  public static readonly LOADING_TEXT = 'Loading dialogue...';
  public static readonly ERROR_TEXT = 'Failed to load data. Please try again.';
  public static readonly API_URL = 'https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords';

  // Layout
  public static readonly TITLE_Y = 10;
  public static readonly MAX_DIALOGUE_WIDTH = 700;
  public static readonly DIALOGUE_PADDING = 40;
  public static readonly AVATAR_SIZE = 24;
  public static readonly AVATAR_MARGIN = 6;
  public static readonly BUBBLE_PADDING = 14;
  public static readonly BUBBLE_BORDER_RADIUS = 8;
  public static readonly BUBBLE_MIN_WIDTH = 60;
  public static readonly BUBBLE_NAME_Y = -2;
  public static readonly BUBBLE_CONTENT_Y = 16;
  public static readonly BUBBLE_TOP_OFFSET = 12;
  public static readonly BUBBLE_HEIGHT_PADDING = 10;
  public static readonly BUBBLE_EXTRA_HEIGHT = 6;
  public static readonly MIN_LINE_HEIGHT = 32;
  public static readonly LINE_HEIGHT_PADDING = 28;

  // Layout positioning
  public static readonly SCROLL_TOP_MARGIN = 60;
  public static readonly DIALOGUE_CENTER_WIDTH = 720;
  public static readonly DIALOGUE_LEFT_MIN = 120;

  // Emoji
  public static readonly EMOJI_SIZE = 14;
  public static readonly TEXT_FONT_SIZE = 11;
  public static readonly TEXT_LINE_HEIGHT = 15;

  // Text styles
  public static readonly TITLE_STYLE: TextStyleOptions = {
    fontFamily: 'Georgia, serif',
    fontSize: 28,
    fill: this.TITLE_COLOR,
    dropShadow: { color: '#000000', blur: 4, distance: 2 },
  };

  public static readonly LOADING_STYLE: TextStyleOptions = {
    fontSize: 18,
    fill: this.LOADING_COLOR,
    fontFamily: 'Arial',
  };

  public static readonly AVATAR_INITIAL_STYLE: TextStyleOptions = {
    fontSize: 18,
    fill: '#ffffff',
    fontWeight: 'bold',
    fontFamily: 'Arial',
  };

  public static readonly NAME_STYLE: TextStyleOptions = {
    fontFamily: 'Georgia, serif',
    fontSize: 14,
    fontWeight: 'bold',
  };

  public static readonly MESSAGE_STYLE: TextStyleOptions = {
    fontFamily: 'Arial, sans-serif',
    fontSize: this.TEXT_FONT_SIZE,
    fill: this.TEXT_COLOR,
    wordWrap: true,
    lineHeight: this.TEXT_LINE_HEIGHT,
  };

  public static readonly EMOJI_FALLBACK_STYLE: TextStyleOptions = {
    fontFamily: 'Arial, sans-serif',
    fontSize: 12,
    fill: this.EMOJI_FALLBACK_COLOR,
    fontStyle: 'italic',
  };
}
