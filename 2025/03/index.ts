import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    let result = 0;

    for (const line of this.lines) {
      const joltages = line.split("").map(Number);
      const high = Math.max(...joltages.slice(0, -1));

      let max = 0;

      for (let i = joltages.indexOf(high) + 1; i < joltages.length; i += 1) {
        const tmp = +`${high}${joltages[i]}`;
        if (tmp > max) {
          max = +tmp;
        }
      }
      result += max;
    }

    return result;
  }

  public async part2(): Promise<string | number> {
    let result = 0;

    for (const line of this.lines) {
      const joltages = line.split("").map(Number);
      let remaining = 12;

      let tmp = "";
      let tmpIndex = 0;
      while (remaining > 0) {
        const currentSlice = joltages.slice(tmpIndex, joltages.length + 1 - remaining);
        const high = Math.max(...currentSlice);

        tmpIndex = joltages.indexOf(high, tmpIndex) + 1;
        tmp += `${high}`;

        remaining -= 1;
      }
      result += +tmp;
    }

    return result;
  }
}
