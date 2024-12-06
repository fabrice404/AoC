import { print2d } from "./helpers/array";
import { Point } from "./types";

export default abstract class AoCPuzzle {
  protected grid: any[][] = [];

  protected input: string;

  protected isExample: boolean;

  protected lines: string[];

  constructor(input: string, isExample = false) {
    this.input = input;
    this.lines = this.input.split(/\n/gi);
    this.grid = this.lines.map((line) => line.split(""));
    this.isExample = isExample;
  }

  public findCellByValue(value: any): Point[] {
    return this.getGridLoopXY().filter(({ x, y }) => this.grid[y][x] === value);
  }

  public getGridLoopXY(): Point[] {
    const result = [];
    for (let y = 0; y < this.grid.length; y += 1) {
      for (let x = 0; x < this.grid[y].length; x += 1) {
        result.push({ x, y });
      }
    }
    return result;
  }

  public highlightCell(p: Point): void {
    this.grid[p.y][p.x] = `\x1b[42m${this.grid[p.y][p.x]}\x1b[0m`;
  }

  public isInGrid(p: Point): boolean {
    return p.y > 0 && p.y < this.grid.length && p.x > 0 && p.x < this.grid[p.y].length;
  }

  public abstract part1(): Promise<string | number>;

  public abstract part2(): Promise<string | number>;

  public printGrid() {
    // console.clear();
    // process.stdout.cursorTo(0, 0);
    if (typeof this.grid[0][0] === "string" || typeof this.grid[0][0] === "number") {
      print2d(this.grid);
    } else if (this.grid[0][0].value != null) {
      print2d(this.grid.map((row) => row.map((cell) => cell.value)));
    } else {
      console.log(`Unable to print grid`);
    }
  }
  public setInput(input: string) {
    this.input = input;
    this.lines = this.input.split(/\n/gi);
    this.grid = this.lines.map((line) => line.split(""));
  }
}
