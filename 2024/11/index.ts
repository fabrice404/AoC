import { sum } from "../../helpers/array";
import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private cache: Map<string, number> = new Map();

  private blink(stone: number, i: number): number {
    const key = `${stone}>${i}`;
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    let result = 0;
    if (i === 0) {
      result = 1;
    } else if (stone === 0) {
      result = this.blink(1, i - 1);
    } else if (`${stone}`.length % 2 === 0) {
      const mid = `${stone}`.length / 2;
      result = this.blink(+`${stone}`.slice(0, mid), i - 1) + this.blink(+`${stone}`.slice(mid), i - 1);
    } else {
      result = this.blink(stone * 2024, i - 1);
    }

    this.cache.set(key, result);

    return result;
  }

  public async part1(): Promise<string | number> {
    const stones = this.input.split(/\s/gi).map(Number);
    return sum(stones.map((s) => this.blink(s, 25)));
  }

  public async part2(): Promise<string | number> {
    const stones = this.input.split(/\s/gi).map(Number);
    return sum(stones.map((s) => this.blink(s, 75)));
  }
}
