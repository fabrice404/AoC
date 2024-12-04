import { sum } from "../../helpers/array";
import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    const results = this.lines.map((line) => {
      const suites = [];
      let suite = line.split(" ").map((word) => Number(word));
      suites.push(suite);
      while (suite.some((value) => value !== 0)) {
        const newSuite = [];
        for (let i = 1; i < suite.length; i += 1) {
          newSuite.push(suite[i] - suite[i - 1]);
        }
        suites.push(newSuite);
        suite = newSuite;
      }

      for (let i = 1; i < suites.length; i += 1) {
        const previousSuite = suites[suites.length - i];
        const currentSuite = suites[suites.length - 1 - i];
        const previousSuiteLastValue = previousSuite[previousSuite.length - 1];
        const currentSuiteLastValue = currentSuite[currentSuite.length - 1];
        currentSuite.push(currentSuiteLastValue + previousSuiteLastValue);
      }

      return suites[0][suites[0].length - 1];
    });
    return sum(results);
  }

  public async part2(): Promise<string | number> {
    const results = this.lines.map((line) => {
      const suites = [];
      let suite = line.split(" ").map((word) => Number(word));
      suites.push(suite);
      while (suite.some((value) => value !== 0)) {
        const newSuite = [];
        for (let i = 1; i < suite.length; i += 1) {
          newSuite.push(suite[i] - suite[i - 1]);
        }
        suites.push(newSuite);
        suite = newSuite;
      }

      for (let i = 1; i < suites.length; i += 1) {
        const previousSuite = suites[suites.length - i];
        const currentSuite = suites[suites.length - 1 - i];
        const previousSuiteFirstValue = previousSuite[0];
        const currentSuiteFirstValue = currentSuite[0];
        currentSuite.unshift(currentSuiteFirstValue - previousSuiteFirstValue);
      }

      return suites[0][0];
    });
    return sum(results);
  }
}
