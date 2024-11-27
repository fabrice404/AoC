import crypto from 'node:crypto';

import AoCPuzzle from '../../puzzle';

interface Hash {
  hash: string;
  index: number;
  letter: string;
  matchingIndex?: number;
}

export default class Puzzle extends AoCPuzzle {
  private hashes: Hash[] = [];

  private keys: number = 0;

  private find3ConsecutiveLetters(hash: string): string | null {
    for (let i = 0; i < hash.length - 2; i += 1) {
      if (
        hash[i] === hash[i + 1] &&
        hash[i] === hash[i + 2]
      ) {
        return hash[i];
      }
    }
    return null;
  }

  private find5ConsecutiveLetters(hash: string): string | null {
    for (let i = 0; i < hash.length - 4; i += 1) {
      if (
        hash[i] === hash[i + 1] &&
        hash[i] === hash[i + 2] &&
        hash[i] === hash[i + 3] &&
        hash[i] === hash[i + 4]
      ) {
        return hash[i];
      }
    }
    return null;
  }

  private run(strech: number = 0): number {
    let i = 0;
    let breakAt = Number.MAX_SAFE_INTEGER;
    this.hashes = [];

    while (i <= breakAt) {
      let hash = crypto.createHash('md5').update(`${this.input}${i}`).digest('hex');
      if (strech > 0) {
        for (let j = 0; j < strech; j += 1) {
          hash = crypto.createHash('md5').update(hash).digest('hex');
        }
      }

      let letter;

      letter = this.find3ConsecutiveLetters(hash);
      if (letter) {
        this.hashes.push({ hash, index: i, letter });
      }

      letter = this.find5ConsecutiveLetters(hash);
      if (letter) {
        this.hashes
          .filter((h) => h.letter === letter && h.index < i && h.index >= i - 1000)
          .forEach((h) => { h.matchingIndex = i; });

        const validHashes = this.hashes.filter((h) => h.matchingIndex);
        if (validHashes.length >= 64) {
          breakAt = i + 1000;
        }
      }
      i += 1;
    }

    const validHashes = this.hashes.filter((h) => h.matchingIndex)
      .sort((a, b) => (a.index > b.index ? 1 : -1));

    return validHashes[63].index;
  }

  public async part1(): Promise<string | number> {
    return this.run();
  }

  public async part2(): Promise<string | number> {
    return this.run(2016);
  }
}
