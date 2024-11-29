import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    return eval(0 + this.input);  
  }

  public async part2(): Promise<string | number> {
    const operations = this.lines.map((n) => parseInt(n, 10));
    const frequencies: number[] = [];
    let result = 0;
    let i = 0;
    while (true) {
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
  }
}
