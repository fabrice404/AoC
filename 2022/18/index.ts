import { isNextTo3D, sum } from "../../helpers/array";
import AoCPuzzle from "../../puzzle";

interface Cube {
  x: number;
  y: number;
  z: number;
  key: string;
}

const neighbors = ({ x, y, z }: { x: number; y: number; z: number }) => [
  {
    x: x + 1,
    y,
    z,
    key: `${x + 1},${y},${z}`,
  },
  {
    x: x - 1,
    y,
    z,
    key: `${x - 1},${y},${z}`,
  },
  {
    x,
    y: y + 1,
    z,
    key: `${x},${y + 1},${z}`,
  },
  {
    x,
    y: y - 1,
    z,
    key: `${x},${y - 1},${z}`,
  },
  {
    x,
    y,
    z: z + 1,
    key: `${x},${y},${z + 1}`,
  },
  {
    x,
    y,
    z: z - 1,
    key: `${x},${y},${z - 1}`,
  },
];

export default class Puzzle extends AoCPuzzle {
  private cubes: Cube[] = [];

  private maxX = 0;

  private maxY = 0;

  private maxZ = 0;

  private grid3d: string[][][] = [];

  public async part1(): Promise<string | number> {
    this.cubes = this.lines.map((line) => {
      const [x, y, z] = line.split(/,/gi).map((n) => parseInt(n, 10));
      this.maxX = Math.max(this.maxX, x);
      this.maxY = Math.max(this.maxY, y);
      this.maxZ = Math.max(this.maxZ, z);
      return {
        x,
        y,
        z,
        key: line,
      };
    });

    return this.cubes.reduce((acc, val, i, cubes) => {
      const freeFaces = neighbors(val).filter((neighbor) => !cubes.map((c) => c.key).includes(neighbor.key)).length;
      return acc + freeFaces;
    }, 0);
  }

  public async part2(): Promise<string | number> {
    this.cubes = this.lines.map((line) => {
      const [x, y, z] = line.split(/,/gi).map((n) => parseInt(n, 10) + 1);
      this.maxX = Math.max(this.maxX, x);
      this.maxY = Math.max(this.maxY, y);
      this.maxZ = Math.max(this.maxZ, z);
      return {
        x,
        y,
        z,
        key: line,
      };
    });

    const EMPTY = "\x1b[31m■\x1b[0m";
    const OUTSIDE = ".";
    const BLOCK = "#";

    for (let z = 0; z <= this.maxZ + 1; z += 1) {
      const yArray: string[][] = [];
      for (let y = 0; y <= this.maxY + 1; y += 1) {
        const xArray: string[] = [];
        for (let x = 0; x <= this.maxX + 1; x += 1) {
          xArray.push(EMPTY);
        }
        yArray.push(xArray);
      }
      this.grid3d.push(yArray);
    }

    this.cubes.forEach((cube) => {
      this.grid3d[cube.z][cube.y][cube.x] = BLOCK;
    });

    let count = this.grid3d.flat(3).filter((cell) => cell === OUTSIDE).length;
    let lastCount = -1;

    const adjacent = (array: any[][][], x: number, y: number, z: number, value: any): number =>
      (array[z][y - 1]?.[x] === value ? 1 : 0) +
      (array[z][y + 1]?.[x] === value ? 1 : 0) +
      (array[z][y]?.[x - 1] === value ? 1 : 0) +
      (array[z][y]?.[x + 1] === value ? 1 : 0) +
      (array[z - 1]?.[y]?.[x] === value ? 1 : 0) +
      (array[z + 1]?.[y]?.[x] === value ? 1 : 0);

    while (count !== lastCount) {
      this.grid3d.forEach((layer, z) => {
        layer.forEach((line, y) => {
          line.forEach((cell, x) => {
            if (x === 0 && y === 0 && z === 0) {
              this.grid3d[z][y][x] = OUTSIDE;
            } else if (cell !== "#" && isNextTo3D(this.grid3d, x, y, z, OUTSIDE)) {
              this.grid3d[z][y][x] = OUTSIDE;
            }
          });
        });
      });
      lastCount = count;
      count = this.grid3d.flat(3).filter((cell) => cell === OUTSIDE).length;
    }

    count = 0;
    lastCount = -1;

    while (count !== lastCount) {
      this.grid3d.forEach((layer, z) => {
        layer.forEach((line, y) => {
          line.forEach((cell, x) => {
            const adj = adjacent(this.grid3d, x, y, z, BLOCK);
            if (![BLOCK, EMPTY].includes(cell) && adj) {
              this.grid3d[z][y][x] = `${adj}`;
            }
          });
        });
      });
      lastCount = count;
      count = this.grid3d.flat(3).filter((cell) => ![EMPTY, BLOCK, OUTSIDE].includes(cell)).length;
    }

    return sum(
      this.grid3d
        .flat(3)
        .filter((cell) => ![EMPTY, BLOCK, OUTSIDE].includes(cell))
        .map(Number),
    );
  }
}
