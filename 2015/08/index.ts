import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    return this.lines.reduce((acc, line) => {
      const escaped = line
        .substring(1, line.length - 1)
        .replace(/\\\\/g, "X")
        .replace(/\\x[0-9a-f]{2}/g, "X")
        .replace(/\\./g, "X");
      return acc + (line.length - escaped.length);
    }, 0);
  }

  public async part2(): Promise<string | number> {
    return this.lines.reduce((acc, line) => {
      const encoded = `"${line.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
      return acc + (encoded.length - line.length);
    }, 0);
  }
}
