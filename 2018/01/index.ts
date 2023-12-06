import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  public part1(): string | number {
    return eval(0 + this.input); // eslint-disable-line no-eval
  }

  public part2(): string | number {
    const operations = this.lines.map((n) => parseInt(n, 10));
    const frequencies: number[] = [];
    let result = 0;
    let i = 0;
    while (!frequencies.includes(result)) {
      result += operations[i];
      if (frequencies.includes(result)) {
        return result;
      }

      frequencies.push(result);

      if (i < operations.length - 1) {
        i += 1;
      } else {
        i = 0;
      }
    }
    return result;
  }
}
