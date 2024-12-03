import { print2d } from './helpers/array';

export default abstract class AoCPuzzle {
  protected input: string;

  protected lines: string[];

  protected grid: any[][] = [];

  protected isExample: boolean;

  constructor(input: string, isExample = false) {
    this.input = input;
    this.lines = this.input.split(/\n/gi);
    this.grid = this.lines.map((line) => line.split(''));
    this.isExample = isExample;
  }

  public setInput(input: string) {
    this.input = input;
    this.lines = this.input.split(/\n/gi);
    this.grid = this.lines.map((line) => line.split(''));
  }

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

  public abstract part1(): Promise<string | number>;
  public abstract part2(): Promise<string | number>;
}
