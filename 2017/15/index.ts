import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private aUses = 16807;

  private bUses = 48271;

  private divisor = 2147483647;

  public async part1(): Promise<string | number> {
    let [a, b] = this.lines.map((line) => line.replace(/[^0-9]/g, "")).map(Number);

    let pairMatching = 0;

    for (let i = 0; i < 40_000_000; i += 1) {
      a = (a * this.aUses) % this.divisor;
      b = (b * this.bUses) % this.divisor;
      const aBin = a.toString(2).padStart(32, "0").slice(-16);
      const bBin = b.toString(2).padStart(32, "0").slice(-16);
      if (aBin === bBin) {
        pairMatching += 1;
      }
    }
    return pairMatching;
  }

  private nextA(a: number): number {
    let next = (a * this.aUses) % this.divisor;
    while (next % 4 !== 0) {
      next = (next * this.aUses) % this.divisor;
    }
    return next;
  }

  private nextB(b: number): number {
    let next = (b * this.bUses) % this.divisor;
    while (next % 8 !== 0) {
      next = (next * this.bUses) % this.divisor;
    }
    return next;
  }

  public async part2(): Promise<string | number> {
    let [a, b] = this.lines.map((line) => line.replace(/[^0-9]/g, "")).map(Number);

    let pairMatching = 0;

    for (let i = 0; i < 5_000_000; i += 1) {
      a = this.nextA(a);
      b = this.nextB(b);
      const aBin = a.toString(2).padStart(32, "0").slice(-16);
      const bBin = b.toString(2).padStart(32, "0").slice(-16);
      if (aBin === bBin) {
        pairMatching += 1;
      }
    }
    return pairMatching;
  }
}
