import { replaceAt } from '../../helpers/string';
import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  public part1(): string | number {
    return this.lines.reduce((acc, line) => {
      const digits = line.replace(/[^0-9]/g, '').split('');
      acc += parseInt(`${digits[0]}${digits.pop()}`, 10);
      return acc;
    }, 0);
  }

  public part2(): string | number {
    const numbers = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
    };

    return this.lines.reduce((acc, line) => {
      for (let i = 0; i < line.length; i += 1) {
        const ss = line.substring(i);

        /* eslint-disable @typescript-eslint/no-loop-func */
        Object.entries(numbers)
          .forEach(([key, value]) => {
            const rxp = new RegExp(`^${key}`, 'gi');
            if (ss.match(rxp)) {
              line = replaceAt(line, i, value.toString());
            }
          });
        /* eslint-enable @typescript-eslint/no-loop-func */
      }

      const digits = line.replace(/[^0-9]/g, '').split('');
      const result = `${digits[0]}${digits[digits.length - 1]}`;
      acc += parseInt(result, 10);
      return acc;
    }, 0);
  }
}
