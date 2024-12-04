import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    return this.input.split("").reduce((acc, char) => acc + (char === "(" ? 1 : -1), 0);
  }

  public async part2(): Promise<string | number> {
    let i = 0;
    let floor = 0;
    for (const char of this.input.split("")) {
      floor += char === "(" ? 1 : -1;
      if (floor === -1) {
        return i + 1;
      }
      i += 1;
    }
    return "<NOT FOUND>";
  }
}
