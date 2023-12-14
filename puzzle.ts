import { print2d } from './helpers/array';

export default abstract class AoCPuzzle {
  protected input: string;

  protected lines: string[];

  protected grid: string[][] = [];

  constructor(input: string) {
    this.input = input;
    this.lines = this.input.split(/\n/gi);
    this.grid = this.lines.map((line) => line.split(''));
  }

  public setInput(input: string) {
    this.input = input;
    this.lines = this.input.split(/\n/gi);
    this.grid = this.lines.map((line) => line.split(''));
  }

  public printGrid() {
    print2d(this.grid);
  }

  public abstract part1(): string | number;
  public abstract part2(): string | number;
}
