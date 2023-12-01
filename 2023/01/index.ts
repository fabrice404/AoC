import { replaceAt } from "../../helpers/string";
import { AoCPuzzle } from "../../puzzle";

export class Puzzle extends AoCPuzzle {
  public part1(): string | number {
    return this.lines.reduce((acc, line) => {
      const digits = line.replace(/[^0-9]/g, "").split("");
      acc += parseInt(`${digits[0]}${digits.pop()}`);;
      return acc;
    }, 0);
  }

  public part2(): string | number {
    const numbers = {
      'one': 1,
      'two': 2,
      'three': 3,
      'four': 4,
      'five': 5,
      'six': 6,
      'seven': 7,
      'eight': 8,
      'nine': 9,
    }

    return this.lines.reduce((acc, line, index) => {
      for (let i = 0; i < line.length; i++) {
        const ss = line.substring(i);

        Object.entries(numbers)
          .forEach(([key, value]) => {
            const rxp = new RegExp("^" + key, "gi");
            if (ss.match(rxp)) {
              line = replaceAt(line, i, value.toString());
            }
          });
      }
      // console.log(line);

      const digits = line.replace(/[^0-9]/g, "").split("");
      const result = `${digits[0]}${digits[digits.length - 1]}`;
      // console.log(this.lines[index], line, result);
      acc += parseInt(result);
      return acc;
    }, 0);
  }
}
