import AoCPuzzle from "../../puzzle";

interface Disc {
  id: number;
  positionsCount: number;
  t0Position: number;
  fn: (t: number) => number;
}

export default class Puzzle extends AoCPuzzle {
  private discs: Disc[] = [];

  private run(): number {
    let t = 0;
    while (true) {
      if (this.discs.every((disc, i) => disc.fn(t + i + 1) === 0)) {
        return t;
      }
      t += 1;
    }
  }

  public async part1(): Promise<string | number> {
    this.discs = this.lines.map((line) => {
      const [, id, positionsCount, t0Position] = line.match(/Disc #(\d+) has (\d+) positions; at time=0, it is at position (\d+)./)!.map(Number);
      return {
        id,
        positionsCount,
        t0Position,
        fn: (t: number) => (t + t0Position) % positionsCount,
      };
    });

    return this.run();
  }

  public async part2(): Promise<string | number> {
    this.discs.push({
      id: this.discs.length + 1,
      positionsCount: 11,
      t0Position: 0,
      fn: (t: number) => (t + 0) % 11,
    });
    return this.run();
  }
}
