import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private ranges: number[][] = [];

  public async part1(): Promise<string | number> {
    let fresh = 0;

    const [inp1, inp2] = this.input
      .trim()
      .split("\n\n")
      .map((section) => section.split("\n"));

    this.ranges = inp1.map((line) => line.split("-").map(Number));
    const ingredients = inp2.map(Number);

    for (const ingredient of ingredients) {
      for (const [min, max] of this.ranges) {
        if (ingredient >= min && ingredient <= max) {
          fresh += 1;
          break;
        }
      }
    }

    return fresh;
  }

  public async part2(): Promise<string | number> {
    this.ranges.sort((a, b) => a[0] - b[0]);

    const mergedRanges: number[][] = [];

    let currentRange = this.ranges[0];
    for (let i = 1; i < this.ranges.length; i += 1) {
      const [, currentMax] = currentRange;
      const [nextMin, nextMax] = this.ranges[i];

      if (nextMin <= currentMax + 1) {
        currentRange[1] = Math.max(currentMax, nextMax);
      } else {
        mergedRanges.push(currentRange);
        currentRange = this.ranges[i];
      }
    }

    mergedRanges.push(currentRange);

    let totalIds = 0;
    for (const [min, max] of mergedRanges) {
      totalIds += max - min + 1;
    }

    return totalIds;
  }
}
