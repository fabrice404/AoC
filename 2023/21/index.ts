import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private steps: number = 0;

  private oize(x: number, y: number) {
    if (this.grid[y][x] !== "#") {
      this.grid[y][x] = "O";
    }
  }

  private run() {
    for (let i = 0; i < this.steps; i += 1) {
      if (this.grid.flat(3).join("").match(/O/gi)) {
        this.grid.forEach((line, y) => {
          line.forEach((cell, x) => {
            if (cell === "S") {
              this.grid[y][x] = ".";
            }
            if (cell === "O") {
              this.grid[y][x] = "S";
            }
          });
        });
      }

      // find all S
      this.grid.forEach((line, y) => {
        line.forEach((cell, x) => {
          if (cell === "S") {
            this.oize(x + 1, y);
            this.oize(x - 1, y);
            this.oize(x, y + 1);
            this.oize(x, y - 1);
          }
        });
      });
    }

    return this.grid.flat(3).filter((cell) => cell === "O").length;
  }

  public async part1(): Promise<string | number> {
    this.steps = this.lines.length === 11 ? 6 : 64;
    return this.run();
  }

  private mod(n: number, m: number) {
    return ((n % m) + m) % m;
  }

  private getAt(x: number, y: number) {
    return this.grid[this.mod(y, this.grid.length)][this.mod(x, this.grid.length)];
  }

  public async part2(): Promise<string | number> {
    if (this.lines.length === 11) {
      return "skip";
    }
    this.setInput(this.input);
    this.steps = 26501365;

    const results: number[] = [];

    let locations: Map<string, boolean> = new Map<string, boolean>();
    this.grid.forEach((line, y) => {
      line.forEach((cell, x) => {
        if (cell === "S") {
          locations.set(`${x},${y}`, true);
          this.grid[y][x] = ".";
        }
      });
    });

    for (let i = 1; i < 131 * 5 + 65; i += 1) {
      const newLocations: Map<string, boolean> = new Map<string, boolean>();
      [...locations.keys()].forEach((coords) => {
        const [x, y] = coords.split(",").map((n: string) => parseInt(n, 10));
        if (this.getAt(x + 1, y) === ".") {
          newLocations.set(`${x + 1},${y}`, true);
        }
        if (this.getAt(x - 1, y) === ".") {
          newLocations.set(`${x - 1},${y}`, true);
        }
        if (this.getAt(x, y + 1) === ".") {
          newLocations.set(`${x},${y + 1}`, true);
        }
        if (this.getAt(x, y - 1) === ".") {
          newLocations.set(`${x},${y - 1}`, true);
        }
      });

      if (i % 131 === 65) {
        results.push(newLocations.size);
        if (results.length === 4) {
          break;
        }
      }
      locations = newLocations;
    }

    const diffs = (row: number[]) => row.map((v: number, i: number) => v - row[i - 1]).slice(1);

    const totals: number[] = [results[0]];
    let tmp: number[] = [...results];
    while (tmp.some((v) => v !== 0)) {
      tmp = diffs(tmp);
      totals.push(tmp[0]);
    }

    const steps = (26501365 - 65) / 131;
    return totals[0] + totals[1] * steps + (steps * ((steps - 1) * totals[2])) / 2;
  }
}
