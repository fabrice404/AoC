import { between } from "../../helpers/numbers";
import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private ranges: number[][] = [];

  public async part1(): Promise<string | number> {
    const ranges = this.lines.map((line) => line.split("-").map(Number));
    ranges.sort((a, b) => {
      if (a[0] === b[0]) {
        return a[1] > b[1] ? 1 : -1;
      }
      return a[0] > b[0] ? 1 : -1;
    });

    let start = ranges[0][0];
    let end = ranges[0][1];
    for (let i = 1; i < ranges.length; i += 1) {
      const range = ranges[i];
      if (range[0] <= end + 1) {
        if (range[1] > end) {
          end = range[1];
        }
      } else {
        this.ranges.push([start, end]);
        start = range[0];
        end = range[1];
      }
    }
    this.ranges.push([start, end]);

    for (let i = 0; i <= (this.isExample ? 10 : 4_294_967_295); i += 1) {
      if (!this.ranges.some((r) => between(i, r[0], r[1]))) {
        return i;
      }
    }

    return -1;
  }

  public async part2(): Promise<string | number> {
    const flatRanges = this.ranges.flat();

    let values = 0;
    for (let i = 1; i < flatRanges.length - 1; i += 2) {
      const from = flatRanges[i];
      const to = flatRanges[i + 1] || 4_262_722_663;
      values += to - 1 - from;
    }

    return values;
  }
}
