import { sum } from '../../helpers/array';
import { memoize } from '../../helpers/memoize';
import AoCPuzzle from '../../puzzle';

const countPermutations = memoize((condition: string, damaged: number[]): number => {
  if (condition.length === 0) {
    return damaged.length === 0 ? 1 : 0;
  }
  if (damaged.length === 0) {
    return condition.split('').filter((x) => x === '#').length === 0 ? 1 : 0;
  }

  // list of springs is smaller than total amount of damaged ones + spaces
  if (condition.length < sum(damaged) + damaged.length - 1) {
    return 0;
  }

  const firstChar = condition[0];
  if (firstChar === '.') {
    return countPermutations(condition.slice(1), damaged);
  }
  if (firstChar === '#') {
    const [damagedFirstSeries, ...damagedRest] = damaged;
    for (let i = 0; i < damagedFirstSeries; i += 1) {
      if (condition[i] === '.') {
        return 0;
      }
    }
    if (condition[damagedFirstSeries] === '#') {
      return 0;
    }
    return countPermutations(condition.slice(damagedFirstSeries + 1), damagedRest);
  }

  return countPermutations(`.${condition.slice(1)}`, damaged)
    + countPermutations(`#${condition.slice(1)}`, damaged);
});

export default class Puzzle extends AoCPuzzle {
  private permutations: number = 0;

  public async part1(): Promise<string | number> {
    this.lines.forEach((line) => {
      const [condition, damaged] = line.split(/ /gi);
      this.permutations += countPermutations(condition, damaged.split(',').map((x) => +x));
    });
    return this.permutations;
  }

  public async part2(): Promise<string | number> {
    this.permutations = 0;
    this.lines.forEach((line) => {
      const [condition, damaged] = line.split(/ /gi);
      const unfoledCondition = Array(5).fill(condition).join('?');
      const unfoldedDamaged = Array(5).fill(damaged).join(',');
      this.permutations += countPermutations(unfoledCondition, unfoldedDamaged.split(',').map((x) => +x));
    });
    return this.permutations;
  }
}
