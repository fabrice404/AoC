import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private run(iterations: number): number {
    const numbers = new Map<number, number[]>();
    const inputs = this.input.split(",").map(Number);
    const startIndex = inputs.length;
    let lastNumber = -1;

    for (let i = 0; i < inputs.length; i += 1) {
      const n = inputs[i];
      numbers.set(n, [...(numbers.get(n) || []), i]);
      lastNumber = n;
    }

    for (let i = startIndex; i < iterations; i += 1) {
      const num = numbers.get(lastNumber)!;
      if (num.length < 2) {
        lastNumber = 0;
      } else {
        const [last, prev] = num;
        lastNumber = last - prev;
      }
      numbers.set(lastNumber, [i, ...(numbers.get(lastNumber) || []).slice(0, 1)]);
    }
    return lastNumber;
  }

  public async part1(): Promise<string | number> {
    return this.run(2020);
  }

  public async part2(): Promise<string | number> {
    return this.run(30_000_000);
  }
}
