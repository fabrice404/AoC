import AoCPuzzle from '../../puzzle';

const TETROMINOES = [
  (y: number) => [[2, y], [3, y], [4, y], [5, y]],
  (y: number) => [[3, y], [2, y + 1], [3, y + 1], [4, y + 1], [3, y + 2]],
  (y: number) => [[2, y], [3, y], [4, y], [4, y + 1], [4, y + 2]],
  (y: number) => [[2, y], [2, y + 1], [2, y + 2], [2, y + 3]],
  (y: number) => [[2, y], [3, y], [2, y + 1], [3, y + 1]],
];

interface CacheItem {
  pieces: number;
  height: number;
}

export default class Puzzle extends AoCPuzzle {
  private jets: string[] = [];

  private cave: string[][] = [];

  private iterations = 2022;

  private cache: { [key: string]: CacheItem } = {};

  private run(): number {
    this.cache = {};
    this.jets = this.input.split('');

    let jetIndex = 0;
    let tetrominoIndex = 0;

    this.cave = [Array(7).fill('-')];

    const drop = (tetromino: number[][]): void => {
      while (true) {
        const jet = this.jets[jetIndex % this.jets.length];
        jetIndex += 1;
        const moveX = jet === '>' ? 1 : -1; // right = x+1, left = x-1
        const movedX = tetromino.map(([x, y]) => ([x + moveX, y]));

        if (movedX.every(([x, y]) => (
          (!this.cave[y] || !this.cave[y][x]) &&
          x >= 0 &&
          x < 7
        ))) {
          tetromino = movedX;
        }

        const moveY = -1; // always go down
        const movedY = tetromino.map(([x, y]) => ([x, y + moveY]));
        if (movedY.every(([x, y]) => (!this.cave[y] || !this.cave[y][x]))) {
          tetromino = movedY;
        } else {
          tetromino.forEach(([x, y]) => {
            this.cave[y] = this.cave[y] || Array(7);
            this.cave[y][x] = '#';
          });
          break;
        }
      }
    };

    let totalHeight = 0;
    for (let i = 0; i < this.iterations; i += 1) {
      drop(TETROMINOES[tetrominoIndex % TETROMINOES.length](this.cave.length + 3));
      tetrominoIndex += 1;
      if (totalHeight === 0 && i > this.jets.length * TETROMINOES.length) {
        const key = `${(tetrominoIndex % TETROMINOES.length)}-${(jetIndex % this.jets.length)}`;
        const value: CacheItem = { pieces: i, height: this.cave.length - 1 };
        if (this.cache[key]) {
          const pieces = value.pieces - this.cache[key].pieces;
          const height = value.height - this.cache[key].height;

          const cycles = Math.floor((this.iterations - value.pieces) / pieces);
          totalHeight = cycles * height;
          i += cycles * pieces;
        } else {
          this.cache[key] = value;
        }
      }
    }

    return this.cave.length - 1 + totalHeight;
  }

  public async part1(): Promise<string | number> {
    return this.run();
  }

  public async part2(): Promise<string | number> {
    this.iterations = 1000000000000;
    return this.run();
  }
}
