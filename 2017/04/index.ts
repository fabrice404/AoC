import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private isValidLine(line: string): boolean {
    const words = line.split(/\s/gi);
    return words.length === new Set(words).size;
  }

  private isValidLineAnagrams(line: string): boolean {
    const words = line.split(/\s/gi).map((word) => word.split("").sort().join(""));
    return words.length === new Set(words).size;
  }

  public async part1(): Promise<string | number> {
    return this.lines.filter(this.isValidLine).length;
  }

  public async part2(): Promise<string | number> {
    return this.lines.filter(this.isValidLineAnagrams).length;
  }
}
