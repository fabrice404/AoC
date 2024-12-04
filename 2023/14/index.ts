import AoCPuzzle from "../../puzzle";

const moveNorth = (grid: string[][]): string[][] => {
  for (let y = 0; y < grid.length; y += 1) {
    for (let x = 0; x < grid[y].length; x += 1) {
      if (grid[y][x] === "O") {
        let movable = true;
        let y2 = y;
        while (y2 > 0 && movable) {
          if (grid[y2 - 1][x] === ".") {
            grid[y2 - 1][x] = "O";
            grid[y2][x] = ".";
          } else {
            movable = false;
          }
          y2 -= 1;
        }
      }
    }
  }
  return grid;
};

const moveSouth = (grid: string[][]): string[][] => {
  for (let y = grid.length - 1; y >= 0; y -= 1) {
    for (let x = 0; x < grid[y].length; x += 1) {
      if (grid[y][x] === "O") {
        let movable = true;
        let y2 = y;
        while (y2 < grid.length - 1 && movable) {
          if (grid[y2 + 1][x] === ".") {
            grid[y2 + 1][x] = "O";
            grid[y2][x] = ".";
          } else {
            movable = false;
          }
          y2 += 1;
        }
      }
    }
  }
  return grid;
};

const moveWest = (grid: string[][]): string[][] => {
  for (let y = 0; y < grid.length; y += 1) {
    for (let x = 0; x < grid[y].length; x += 1) {
      if (grid[y][x] === "O") {
        let movable = true;
        let x2 = x;
        while (x2 > 0 && movable) {
          if (grid[y][x2 - 1] === ".") {
            grid[y][x2 - 1] = "O";
            grid[y][x2] = ".";
          } else {
            movable = false;
          }
          x2 -= 1;
        }
      }
    }
  }
  return grid;
};

const moveEast = (grid: string[][]): string[][] => {
  for (let y = 0; y < grid.length; y += 1) {
    for (let x = grid[y].length - 1; x >= 0; x -= 1) {
      if (grid[y][x] === "O") {
        let movable = true;
        let x2 = x;
        while (x2 < grid[y].length - 1 && movable) {
          if (grid[y][x2 + 1] === ".") {
            grid[y][x2 + 1] = "O";
            grid[y][x2] = ".";
          } else {
            movable = false;
          }
          x2 += 1;
        }
      }
    }
  }
  return grid;
};

export default class Puzzle extends AoCPuzzle {
  private cache = new Map<string, any>();

  private cacheHits = 0;

  private gridKey(direction: string): string {
    return direction + this.grid.map((line) => line.join("")).join("");
  }

  public async part1(): Promise<string | number> {
    this.grid = moveNorth(this.grid);
    // this.printGrid();

    return this.grid.reduce((acc, line, i) => acc + line.filter((rock) => rock === "O").length * (this.lines.length - i), 0);
  }

  public async part2(): Promise<string | number> {
    for (let i = 0; i < 1000000000; i += 1) {
      const key = this.gridKey("before");
      if (this.cache.has(key)) {
        const cached = this.cache.get(key)!;
        this.grid = [...cached.grid];
        const cycle = i - cached.i;
        i += Math.floor((1000000000 - i) / cycle) * cycle;
      }
      this.grid = moveNorth(this.grid);
      this.grid = moveWest(this.grid);
      this.grid = moveSouth(this.grid);
      this.grid = moveEast(this.grid);
      this.cache.set(key, { grid: [...this.grid], i });
    }
    // this.printGrid();

    return this.grid.reduce((acc, line, i) => acc + line.filter((rock) => rock === "O").length * (this.lines.length - i), 0);
  }
}
