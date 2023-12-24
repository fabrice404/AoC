import { addUniqueItem } from '../../helpers/array';
import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  private fabric: string[][] = [];

  private touched: number[] = [];

  public async part1(): Promise<string | number> {
    this.lines = this.input.split(/\n/gi);
    this.lines.forEach((line, id) => {
      const [, , x, y, w, h] = line
        .split(/[#@,:x]/gi)
        .map((part) => parseInt(part.trim(), 10));

      for (let j = 0; j < y + h; j += 1) {
        this.fabric[j] = this.fabric[j] || [];
        for (let i = 0; i < x + w; i += 1) {
          this.fabric[j][i] = this.fabric[j][i] || '.';
          if (i >= x && i < x + w && j >= y && j < y + h) {
            if (this.fabric[j][i] === '.') {
              this.fabric[j][i] = `${id + 1}`;
            } else {
              addUniqueItem(this.touched, parseInt(this.fabric[j][i], 10));
              addUniqueItem(this.touched, id + 1);
              this.fabric[j][i] = 'X';
            }
          }
        }
      }
    });
    return this.fabric.reduce(
      (sum, row) => sum + row.filter((cell) => cell === 'X').length,
      0,
    );
  }

  public async part2(): Promise<string | number> {
    for (let i = 0; i < this.lines.length; i += 1) {
      if (!this.touched.includes(i + 1)) {
        return i + 1;
      }
    }
    return -1;
  }
}
