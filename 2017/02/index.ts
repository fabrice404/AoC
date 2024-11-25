import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    return this.lines
      .map((line) => {
        const values = line.split(/\s/gi).map((v) => parseInt(v, 10)).sort((a, b) => (a > b ? 1 : -1));
        return values[values.length - 1] - values[0];
      })
      .reduce((acc, cur) => acc + cur, 0);
  }

  public async part2(): Promise<string | number> {
    return this.lines
      .map((line) => {
        const values = line.split(/\s/gi).map((v) => parseInt(v, 10)).sort((a, b) => (a > b ? -1 : 1));
        for (let i = 0; i < values.length; i += 1) {
          for (let j = i + 1; j < values.length; j += 1) {
            if (values[i] % values[j] === 0) {
              return values[i] / values[j];
            }
          }
        }
        return 0;
      })
      .reduce((acc, cur) => acc + cur, 0);
  }
}
