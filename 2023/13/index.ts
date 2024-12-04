import { rotate, sum } from "../../helpers/array";
import { replaceAt } from "../../helpers/string";
import AoCPuzzle from "../../puzzle";

const findSymetrical = (puzzle: string[], ignoreResult: number = 0): number => {
  for (let i = 1; i < puzzle.length; i += 1) {
    let row = puzzle[i];
    let above = puzzle[i - 1];
    let symetrical = row === above;
    let j = 1;
    while (symetrical) {
      row = puzzle[i - 1 - j];
      above = puzzle[i + j];
      if (i !== ignoreResult && (row === undefined || above === undefined)) {
        return i;
      }
      symetrical = row === above;
      j += 1;
    }
  }
  return 0;
};

interface Result {
  index: number;
  result: number;
  type: string;
}

export default class Puzzle extends AoCPuzzle {
  private puzzles: string[][] = [];

  private results: Result[] = [];

  private init() {
    let puzzle: string[] = [];
    this.lines.forEach((line) => {
      if (line === "") {
        this.puzzles.push(puzzle);
        puzzle = [];
      } else {
        puzzle.push(line.replace(/\./g, " "));
      }
    });
    this.puzzles.push(puzzle);
  }

  public async part1(): Promise<string | number> {
    this.init();

    this.results = this.puzzles.map((puzzle, index) => {
      let result = findSymetrical(puzzle) * 100;
      if (result) {
        return { index, result, type: "horizontal" };
      }
      result = findSymetrical(rotate(puzzle));
      if (result) {
        return { index, result, type: "vertical" };
      }
      return { index, result: 0, type: "unknown" };
    });
    return sum(this.results.map((r) => r.result));
  }

  public async part2(): Promise<string | number> {
    const results = this.puzzles.map((puzzle, index) => {
      let result = 0;
      for (let i = 0; i < puzzle.length; i += 1) {
        for (let j = 0; j < puzzle[i].length; j += 1) {
          const newPuzzle = [...puzzle];
          newPuzzle[i] = replaceAt(newPuzzle[i], j, newPuzzle[i][j] === "#" ? " " : "#");

          const previousResult = this.results.find((r) => r.index === index)!;
          result = findSymetrical(newPuzzle, previousResult.type === "horizontal" ? previousResult.result / 100 : 0) * 100;
          if (result) {
            return result;
          }

          result = findSymetrical(rotate(newPuzzle), previousResult.type === "vertical" ? previousResult.result : 0);
          if (result) {
            return result;
          }
        }
      }
      return 0;
    });
    return sum(results);
  }
}
