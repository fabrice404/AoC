import { getAllNeighborsCoordinates } from "../../helpers/array";
import AoCPuzzle from "../../puzzle";

const OPEN = ".";
const TREES = "|";
const LUMBERYARD = "#";

const tick = (grid: string[][]): string[][] => {
  const newGrid = grid.map((row) => row.slice());

  for (let y = 0; y < grid.length; y += 1) {
    for (let x = 0; x < grid[y].length; x += 1) {
      const current = grid[y][x];

      const neighbors = getAllNeighborsCoordinates({ x, y })
        .filter((p) => p.y >= 0 && p.y < grid.length && p.x >= 0 && p.x < grid[p.y].length)
        .map((p) => grid[p.y][p.x]);

      const treesCount = neighbors.filter((v) => v === TREES).length;
      const lumberyardCount = neighbors.filter((v) => v === LUMBERYARD).length;

      if (current === OPEN) {
        if (treesCount >= 3) {
          newGrid[y][x] = TREES;
        }
      } else if (current === TREES) {
        if (lumberyardCount >= 3) {
          newGrid[y][x] = LUMBERYARD;
        }
      } else if (current === LUMBERYARD) {
        if (!(lumberyardCount >= 1 && treesCount >= 1)) {
          newGrid[y][x] = OPEN;
        }
      }
    }
  }
  return newGrid;
};

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    let grid = this.grid;
    for (let i = 0; i < 10; i++) {
      grid = tick(grid);
    }

    return grid.flat().filter((v) => v === TREES).length * grid.flat().filter((v) => v === LUMBERYARD).length;
  }

  public async part2(): Promise<string | number> {
    this.resetInput();

    const patterns = new Map<string, number>();
    let grid = this.grid;
    let cycleStart = -1;
    let cycleLength = -1;

    for (let i = 0; i < 1000000000; i++) {
      const gridKey = grid.map((row) => row.join("")).join("\n");
      if (patterns.has(gridKey)) {
        cycleStart = patterns.get(gridKey)!;
        cycleLength = i - cycleStart;
        break;
      }
      patterns.set(gridKey, i);
      grid = tick(grid);
    }

    const totalTicks = 1000000000;
    const remainingTicks = (totalTicks - cycleStart) % cycleLength;

    for (let i = 0; i < remainingTicks; i++) {
      grid = tick(grid);
    }

    return grid.flat().filter((v) => v === TREES).length * grid.flat().filter((v) => v === LUMBERYARD).length;
  }
}
