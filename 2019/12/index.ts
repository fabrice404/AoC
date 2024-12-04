import { lcm } from "../../helpers/numbers";
import AoCPuzzle from "../../puzzle";
import { Point } from "../../types";

interface Moon {
  position: Point;
  velocity: Point;
}

type Axis = "x" | "y" | "z";

export default class Puzzle extends AoCPuzzle {
  private initialState: Moon[] = [];

  private moons: Moon[] = [];

  private countStepToInitialPosition(axis: Axis): number {
    let i = 1;
    while (true) {
      for (let j = 0; j < this.moons.length; j += 1) {
        const a = this.moons[j];
        for (let k = j + 1; k < this.moons.length; k += 1) {
          const b = this.moons[k];
          if (a.position[axis]! > b.position[axis]!) {
            a.velocity[axis] -= 1;
            b.velocity[axis] += 1;
          } else if (a.position[axis]! < b.position[axis]!) {
            a.velocity[axis] += 1;
            b.velocity[axis] -= 1;
          }
        }
      }
      for (const moon of this.moons) {
        moon.position[axis] += moon.velocity[axis]!;
      }
      if (this.moons.every((moon, i) => moon.position[axis] === this.initialState[i].position[axis] && moon.velocity[axis] === this.initialState[i].velocity[axis])) {
        return i;
      }
      i += 1;
    }
  }

  public async part1(): Promise<string | number> {
    const steps = this.isExample ? 10 : 1000;

    this.moons = this.lines.map((line) => {
      const [x, y, z] = line
        .replace(/[^0-9- ]/gi, "")
        .split(/\s/gi)
        .map(Number);
      return {
        position: { x, y, z },
        velocity: { x: 0, y: 0, z: 0 },
      };
    });

    for (let i = 0; i < steps; i += 1) {
      for (let j = 0; j < this.moons.length; j += 1) {
        const a = this.moons[j];
        for (let k = j + 1; k < this.moons.length; k += 1) {
          const b = this.moons[k];
          (["x", "y", "z"] as Axis[]).forEach((axis) => {
            if (a.position[axis]! > b.position[axis]!) {
              a.velocity[axis] -= 1;
              b.velocity[axis] += 1;
            } else if (a.position[axis]! < b.position[axis]!) {
              a.velocity[axis] += 1;
              b.velocity[axis] -= 1;
            }
          });
        }
      }
      for (const moon of this.moons) {
        moon.position.x += moon.velocity.x;
        moon.position.y += moon.velocity.y;
        moon.position.z! += moon.velocity.z!;
      }
    }

    return this.moons.reduce(
      (acc, moon) =>
        acc +
        (Math.abs(moon.position.x) + Math.abs(moon.position.y) + Math.abs(moon.position.z!)) * (Math.abs(moon.velocity.x) + Math.abs(moon.velocity.y) + Math.abs(moon.velocity.z!)),
      0,
    );
  }

  public async part2(): Promise<string | number> {
    this.moons = this.lines.map((line) => {
      const [x, y, z] = line
        .replace(/[^0-9- ]/gi, "")
        .split(/\s/gi)
        .map(Number);
      return {
        position: { x, y, z },
        velocity: { x: 0, y: 0, z: 0 },
      };
    });
    this.initialState = JSON.parse(JSON.stringify(this.moons));

    const [x, y, z] = (["x", "y", "z"] as Axis[]).map((axis) => this.countStepToInitialPosition(axis));

    return lcm(lcm(x, y), z);
  }
}
