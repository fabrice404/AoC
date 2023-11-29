export abstract class AoCPuzzle {
  protected input: string;

  protected lines: string[];

  constructor(input: string) {
    this.input = input;
    this.lines = this.input.split(/\n/gi);
  }

  public setInput(input: string) {
    this.input = input;
    this.lines = this.input.split(/\n/gi);
  }

  public abstract part1(): string | number;
  public abstract part2(): string | number;
}
