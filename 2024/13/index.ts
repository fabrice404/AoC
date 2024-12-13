import { sum } from "../../helpers/array";
import AoCPuzzle from "../../puzzle";
import { Point } from "../../types";

interface Machine {
  a: Point;
  b: Point;
  target: Point;
}

export default class Puzzle extends AoCPuzzle {
  private machines: Machine[] = [];

  private getButtonsPresses(machine: Machine): number {
    const { a, b, target: t } = machine;
    const j = (a.y * t.x - a.x * t.y) / (a.y * b.x - a.x * b.y);
    const i = (t.x - b.x * j) / a.x;

    if (i % 1 === 0 && j % 1 === 0) {
      return i * 3 + j;
    }
    return 0;
  }

  public async part1(): Promise<string | number> {
    for (let i = 0; i < this.lines.length; i += 4) {
      const [ax, ay] = this.lines[i].match(/\d+/gi)!.map(Number);
      const [bx, by] = this.lines[i + 1].match(/\d+/gi)!.map(Number);
      const [tx, ty] = this.lines[i + 2].match(/\d+/gi)!.map(Number);
      this.machines.push({
        a: { x: ax, y: ay },
        b: { x: bx, y: by },
        target: { x: tx, y: ty },
      });
    }

    return sum(this.machines.map((m) => this.getButtonsPresses(m)));
  }

  public async part2(): Promise<string | number> {
    this.machines.forEach((machine) => {
      machine.target.x = machine.target.x + 10000000000000;
      machine.target.y = machine.target.y + 10000000000000;
    });

    return sum(this.machines.map((m) => this.getButtonsPresses(m)));
  }
}
