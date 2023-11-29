// export const part1 = (input: string) => {
//   const lines = input.split(/\n/gi);
//   let two = 0;
//   let three = 0;
//   lines.forEach((line) => {
//     if (hasTwo(line)) {
//       two += 1;
//     }
//     if (hasThree(line)) {
//       three += 1;
//     }
//   });
//   return two * three;
// };

// export const part2 = (input: string) => {
//   const lines = input.split(/\n/gi);
//   for (let i = 0; i < lines.length; i++) {
//     const line = lines[i];
//     for (let j = i + 1; j < lines.length; j++) {
//       const line2 = lines[j];
//       if (hasOneDifferent(line, line2)) {
//         return line
//           .split('')
//           .filter((char, index) => char === line2[index])
//           .join('');
//       }
//     }
//   }
// };

import { hasDifferentLetterTimes, hasSameLetterTimes } from "../../helpers/string";
import { AoCPuzzle } from "../../puzzle";

export class Puzzle extends AoCPuzzle {
  public part1(): string | number {
    let two = 0;
    let three = 0;
    this.lines.forEach((line) => {
      if (hasSameLetterTimes(line, 2)) two += 1;
      if (hasSameLetterTimes(line, 3)) three += 1;
    });
    return two * three;
  }

  public part2(): string | number {
    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i];
      for (let j = i + 1; j < this.lines.length; j++) {
        const line2 = this.lines[j];
        if (hasDifferentLetterTimes(line, line2, 1)) {
          return line
            .split('')
            .filter((char, index) => char === line2[index])
            .join('');
        }
      }
    }
    return 0;
  }
}
