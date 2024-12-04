import { lcm } from "../../helpers/numbers";
import AoCPuzzle from "../../puzzle";

interface Line {
  id: number;
  offset: number;
}

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    const departureTime = +this.lines[0];
    const lines = this.lines[1]
      .split(",")
      .filter((x) => x.replace(/[^0-9]+/gi, ""))
      .map(Number);

    let minTime = Number.MAX_SAFE_INTEGER;
    let minTimeLine = 0;
    for (const line of lines) {
      let t = 0;
      while (t < departureTime) {
        t += line;
      }

      if (t - departureTime < minTime) {
        minTime = t - departureTime;
        minTimeLine = line;
      }
    }
    return minTime * minTimeLine;
  }

  public async part2(): Promise<string | number> {
    const lines: Line[] = [];
    for (let i = 0; i < this.lines[1].split(",").length; i += 1) {
      const line = this.lines[1].split(",")[i];
      if (line !== "x") {
        lines.push({
          id: +line,
          offset: i,
        });
      }
    }

    let t = lines[0].id;
    let period = lines[0].id;

    for (const line of lines) {
      while ((t + line.offset) % line.id !== 0) {
        t += period;
      }
      period = lcm(period, line.id);
    }
    return t;
  }
}
