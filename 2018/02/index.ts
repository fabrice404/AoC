import { hasDifferentLetterTimes, hasSameLetterTimes } from "../../helpers/string";
import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    let two = 0;
    let three = 0;
    this.lines.forEach((line) => {
      if (hasSameLetterTimes(line, 2)) two += 1;
      if (hasSameLetterTimes(line, 3)) three += 1;
    });
    return two * three;
  }

  public async part2(): Promise<string | number> {
    for (let i = 0; i < this.lines.length; i += 1) {
      const line = this.lines[i];
      for (let j = i + 1; j < this.lines.length; j += 1) {
        const line2 = this.lines[j];
        if (hasDifferentLetterTimes(line, line2, 1)) {
          return line
            .split("")
            .filter((char, index) => char === line2[index])
            .join("");
        }
      }
    }
    return 0;
  }
}
