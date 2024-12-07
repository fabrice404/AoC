import AoCPuzzle from "../../puzzle";
import { IntCodeComputer } from "../int-code-computer";

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    const computer = new IntCodeComputer(this.input, [1]);
    let finished = false;
    while (!finished) {
      finished = computer.compute(false);
    }

    return computer.output!;
  }

  public async part2(): Promise<string | number> {
    const computer = new IntCodeComputer(this.input, [2]);
    let finished = false;
    while (!finished) {
      finished = computer.compute(false);
    }

    return computer.output!;
  }
}
