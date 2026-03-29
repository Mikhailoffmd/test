import { Graphics, Application, Texture, Container, Text, TextStyle } from 'pixi.js';

/** Card suit symbols and their colors */
const SUITS = [
  { symbol: '♠', color: '#1a1a2e', name: 'spades' },
  { symbol: '♥', color: '#c0392b', name: 'hearts' },
  { symbol: '♦', color: '#c0392b', name: 'diamonds' },
  { symbol: '♣', color: '#1a1a2e', name: 'clubs' },
];

const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

/**
 * Generates textures
 */
export class AssetGenerator {
  /**
   * Generate 52 unique card textures (13 ranks × 4 suits)
   * Returns a map of texture names to Textures.
   */
  static generateCardTextures(app: Application): Map<string, Texture> {
    const textures = new Map<string, Texture>();
    const cardW = 100;
    const cardH = 140;

    for (const suit of SUITS) {
      for (const rank of RANKS) {
        const container = new Container();

        // Card background
        const bg = new Graphics();
        bg.roundRect(0, 0, cardW, cardH, 8);
        bg.fill('#f5f0e8');
        bg.roundRect(0, 0, cardW, cardH, 8);
        bg.stroke({ width: 2, color: '#8b7355' });
        container.addChild(bg);

        // Inner border accent
        const inner = new Graphics();
        inner.roundRect(4, 4, cardW - 8, cardH - 8, 5);
        inner.stroke({ width: 1, color: '#d4c5a9' });
        container.addChild(inner);

        // Rank text top-left
        const rankStyle = new TextStyle({
          fontFamily: 'Georgia, serif',
          fontSize: 18,
          fontWeight: 'bold',
          fill: suit.color,
        });
        const rankText = new Text({ text: rank, style: rankStyle });
        rankText.position.set(8, 6);
        container.addChild(rankText);

        // Large center suit symbol
        const suitBigStyle = new TextStyle({
          fontSize: 42,
          fill: suit.color,
        });
        const suitBig = new Text({ text: suit.symbol, style: suitBigStyle });
        suitBig.anchor.set(0.5);
        suitBig.position.set(cardW / 2, cardH / 2);
        container.addChild(suitBig);

        // Rank text bottom-right (inverted)
        const rankBottom = new Text({ text: rank, style: rankStyle });
        rankBottom.anchor.set(1, 1);
        rankBottom.rotation = Math.PI;
        rankBottom.position.set(cardW - 8, cardH - 6);
        // Flip for bottom-right
        rankBottom.anchor.set(0, 0);
        rankBottom.position.set(cardW - 8, cardH - 6);
        rankBottom.rotation = Math.PI;
        container.addChild(rankBottom);

        const texture = app.renderer.generateTexture(container);
        textures.set(`${rank}_${suit.name}`, texture);

        container.destroy({ children: true });
      }
    }

    return textures;
  }

}
