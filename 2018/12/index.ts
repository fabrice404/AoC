import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private generations: number = 20;

  private state: string = "";

  private run() {
    this.state = this.lines[0].split(": ")[1].trim();
    const rules = this.lines.slice(2).map((rule) => {
      const [condition, value] = rule.split(" => ");
      return { condition, value };
    });

    const OFFSET = 4;
    let result = 0;
    let previousResult = 0;
    let previousDifference = 0;
    let sameDifferenceCount = 0;

    for (let generation = 1; generation <= this.generations; generation += 1) {
      this.state = `....${this.state}....`;
      let nextState = this.state.replace(/#/g, ".");

      for (let i = 0; i < this.state.length - 4; i += 1) {
        rules.forEach((rule) => {
          if (this.state.substring(i, i + 5) === rule.condition) {
            nextState = nextState.substring(0, i + 2) + rule.value + nextState.substring(i + 3);
          }
        });
      }

      this.state = nextState;

      result = this.state.split("").reduce((acc, val, i) => {
        const potNum = i - OFFSET * generation;
        if (val === "#") {
          acc += potNum;
        }
        return acc;
      }, 0);

      if (result - previousResult === previousDifference) {
        sameDifferenceCount += 1;
        if (sameDifferenceCount === 3) {
          return (this.generations - generation) * previousDifference + result;
        }
      } else {
        sameDifferenceCount = 0;
      }
      previousDifference = result - previousResult;
      previousResult = result;
    }
    return result;
  }

  public async part1(): Promise<string | number> {
    return this.run();
  }

  public async part2(): Promise<string | number> {
    this.generations = 50000000000;
    return this.run();
  }
}
