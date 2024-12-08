import { writeFile } from "../../helpers/file";
import { decimalToBinary } from "../../helpers/numbers";
import { isAscii } from "../../helpers/string";
import AoCPuzzle from "../../puzzle";
import { IntCodeComputer } from "../int-code-computer";

const N = "north";
const E = "east";
const S = "south";
const W = "west";

export default class Puzzle extends AoCPuzzle {
  private run(inputs: string[]) {
    let totalOuput = "";

    const computer = new IntCodeComputer(this.input);
    let finished = false;
    let output;

    while (!finished) {
      finished = computer.compute(false);
      output = computer.output!;
      if (output) {
        const outputText = isAscii(output) ? String.fromCharCode(output) : output.toString();
        // process.stdout.write(outputText);
        totalOuput += outputText;
        if (totalOuput.endsWith("Command?")) {
          if (inputs.length === 0) {
            // process.stdout.write(`\n > Empty input`);
            return totalOuput;
          }
          const input = `${inputs.shift()!}\n`;
          // process.stdout.write(`\n > Sending ${input}`);
          computer.addInputs(input.split("").map((c) => c.charCodeAt(0)));
        }
      }
    }
    return totalOuput;
  }

  public async part1(): Promise<string | number> {
    // for (let i = 0; i < 2 ** 8; i += 1) {
    const i = 202;
    const b = decimalToBinary(202, 8);
    const inputs = [
      W,
      b[0] === "1" ? "take fixed point" : null,
      N,
      b[1] === "1" ? "take sand" : null,
      S,
      E,
      E,
      b[2] === "1" ? "take asterisk" : null,
      N,
      N,
      b[3] === "1" ? "take hypercube" : null,
      N,
      b[4] === "1" ? "take coin" : null,
      N,
      b[5] === "1" ? "take easter egg" : null,
      S,
      S,
      S,
      W,
      N,
      b[6] === "1" ? "take spool of cat6" : null,
      N,
      b[7] === "1" ? "take shell" : null,
      W,
      N,
    ].filter(Boolean) as string[];

    const result = this.run(inputs)!;

    writeFile(`./2019/25/logs/${i}.log`, result);
    if (!result!.match(/Alert!/gi)) {
      console.log(result);
      return result.split("Oh, hello!")[1].replace(/[^0-9]/gi, "");
    }
    // }

    return "";
  }

  public async part2(): Promise<string | number> {
    return "THE END";
  }
}
