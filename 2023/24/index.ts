/* eslint-disable @typescript-eslint/no-require-imports */

import AoCPuzzle from "../../puzzle";

const { init } = require("z3-solver");

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  z1: number;
  z2: number;
  dx: number;
  dy: number;
  dz: number;
}

export default class Puzzle extends AoCPuzzle {
  private geometricalLines: Line[] = [];

  private testArea: number[] = [];

  private intersection(x1: number, x2: number, y1: number, y2: number, x3: number, x4: number, y3: number, y4: number) {
    // line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
    const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    if (denominator === 0) {
      return false; // lines are parallel
    }
    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;

    const xCollision = x1 + ua * (x2 - x1);
    const yCollision = y1 + ua * (y2 - y1);

    const xA = x1 > x2 ? x1 > xCollision : x1 < xCollision;
    const yA = y1 > y2 ? y1 > yCollision : y1 < yCollision;

    const xB = x3 > x4 ? x3 > xCollision : x3 < xCollision;
    const yB = y3 > y4 ? y3 > yCollision : y3 < yCollision;

    return xCollision > this.testArea[0] && xCollision < this.testArea[1] && yCollision > this.testArea[0] && yCollision < this.testArea[1] && xA && yA && xB && yB;
  }

  public async part1(): Promise<string | number> {
    this.geometricalLines = this.lines.map((line) => {
      const [x1, y1, z1, dx, dy, dz] = line
        .split(/,|@/gi)
        .filter((s) => s)
        .map((s) => +s.trim());
      const x2 = x1 + dx;
      const y2 = y1 + dy;
      const z2 = z1 + dz;
      return { x1, y1, x2, y2, z1, z2, dx, dy, dz };
    });

    this.testArea = this.geometricalLines.length === 5 ? [7, 27] : [200000000000000, 400000000000000];
    let collisions = 0;

    for (let i = 0; i < this.geometricalLines.length; i += 1) {
      for (let j = i + 1; j < this.geometricalLines.length; j += 1) {
        if (i === j) {
          continue;
        }
        const lineA = this.geometricalLines[i];
        const lineB = this.geometricalLines[j];
        const { x1, x2, y1, y2 } = lineA;
        const { x1: x3, x2: x4, y1: y3, y2: y4 } = lineB;

        if (this.intersection(x1, x2, y1, y2, x3, x4, y3, y4)) {
          collisions += 1;
        }
      }
    }

    return collisions;
  }

  public async part2(): Promise<string | number> {
    const { Context } = await init();
    const { Solver, Int } = Context("main");
    const solver = new Solver();

    const x = Int.const("x");
    const y = Int.const("y");
    const z = Int.const("z");
    const dx = Int.const("dx");
    const dy = Int.const("dy");
    const dz = Int.const("dz");
    const t = this.geometricalLines.map((_, i) => Int.const(`t${i}`));

    this.geometricalLines.slice(0, 4).forEach((line, i) => {
      solver.add(t[i].mul(line.dx).add(line.x1).sub(x).sub(t[i].mul(dx)).eq(0));
      solver.add(t[i].mul(line.dy).add(line.y1).sub(y).sub(t[i].mul(dy)).eq(0));
      solver.add(t[i].mul(line.dz).add(line.z1).sub(z).sub(t[i].mul(dz)).eq(0));
    });

    await solver.check();

    const result = solver.model().eval(x.add(y).add(z)).value();
    setTimeout(() => {
      process.exit();
    }, 30000);
    return `${result}`;
  }
}
