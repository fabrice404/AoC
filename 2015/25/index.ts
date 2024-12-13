import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    const [row, column] = this.input
      .split(/\s/gi)
      .map((s) => s.replace(/[^0-9]/gi, ""))
      .filter(Boolean)
      .map(Number);

    let r = 1;
    let c = 1;
    let code = 20151125;
    while (true) {
      r -= 1;
      c += 1;
      if (r === 0) {
        r = c;
        c = 1;
      }
      code = (code * 252533) % 33554393;

      if (r === row && c === column) {
        return code;
      }
    }
  }

  public async part2(): Promise<string | number> {
    return "Happy Xmas!";
  }
}
