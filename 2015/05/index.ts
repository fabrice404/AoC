import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private static isNiceString1(str: string): boolean {
    if (str.match(/(ab|cd|pq|xy)/)) {
      return false;
    }

    const vowels = str.match(/[aeiou]/g);
    const doubleLetter = str.match(/(.)\1/);

    return !!vowels && vowels.length >= 3 && doubleLetter !== null;
  }

  private static isNiceString2(str: string): boolean {
    const doubleLetter = str.match(/(..).*\1/);
    const middleLetter = str.match(/(.).\1/);

    return !!doubleLetter && !!middleLetter;
  }

  public async part1(): Promise<string | number> {
    let niceStrings = 0;
    for (const line of this.lines) {
      if (Puzzle.isNiceString1(line)) {
        niceStrings += 1;
      }
    }
    return niceStrings;
  }

  public async part2(): Promise<string | number> {
    let niceStrings = 0;
    for (const line of this.lines) {
      if (Puzzle.isNiceString2(line)) {
        niceStrings += 1;
      }
    }
    return niceStrings;
  }
}
