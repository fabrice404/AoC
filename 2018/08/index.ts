import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  private numbers: number[] = [];

  public async part1(): Promise<string | number> {
    this.numbers = this.input.split(/ /gi).map((n) => parseInt(n, 10));

    const tree = [...this.numbers];
    const recurse = (): number => {
      const count = tree.shift()!;
      const meta = tree.shift()!;

      let result = 0;
      for (let i = 0; i < count; i += 1) {
        result += recurse();
      }

      for (let i = 0; i < meta; i += 1) {
        result += tree.shift()!;
      }

      return result;
    };

    return recurse();
  }

  public async part2(): Promise<string | number> {
    const tree = [...this.numbers];
    const recurse = (): number => {
      const count = tree.shift()!;
      const meta = tree.shift()!;

      let result = 0;
      if (count) {
        const subCount: number[] = [];
        for (let i = 0; i < count; i += 1) {
          subCount.push(recurse());
        }

        const subMeta = [];
        for (let i = 0; i < meta; i += 1) {
          subMeta.push(tree.shift()!);
        }

        subMeta.forEach((m) => {
          const i = m - 1;
          if (subCount[i]) {
            result += subCount[i];
          }
        });
      } else {
        for (let i = 0; i < meta; i += 1) {
          result += tree.shift()!;
        }
      }

      return result;
    };

    return recurse();
  }
}
