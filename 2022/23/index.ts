import { keyToPoint, pointToKey } from "../../helpers/helpers";
import AoCPuzzle from "../../puzzle";
import { CardinalDirection, Point } from "../../types";

export default class Puzzle extends AoCPuzzle {
  private getNeighbors({ x, y }: Point, d?: CardinalDirection): Point[] {
    const NW = { x: x - 1, y: y - 1 };
    const N_ = { x: x + 0, y: y - 1 };
    const NE = { x: x + 1, y: y - 1 };

    const W_ = { x: x - 1, y: y + 0 };
    const E_ = { x: x + 1, y: y + 0 };

    const SW = { x: x - 1, y: y + 1 };
    const S_ = { x: x + 0, y: y + 1 };
    const SE = { x: x + 1, y: y + 1 };

    if (!d) {
      return [NW, N_, NE, W_, E_, SW, S_, SE];
    }

    switch (d) {
      case "N":
        return [N_, NE, NW];
      case "S":
        return [S_, SE, SW];
      case "W":
        return [W_, NW, SW];
      case "E":
        return [E_, NE, SE];
    }
  }

  private reduceGrid() {
    let minX = Number.MAX_SAFE_INTEGER;
    let maxX = Number.MIN_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;
    let maxY = Number.MIN_SAFE_INTEGER;
    this.getGridLoopXY()
      .filter(({ x, y }) => this.grid[y][x] === "#")
      .forEach(({ x, y }) => {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      });

    const smallGrid = [];
    for (let y = minY; y <= maxY; y += 1) {
      const row = [];
      for (let x = minX; x <= maxX; x += 1) {
        row.push(this.grid[y][x]);
      }
      smallGrid.push(row);
    }
    this.grid = smallGrid;
  }

  private run(rounds: number): number {
    const directions: CardinalDirection[] = ["N", "S", "W", "E"];

    for (let i = 0; i < rounds; i += 1) {
      this.extendGrid(1);

      const destinations: { [key: string]: Point[] } = {};
      this.getGridLoopXY()
        .filter(({ x, y }) => this.grid[y][x] === "#")
        .forEach(({ x, y }) => {
          let neighbors = this.getNeighbors({ x, y });
          let neighborsValue = neighbors.map(({ x, y }) => this.grid[y][x]);
          if (neighborsValue.every((n) => n === ".")) {
            return;
          }

          for (const direction of directions) {
            neighbors = this.getNeighbors({ x, y }, direction);
            neighborsValue = neighbors.map(({ x, y }) => this.grid[y][x]);
            if (neighborsValue.every((n) => n === ".")) {
              const key = pointToKey(neighbors[0]);
              if (!destinations[key]) {
                destinations[key] = [];
              }
              destinations[key].push({ x, y });
              return;
            }
          }
        });

      if (Object.keys(destinations).length > 0) {
        for (const key of Object.keys(destinations)) {
          if (destinations[key].length === 1) {
            const newPosition = keyToPoint(key);
            const oldPosition = destinations[key][0];
            this.grid[newPosition.y][newPosition.x] = "#";
            this.grid[oldPosition.y][oldPosition.x] = ".";
          }
        }
      } else {
        return i + 1;
      }

      directions.push(directions.shift()!);
      this.reduceGrid();
    }

    this.reduceGrid();

    return this.grid.flat().filter((x) => x === ".").length;
  }

  public async part1(): Promise<string | number> {
    return this.run(10);
  }

  public async part2(): Promise<string | number> {
    this.setInput(this.input);
    return this.run(999);
  }
}
