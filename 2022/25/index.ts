import { sum } from "../../helpers/array";
import AoCPuzzle from "../../puzzle";

const SNAFU = {
  "=": -2,
  "-": -1,
  "0": 0,
  "1": 1,
  "2": 2,
};

const DECIMAL: { [key: string]: Snafu } = {
  "3": "=",
  "4": "-",
  "0": "0",
  "1": "1",
  "2": "2",
};

type Snafu = "=" | "-" | "0" | "1" | "2";
type Decimal = "0" | "1" | "2" | "3" | "4";

export default class Puzzle extends AoCPuzzle {
  private decimalToSnafu(decimal: number): string {
    const snafu: Snafu[] = [];
    while (decimal > 0) {
      const index = `${decimal % 5}` as Decimal;
      decimal = Math.round(decimal / 5);

      snafu.push(DECIMAL[index]);
    }
    return snafu.reverse().join("");
  }

  private snafuToDecimal(snafu: string): number {
    const s: Snafu[] = snafu.split("").reverse() as Snafu[];

    const result = [];
    for (let i = 0; i < s.length; i += 1) {
      const power = 5 ** i;
      const value = s[i];
      result.push(SNAFU[value] * power);
    }
    return sum(result);
  }

  public async part1(): Promise<string | number> {
    const result = sum(this.lines.map((line) => this.snafuToDecimal(line)));
    return this.decimalToSnafu(result);
  }

  public async part2(): Promise<string | number> {
    return "Happy Xmas!";
  }
}
