import { sum } from "../../helpers/array";
import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    const operations = [];

    for (const line of this.lines) {
      const ops = line.split(" ").filter((x) => x);
      operations.push(ops);
    }

    const results = [];
    const signIndex = operations.length - 1;
    for (let i = 0; i < operations[0].length; i += 1) {
      const sign = operations[signIndex][i];
      const nums = [];
      for (let j = 0; j < signIndex; j += 1) {
        nums.push(Number(operations[j][i]));
      }
      const result = eval(nums.join(` ${sign} `));
      results.push(result);
    }

    return sum(results);
  }

  public async part2(): Promise<string | number> {
    const operations = [];
    let group = [];
    for (let i = 0; i < this.lines[0].length; i += 1) {
      const column = [];
      for (let j = 0; j < this.lines.length; j += 1) {
        column.push(this.lines[j][i]);
      }
      const tmp = column.join("").trim();
      if (tmp === "") {
        operations.push(group);
        group = [];
      } else {
        group.push(tmp);
      }
    }
    operations.push(group);
    console.log(operations);

    const results = [];
    for (let i = 0; i < operations.length; i += 1) {
      let sign = "";
      const nums = [];
      for (let j = 0; j < operations[i].length; j += 1) {
        const val = operations[i][j];
        if (j === 0) {
          nums.push(Number(val.substring(0, val.length - 1)));
          sign = val.substring(val.length - 1);
        } else {
          nums.push(Number(val));
        }
      }
      console.log(nums.join(` ${sign} `));
      const result = eval(nums.join(` ${sign} `));
      results.push(result);
    }
    return sum(results);
  }
}
