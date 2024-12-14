import { decimalToBinary } from "../../helpers/numbers";
import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    // The Josephus Problem, https://www.youtube.com/watch?v=uCsD3ZGzMgE
    const binary = decimalToBinary(+this.input);
    return parseInt(binary.slice(1) + binary[0], 2);
  }

  public async part2(): Promise<string | number> {
    const target = +this.input;

    const pow = Math.floor(Math.log(target) / Math.log(3));
    const maxPowerOf3 = 3 ** pow;

    if (target === maxPowerOf3) {
      return target;
    }
    if (target - maxPowerOf3 <= maxPowerOf3) {
      return target - maxPowerOf3;
    }
    return 2 * target - 3 * maxPowerOf3;
  }
}
