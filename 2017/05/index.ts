import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  private debug(list: any[], i: number) {
    if (this.isExample) {
      list[i] = `(${list[i]})`;
      console.log(list.join(', '));
    }
  }

  public async part1(): Promise<string | number> {
    const list = this.lines.map((line) => parseInt(line, 10));
    let steps = 0;
    let i = 0;
    this.debug([...list], i);
    while (i >= 0 && i < list.length) {
      const val = list[i];
      list[i] += 1;
      i += val;
      steps += 1;
      this.debug([...list], i);
    }
    return steps;
  }

  public async part2(): Promise<string | number> {
    const list = this.lines.map((line) => parseInt(line, 10));
    let steps = 0;
    let i = 0;
    this.debug([...list], i);
    while (i >= 0 && i < list.length) {
      const val = list[i];
      list[i] += val >= 3 ? -1 : 1;
      i += val;
      steps += 1;
      this.debug([...list], i);
    }
    return steps;
  }
}
