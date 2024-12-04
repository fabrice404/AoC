import { countLetters } from "../../helpers/string";
import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private validPasswords: string[] = [];

  public async part1(): Promise<string | number> {
    const [min, max] = this.input.split("-").map(Number);
    for (let i = min; i <= max; i += 1) {
      const [a, b, c, d, e, f] = i.toString().split("");
      if (
        i.toString().length === 6 && // six-digit number
        (a === b || b === c || c === d || d === e || e === f) && // two adjacent digits are the same
        a <= b &&
        b <= c &&
        c <= d &&
        d <= e &&
        e <= f // only increase or stay the same
      ) {
        this.validPasswords.push(i.toString());
      }
    }

    return this.validPasswords.length;
  }

  public async part2(): Promise<string | number> {
    let valid = 0;

    for (const password of this.validPasswords) {
      if ([...countLetters(password).values()].filter((n) => n === 2).length) {
        valid += 1;
      }
    }

    return valid;
  }
}
