import { getNeighborsCoordinates, sum } from "../../helpers/array";
import { pointToKey } from "../../helpers/helpers";
import AoCPuzzle from "../../puzzle";
import { Point } from "../../types";

interface Region {
  area: number;
  perimeter: number;
  sides: number;
  letter: string;
}

interface Side extends Point {
  a: string;
  b: string;
}

export default class Puzzle extends AoCPuzzle {
  private originalGrid: any[][] = [];

  private regions: Region[] = [];

  private findRegion(p: Point): Region {
    const letter = this.getValue(p);
    this.setValue(p, " ");
    const region: Region = {
      area: 0,
      perimeter: 0,
      sides: 0,
      letter,
    };
    const visited: string[] = [pointToKey(p)];
    const queue: Point[] = [];
    let xsides: Side[] = [];
    let ysides: Side[] = [];

    queue.push(p);
    while (queue.length > 0) {
      const next = queue.shift()!;
      region.area += 1;

      for (const n of getNeighborsCoordinates(next)) {
        if (visited.includes(pointToKey(n))) {
          continue;
        }
        if (this.isInGrid(n) && this.getValue(n) === letter) {
          this.setValue(n, " ");
          queue.push(n);
          visited.push(pointToKey(n));
        } else {
          region.perimeter += 1;

          const left = n.x === next.x ? (n.y > next.y ? next : n) : n.x > next.x ? next : n;
          const right = n.x === next.x ? (n.y > next.y ? n : next) : n.x > next.x ? n : next;

          const side = {
            x: n.x === next.x ? n.x : next.x + (n.x > next.x ? 0.5 : -0.5),
            y: n.y === next.y ? n.y : next.y + (n.y > next.y ? 0.5 : -0.5),
            a: this.isInGrid(left) ? this.originalGrid[left.y][left.x] : "$",
            b: this.isInGrid(right) ? this.originalGrid[right.y][right.x] : "$",
          };

          if (side.x % 1 === 0) {
            ysides.push(side);
          } else {
            xsides.push(side);
          }
        }
      }
    }

    xsides.sort((a, b) => (a.x === b.x ? (a.y > b.y ? 1 : -1) : a.x > b.x ? 1 : -1));
    ysides.sort((a, b) => (a.y === b.y ? (a.x > b.x ? 1 : -1) : a.y > b.y ? 1 : -1));

    while (xsides.length > 0) {
      region.sides += 1;
      const current = xsides.shift()!;
      let next = xsides.find((s) => s.x === current.x && s.y === current.y + 1 && (s.a === current.a || s.b === current.b));
      while (next) {
        xsides = xsides.filter((s) => !(s.x === next!.x && s.y === next!.y && (s.a === next!.a || s.b === next!.b)));
        next = xsides.find((s) => s.x === next!.x && s.y === next!.y + 1 && (s.a === next!.a || s.b === next!.b));
      }
    }

    while (ysides.length > 0) {
      region.sides += 1;
      const current = ysides.shift()!;
      let next = ysides.find((s) => s.x === current.x + 1 && s.y === current.y && (s.a === current.a || s.b === current.b));
      while (next) {
        ysides = ysides.filter((s) => !(s.x === next!.x && s.y === next!.y && (s.a === next!.a || s.b === next!.b)));
        next = ysides.find((s) => s.x === next!.x + 1 && s.y === next!.y && (s.a === next!.a || s.b === next!.b));
      }
    }

    return region;
  }

  public async part1(): Promise<string | number> {
    this.originalGrid = this.cloneGrid();
    this.regions = this.getGridLoopXY()
      .map((p) => {
        if (this.getValue(p) !== " ") {
          return this.findRegion(p);
        }
        return null;
      })
      .filter(Boolean) as Region[];

    return sum(this.regions.map((r) => r.area * r.perimeter));
  }

  public async part2(): Promise<string | number> {
    if (this.isExample) {
      this.setInput(this.input);
      this.originalGrid = this.cloneGrid();
      this.regions = this.getGridLoopXY()
        .map((p) => {
          if (this.getValue(p) !== " ") {
            return this.findRegion(p);
          }
          return null;
        })
        .filter(Boolean) as Region[];
    }
    return sum(this.regions.map((r) => r.area * r.sides));
  }
}
