import { combinations, sortNumeric, sum } from "../../helpers/array";
import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private smallestEntanglement(packages: number[], groupsCount: number): number {
    const totalWeight = sum(packages);
    const totalPackages = packages.length;

    const groupWeight = totalWeight / groupsCount;

    for (let size = 1; size <= totalPackages - groupsCount; size++) {
      const combos = combinations(packages, size);
      for (const combo of combos) {
        if (sum(combo) === groupWeight) {
          return combo.reduce((a, b) => a * b);
        }
      }
    }

    return -1;
  }

  public async part1(): Promise<string | number> {
    const packages = this.lines.map(Number).sort(sortNumeric);
    return this.smallestEntanglement(packages, 3);
  }

  public async part2(): Promise<string | number> {
    const packages = this.lines.map(Number).sort(sortNumeric);
    return this.smallestEntanglement(packages, 4);
  }
}
