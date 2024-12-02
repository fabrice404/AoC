import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  private isValid = (n: number[]) => {
    let lastDiff = null;
    for (let i = 0; i < n.length - 1; i += 1) {
      const diff = n[i + 1] - n[i];
      if (Math.abs(diff) > 3 || Math.abs(diff) < 1) {
        return false;
      }
      if (lastDiff != null && lastDiff / Math.abs(lastDiff) !== diff / Math.abs(diff)) {
        return false;
      }
      lastDiff = diff;
    }

    return true;
  }

  public async part1(): Promise<string | number> {
    return this.lines.filter((line) => this.isValid(line.split(/\s/gi).map(Number))).length;
  }

  public async part2(): Promise<string | number> {
    return this.lines.filter((line) => {
      const n = line.split(/\s/gi).map(Number);
      if (this.isValid(n)) {
        return true;
      }
      for (let i = 0; i < n.length; i += 1) {
        if (this.isValid(n.filter((_, j) => j !== i))) {
          return true;
        }
      }
      return false;
    }).length;
  }
}
