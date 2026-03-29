import { Texture } from 'pixi.js';
import { MagicWordsConstants } from './MagicWordsSceneConstants';
import { IDialogueLine } from './interfaces/IDialogueLine';
import { MagicWordsData } from './interfaces/IMagicWordsData';

export class MagicWordsModel {
  private _dialogsData: MagicWordsData;
  private _dialogue: IDialogueLine[] = [];
  private _avatarPositions = new Map<string, 'left' | 'right'>();

  public get dialogsData(): MagicWordsData {
    return this._dialogsData;
  }

  public get dialogue(): IDialogueLine[] {
    return this._dialogue;
  }

  public get avatarPositions(): Map<string, 'left' | 'right'> {
    return this._avatarPositions;
  }

  public async fetchData(): Promise<void> {
    try {
      const response = await fetch(MagicWordsConstants.API_URL);
      this._dialogsData = await response.json();
      this._dialogue = this._dialogsData.dialogue;
      this._dialogsData.avatars.map((avatar) => {
        this._avatarPositions.set(avatar.name, avatar.position);
      });

    } catch(error) {
      console.error('Failed to load magic words data:', error);      
      return null;
    }
  }
}
