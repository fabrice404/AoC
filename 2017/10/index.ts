/* eslint-disable no-bitwise */

import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  private list: number[] = [];

  public async part1(): Promise<string | number> {
    this.list = Array.from({ length: this.isExample ? 5 : 256 }, (_, i) => i);
    let position = 0;
    let skipSize = 0;

    for (const length of this.input.split(/,/gi).map(Number)) {
      for (let i = 0; i < length / 2; i += 1) {
        const a = (position + i) % this.list.length;
        const b = (position + length - i - 1) % this.list.length;
        const temp = this.list[a];
        this.list[a] = this.list[b];
        this.list[b] = temp;
      }

      position += length + skipSize;
      skipSize += 1;
    }
    return this.list.slice(0, 2).reduce((acc, val) => acc * val, 1);
  }

  private convertInputToAsciiCodes(input: string): number[] {
    return input.split('').map((char) => char.charCodeAt(0));
  }

  public async part2(): Promise<string | number> {
    this.list = Array.from({ length: 256 }, (_, i) => i);
    const input = [...this.convertInputToAsciiCodes(this.input), ...[17, 31, 73, 47, 23]];

    let position = 0;
    let skipSize = 0;

    for (let r = 0; r < 64; r += 1) {
      for (const length of input) {
        for (let i = 0; i < length / 2; i += 1) {
          const a = (position + i) % this.list.length;
          const b = (position + length - i - 1) % this.list.length;
          const temp = this.list[a];
          this.list[a] = this.list[b];
          this.list[b] = temp;
        }

        position += length + skipSize;
        skipSize += 1;
      }
    }
    const result: string[] = [];
    for (let i = 0; i < 16; i += 1) {
      const block = this.list.slice(i * 16, (i + 1) * 16);
      const xor = block.reduce((acc, val) => acc ^ val, 0);
      result.push(xor.toString(16).padStart(2, '0'));
    }

    return result.join('');
  }
}
