import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  private groups: Map<string, number>[] = [];

  public async part1(): Promise<string | number> {
    this.groups = new Array(this.lines[0].length).fill(0).map(() => new Map<string, number>());

    for (const line of this.lines) {
      for (let i = 0; i < line.length; i += 1) {
        const char = line[i];
        const group = this.groups[i];
        group.set(char, (group.get(char) || 0) + 1);
      }
    }

    return this.groups.map((group) => {
      let max = 0;
      let maxChar = '';
      group.forEach((count, char) => {
        if (count > max) {
          max = count;
          maxChar = char;
        }
      });
      return maxChar;
    }).join('');
  }

  public async part2(): Promise<string | number> {
    return this.groups.map((group) => {
      let min = Number.MAX_SAFE_INTEGER;
      let minChar = '';
      group.forEach((count, char) => {
        if (count < min) {
          min = count;
          minChar = char;
        }
      });
      return minChar;
    }).join('');
  }
}
