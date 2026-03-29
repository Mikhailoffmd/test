import { IEmojiDef } from './IEmojiDef';
import { IAvatarDef } from './IAvatarDef';
import { IDialogueLine } from './IDialogueLine';


export interface MagicWordsData {
  emojies: IEmojiDef[];
  avatars: IAvatarDef[];
  dialogue: IDialogueLine[];
}
