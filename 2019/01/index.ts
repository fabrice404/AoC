import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    return this.lines
      .map((line) => Math.floor(+line / 3) - 2)
      .reduce((acc, val) => acc + val, 0)
  }

  public async part2(): Promise<string | number> {
    const results = [];
    for (const line of this.lines) {
      let num = +line;
      while (num > 0) {
        num = Math.floor(num / 3) - 2;
        if (num > 0) {
          results.push(num);
        }
      }
    }

    return results.reduce((acc, val) => acc + val, 0)
  }
}
