import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    const matches: number[] = [];
    const input = this.input + this.input[0];
    for (let i = 0; i < this.input.length; i += 1) {
      if (input[i] === input[i + 1]) {
        matches.push(+input[i]);
      }
    }
    return matches.reduce((acc, curr) => acc + curr, 0);
  }

  public async part2(): Promise<string | number> {
    const matches: number[] = [];
    const input = this.input + this.input;
    const size = this.input.length / 2;
    for (let i = 0; i < this.input.length; i += 1) {
      if (input[i] === input[i + size]) {
        matches.push(+input[i]);
      }
    }
    return matches.reduce((acc, curr) => acc + curr, 0);
  }
}
