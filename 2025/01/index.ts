import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    let result = 0;
    let val = 50;
    for (const rotation of this.lines) {
      const orientation = rotation.startsWith("R") ? 1 : -1;
      const clicks = +rotation.slice(1);

      val = (val + orientation * clicks) % 100;

      if (val === 0) {
        result += 1;
      }
    }
    return result;
  }

  public async part2(): Promise<string | number> {
    let result = 0;

    let val = 50;
    for (const rotation of this.lines) {
      const orientation = rotation.startsWith("R") ? 1 : -1;
      const clicks = +rotation.slice(1);

      for (let i = 0; i < Math.abs(clicks); i += 1) {
        val += orientation;

        if (val < 0) {
          val += 100;
        }
        val %= 100;

        if (val === 0) {
          result += 1;
        }
      }
    }
    return result;
  }
}
