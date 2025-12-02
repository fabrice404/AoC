import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    const list = this.input
      .split(",")
      .map((ids) => ids.split("-"))
      .map(([min, max]) => [Number(min), Number(max)]);
    let result = 0;
    for (const [min, max] of list) {
      for (let i = min; i <= max; i++) {
        const val = i.toString();
        if (val.slice(0, val.length / 2) === val.slice(val.length / 2)) {
          result += i;
        }
      }
    }
    return result;
  }

  public async part2(): Promise<string | number> {
    const list = this.input
      .split(",")
      .map((ids) => ids.split("-"))
      .map(([min, max]) => [Number(min), Number(max)]);
    let result = 0;
    for (const [min, max] of list) {
      for (let i = min; i <= max; i++) {
        const val = i.toString();

        for (let j = 1; j <= val.length / 2; j++) {
          const pattern = val.slice(0, j);
          let repeated = "";
          while (repeated.length < val.length) {
            repeated += pattern;
          }
          if (repeated === val) {
            result += i;
            break;
          }
        }
      }
    }
    return result;
  }
}
