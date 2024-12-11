import { sum } from "../../helpers/array";
import { decimalToBinary } from "../../helpers/numbers";
import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    const expected = this.isExample ? 25 : 150;

    const containers = this.lines.map((line) => +line);

    let combinations = 0;
    for (let i = 0; i < 2 ** containers.length; i += 1) {
      const b = decimalToBinary(i, containers.length);

      if (sum(containers.filter((c, i) => (b[i] === "1" ? c : 0))) === expected) {
        combinations += 1;
      }
    }

    return combinations;
  }

  public async part2(): Promise<string | number> {
    const expected = this.isExample ? 25 : 150;

    const containers = this.lines.map((line) => +line);

    const combinations: { [key: number]: number } = {};
    for (let i = 0; i < 2 ** containers.length; i += 1) {
      const b = decimalToBinary(i, containers.length);

      const subContainers = containers.filter((c, i) => (b[i] === "1" ? c : 0));
      if (sum(subContainers) === expected) {
        combinations[subContainers.length] = (combinations[subContainers.length] || 0) + 1;
      }
    }
    const min = Math.min(...Object.keys(combinations).map(Number));
    return combinations[min];
  }
}
