import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    return this.lines.filter((line) => {
      const [a, b, c] = line.split(' ').filter(Boolean).map((n) => parseInt(n, 10)).sort((x: number, y: number) => (x > y ? 1 : -1));
      return a + b > c;
    }).length;
  }

  public async part2(): Promise<string | number> {
    const triangles: number[][] = [];
    for (let i = 0; i < this.lines.length - 2; i += 3) {
      const l1 = this.lines[i].split(' ').filter(Boolean).map((n) => parseInt(n, 10));
      const l2 = this.lines[i + 1].split(' ').filter(Boolean).map((n) => parseInt(n, 10));
      const l3 = this.lines[i + 2].split(' ').filter(Boolean).map((n) => parseInt(n, 10));

      for (let j = 0; j < 3; j += 1) {
        triangles.push([l1[j], l2[j], l3[j]]);
      }
    }
    return triangles.filter((triangle) => {
      const [a, b, c] = triangle.sort((x: number, y: number) => (x > y ? 1 : -1));
      return a + b > c;
    }).length;
  }
}
