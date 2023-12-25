import { print2d } from './helpers/array';

export default abstract class AoCPuzzle {
  protected input: string;

  protected lines: string[];

  protected grid: string[][] = [];

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
    print2d(this.grid);
  }

  public abstract part1(): Promise<string | number>;
  public abstract part2(): Promise<string | number>;
}
