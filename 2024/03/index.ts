import { multiply, sum } from "../../helpers/array";
import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    return sum(
      this.input.match(/mul\(\d{1,3},\d{1,3}\)/g)!.map((s) =>
        multiply(
          s
            .replace(/[^\d,]/g, "")
            .split(",")
            .map(Number),
        ),
      ),
    );
  }

  public async part2(): Promise<string | number> {
    const matching = this.input.match(/mul\(\d{1,3},\d{1,3}\)|don't\(\)|do\(\)/g)!;

    const results = [];
    let enabled = true;
    for (const m of matching) {
      if (m.startsWith("do")) {
        enabled = m === "do()";
      }
      if (enabled) {
        results.push(
          multiply(
            m
              .replace(/[^\d,]/g, "")
              .split(",")
              .map(Number),
          ),
        );
      }
    }

    return sum(results);
  }
}
