/**
 * A keybinding is a sequence of chords.
 */
export class Keybinding {
  public readonly chords: Chord[];

  constructor(chords: Chord[]) {
    if (chords.length === 0) {
      throw illegalArgument(`chords`);
    }
    this.chords = chords;
  }

  public getHashCode(): string {
    let result = '';
    for (let i = 0, len = this.chords.length; i < len; i++) {
      if (i !== 0) {
        result += ';';
      }
      result += this.chords[i].getHashCode();
    }
    return result;
  }

  public equals(other: Keybinding | null): boolean {
    if (other === null) {
      return false;
    }
    if (this.chords.length !== other.chords.length) {
      return false;
    }
    for (let i = 0; i < this.chords.length; i++) {
      if (!this.chords[i].equals(other.chords[i])) {
        return false;
      }
    }
    return true;
  }
}
