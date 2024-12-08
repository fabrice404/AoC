import { ConsoleColor, pointToKey } from "./helpers/helpers";
import { Point } from "./types";

export default abstract class AoCPuzzle {
  protected grid: any[][] = [];

  protected highlights: Map<string, ConsoleColor>;

  protected input: string;

  protected isExample: boolean;

  protected lines: string[];

  constructor(input: string, isExample = false) {
    this.input = input;
    this.lines = this.input.split(/\n/gi);
    this.grid = this.lines.map((line) => line.split(""));
    this.isExample = isExample;
    this.highlights = new Map();
  }

  public clearHighlights() {
    this.highlights = new Map();
  }

  public cloneGrid(): any[][] {
    return JSON.parse(JSON.stringify(this.grid));
  }

  public extendGrid(size: number) {
    const a = Array.from({ length: size }, () => ".");
    for (let y = 0; y < this.grid.length; y += 1) {
      this.grid[y] = [...a, ...this.grid[y], ...a];
    }

    const b = Array.from({ length: this.grid[0].length }, () => ".");
    for (let i = 0; i < 10; i += 1) {
      this.grid.unshift([...b]);
      this.grid.push([...b]);
    }
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

  public getValue(p: Point): any {
    return this.grid[p.y][p.x];
  }

  public highlightCell(p: Point, color: ConsoleColor = ConsoleColor.Green): void {
    const key = pointToKey(p);
    if (!this.highlights.has(key)) {
      this.highlights.set(key, color);
    }
  }

  public isInGrid(p: Point): boolean {
    return p.y >= 0 && p.y < this.grid.length && p.x >= 0 && p.x < this.grid[p.y].length;
  }

  public abstract part1(): Promise<string | number>;

  public abstract part2(): Promise<string | number>;

  public printGrid() {
    console.log("");
    for (let y = 0; y < Math.min(this.grid.length, 200); y += 1) {
      const row = [];
      for (let x = 0; x < Math.min(this.grid[y].length, 200); x += 1) {
        const key = pointToKey({ x, y });
        if (this.highlights.has(key)) {
          row.push(`\x1b[${this.highlights.get(key)!}m${this.grid[y][x]}\x1b[0m`);
        } else {
          row.push(this.grid[y][x]);
        }
      }
      console.log(row.join(""));
    }
    console.log("");
  }
  public setInput(input: string) {
    this.input = input;
    this.lines = this.input.split(/\n/gi);
    this.grid = this.lines.map((line) => line.split(""));
  }
}
