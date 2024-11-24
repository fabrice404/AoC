import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    let totalSize = 0;
    for (const line of this.lines) {
      const [x, y, z] = line.split(/x/gi).map(Number).sort((a, b) => a - b);
      totalSize += 2 * x * y +
        2 * x * z +
        2 * y * z +
        x * y;
    }
    return totalSize;
  }

  public async part2(): Promise<string | number> {
    let totalSize = 0;
    for (const line of this.lines) {
      const [x, y, z] = line.split(/x/gi).map(Number).sort((a, b) => a - b);
      totalSize += (x + x + y + y) + (x * y * z);
    }
    return totalSize;
  }
}
