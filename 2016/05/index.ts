import crypto from 'node:crypto';

import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    let i = 0;
    const characters = [];
    while (characters.length < 8) {
      const hash = crypto.createHash('md5').update(`${this.input}${i}`).digest('hex');
      if (hash.substring(0, 5) === '00000') {
        characters.push(hash[5]);
      }
      i += 1;
    }
    return characters.join('');
  }

  public async part2(): Promise<string | number> {
    let i = 0;
    const characters = Array.from({ length: 8 });
    while (characters.join('').length < 8) {
      const hash = crypto.createHash('md5').update(`${this.input}${i}`).digest('hex');
      if (hash.substring(0, 5) === '00000') {
        const position = parseInt(hash[5], 10);
        const value = hash[6];
        if (position < 8 && !characters[position]) {
          characters[position] = value;
        }
      }
      i += 1;
    }
    return characters.join('');
  }
}
