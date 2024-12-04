import { countItems } from "../../helpers/array";
import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private listA: number[] = [];

  private listB: number[] = [];

  public async part1(): Promise<string | number> {
    for (const line of this.lines) {
      const [a, b] = line.split(/\s/gi).filter(Boolean).map(Number);
      this.listA.push(a);
      this.listB.push(b);
    }

    this.listA.sort((a, b) => a - b);
    this.listB.sort((a, b) => a - b);

    return this.listA.map((n, i) => Math.abs(this.listB[i] - n)).reduce((acc, val) => acc + val, 0);
  }

  public async part2(): Promise<string | number> {
    const itemsB = countItems(this.listB);

    return this.listA.map((n) => n * (itemsB.get(n) || 0)).reduce((acc, val) => acc + val, 0);
  }
}
