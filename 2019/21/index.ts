import { isAscii } from "../../helpers/string";
import AoCPuzzle from "../../puzzle";
import { IntCodeComputer } from "../int-code-computer";

export default class Puzzle extends AoCPuzzle {
  private run(input: string): number {
    const computer = new IntCodeComputer(
      this.input,
      input.split("").map((c) => c.charCodeAt(0)),
    );
    let finished = false;
    let output;

    while (!finished) {
      finished = computer.compute(false);
      output = computer.output!;
      if (!finished) {
        process.stdout.write(isAscii(output) ? String.fromCharCode(output) : output.toString());
      }
    }
    console.log("\n");

    return output!;
  }

  public async part1(): Promise<string | number> {
    const cmd: string[] = ["NOT C J", "NOT B T", "OR T J", "NOT A T", "OR T J", "AND D J", "WALK\n"];
    return this.run(cmd.join("\n"));
  }

  public async part2(): Promise<string | number> {
    const cmd: string[] = ["NOT E T", "NOT H J", "AND T J", "NOT J J", "NOT C T", "AND T J", "NOT B T", "OR T J", "NOT A T", "OR T J", "AND D J", "RUN\n"];
    return this.run(cmd.join("\n"));
  }
}
