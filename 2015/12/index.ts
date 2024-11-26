import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    return this.input.replace(/[^-0-9]/g, ' ')
      .split(' ').map(Number)
      .reduce((acc, val) => acc + val, 0);
  }

  private removeRed(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((o) => this.removeRed(o));
    }

    if (typeof obj === 'object') {
      if (Object.values(obj).includes('red')) {
        return {};
      }

      return Object.entries(obj).reduce((acc: any, [key, value]) => {
        acc[key] = this.removeRed(value);
        return acc;
      }, {});
    }

    return obj;
  }

  public async part2(): Promise<string | number> {
    return JSON.stringify(this.removeRed(JSON.parse(this.input))).replace(/[^-0-9]/g, ' ')
      .split(' ').map(Number)
      .reduce((acc, val) => acc + val, 0);
  }
}
