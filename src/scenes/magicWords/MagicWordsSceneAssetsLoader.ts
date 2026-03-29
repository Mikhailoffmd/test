import { Texture, Assets } from 'pixi.js';
import { IEmojiDef } from './interfaces/IEmojiDef';
import { IAvatarDef } from './interfaces/IAvatarDef';
import { MagicWordsData } from './interfaces/IMagicWordsData';

export class MagicWordsAssetsLoader {  
  private _emojiTextures = new Map<string, Texture>();
  private _avatarTextures = new Map<string, Texture>();  

  constructor() {}
  
  public get emojiTextures(): Map<string, Texture> {
    return this._emojiTextures;
  }

  public get avatarTextures(): Map<string, Texture> {
    return this._avatarTextures;
  }

  public async load(data: MagicWordsData): Promise<void> {    
    await Promise.all([
      this._loadEmojis(data.emojies || []),
      this._loadAvatars(data.avatars || []),
    ]);
  }

  private async _loadEmojis(emojis: IEmojiDef[]): Promise<void> {
    const loadPromises = emojis.map(async (emoji) => {
      try {
        const texture = await this._loadTextureFromUrl(emoji.name, emoji.url);
        this._emojiTextures.set(emoji.name, texture);
      } catch (e) {
        console.warn(`Failed to load emoji: ${emoji.name}`, e);
      }
    });
    await Promise.all(loadPromises);
  }

  private async _loadAvatars(avatars: IAvatarDef[]): Promise<void> {
    const loadPromises = avatars.map(async (avatar) => {      
      try {
        const texture = await this._loadTextureFromUrl(`avatar_${avatar.name}`, avatar.url);
        this._avatarTextures.set(avatar.name, texture);
      } catch (e) {
        console.warn(`Failed to load avatar: ${avatar.name}`, e);
      }
    });
    await Promise.all(loadPromises);
  }

  private async _loadTextureFromUrl(alias: string, url: string): Promise<Texture> {
    Assets.add({ alias, src: url, parser: 'loadTextures' });

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout loading: ${alias}`)), 3000),
    );

    return Promise.race([Assets.load<Texture>(alias), timeout]);
  }
}
