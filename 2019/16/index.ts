import { sum } from "../../helpers/array";
import AoCPuzzle from "../../puzzle";

const PATTERN = [0, 1, 0, -1];

export default class Puzzle extends AoCPuzzle {
  private buildPattern(index: number, length: number): number[] {
    const pattern = [];
    for (const n of PATTERN) {
      for (let i = 0; i < index + 1; i += 1) {
        pattern.push(n);
      }
    }
    const result = [...pattern];
    while (result.length < length) {
      result.push(...pattern);
    }
    result.push(...pattern);
    result.shift();
    return result;
  }

  public async part1(): Promise<string | number> {
    let digits = this.input.split("").map(Number);

    for (let i = 0; i < 100; i += 1) {
      const result = [];
      for (let j = 0; j < digits.length; j += 1) {
        const pattern = this.buildPattern(j, digits.length);
        result.push(Math.abs(sum(digits.map((n, k) => n * pattern[k])) % 10));
      }
      digits = result;
    }

    return digits.slice(0, 8).join("");
  }

  public async part2(): Promise<string | number> {
    const offset = +this.input.slice(0, 7);
    const digits = this.input.repeat(10000).split("").map(Number).slice(offset);

    for (let i = 0; i < 100; i += 1) {
      for (let j = digits.length - 2; j >= 0; j -= 1) {
        const digit = digits[j] + digits[j + 1];
        digits[j] = Math.abs(digit % 10);
      }
    }

    return digits.slice(0, 8).join("");
  }
}
