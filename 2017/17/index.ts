import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    const input = +this.input;
    const buffer = [0];
    let currentPosition = 0;

    for (let i = 1; i <= 2017; i++) {
      currentPosition = ((currentPosition + input) % buffer.length) + 1;
      buffer.splice(currentPosition, 0, i);
    }

    return buffer[currentPosition + 1];
  }

  public async part2(): Promise<string | number> {
    const input = +this.input;
    let currentPosition = 0;
    let valueAfterZero = 0;

    for (let i = 1; i <= 50000000; i++) {
      currentPosition = ((currentPosition + input) % i) + 1;
      if (currentPosition === 1) {
        valueAfterZero = i;
      }
    }

    return valueAfterZero;
  }
}
