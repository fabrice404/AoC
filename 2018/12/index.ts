import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  private generations: number = 20;

  private state: string = '';

  private run() {
    this.state = this.lines[0].split(': ')[1].trim();
    const rules = this.lines.slice(2).map((rule) => {
      const [condition, value] = rule.split(' => ');
      return { condition, value };
    });

    let offset = 0;
    let result = 0;
    let previousResult = 0;
    let previousDifference = 0;
    let sameDifferenceCount = 0;

    for (let generation = 0; generation < this.generations; generation += 1) {
      this.state = `....${this.state}....`;
      offset += 4;
      let nextState = this.state.replace(/#/g, '.');

      for (let i = 0; i < this.state.length - 4; i += 1) {
        rules.forEach((rule) => {
          if (this.state.substring(i, i + 5) === rule.condition) {
            nextState = nextState.substring(0, i + 2) + rule.value + nextState.substring(i + 3);
          }
        });
      }
      this.state = nextState;

      result = this.state.split('')
        .reduce((acc, val, i) => {
          const potNum = i - offset;
          if (val === '#') {
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
        previousDifference = result - previousResult;
      }
      previousResult = result;
    }
    return result;
  }

  public part1(): string | number {
    return this.run();
  }

  public part2(): string | number {
    this.generations = 5000000000;
    return this.run();
  }
}
