import { AceOfShadowsConstants } from './AceOfShadowsConstants';

export class AceOfShadowsSceneModel {
  private _cardsStacks: number[] = [];

  public init(): void {
    this._cardsStacks[0] = AceOfShadowsConstants.TOTAL_CARDS_COUNT;
    this._cardsStacks[1] = 0;
  }

  public get cardsStacks(): number[] {
    return this._cardsStacks;
  }

  public set cardsStacks(value: number[]) {
    this._cardsStacks = value;
  }
}
