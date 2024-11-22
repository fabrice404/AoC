import crypto from 'node:crypto';

import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    let i = 1;
    while (i > 0) {
      const hash = crypto.createHash('md5').update(`${this.input}${i}`).digest('hex');
      if (hash.substring(0, 5) === '00000') {
        return i;
      }
      i += 1;
    }
    return 0;
  }

  public async part2(): Promise<string | number> {
    let i = 1;
    while (i > 0) {
      const hash = crypto.createHash('md5').update(`${this.input}${i}`).digest('hex');
      if (hash.substring(0, 6) === '000000') {
        return i;
      }
      i += 1;
    }
    return 0;
  }
}
