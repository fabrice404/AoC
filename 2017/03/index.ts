import { create2DArray, print2d } from '../../helpers/array';
import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    let x = 0;
    let y = 0;

    let minX = 0;
    let maxX = 0;
    let minY = 0;
    let maxY = 0;

    let direction = '>';
    let index = 1;
    while (index < +this.input) {
      switch (direction) {
        case '>':
          x += 1;
          if (x > maxX) {
            maxX = x;
            direction = '^';
          }
          break;
        case '<':
          x -= 1;
          if (x < minX) {
            minX = x;
            direction = 'v';
          }
          break;
        case '^':
          y -= 1;
          if (y < minY) {
            minY = y;
            direction = '<';
          }
          break;
        case 'v':
          y += 1;
          if (y > maxY) {
            maxY = y;
            direction = '>';
          }
          break;
      }
      index += 1;
    }
    return Math.abs(x) + Math.abs(y);
  }

  public async part2(): Promise<string | number> {
    let i = 1;
    const size = Math.round(Math.sqrt(+this.input));
    const grid = create2DArray(size, size, 0);
    let x = Math.floor(size / 2);
    let y = Math.floor(size / 2);
    grid[y][x] = i;
    let direction = '>';

    while (i < +this.input) {
      switch (direction) {
        case '>':
          x += 1;
          if (grid[y - 1]?.[x] === 0) {
            direction = '^';
          }
          break;
        case '<':
          x -= 1;
          if (grid[y + 1]?.[x] === 0) {
            direction = 'v';
          }
          break;
        case '^':
          y -= 1;
          if (grid[y]?.[x - 1] === 0) {
            direction = '<';
          }
          break;
        case 'v':
          y += 1;
          if (grid[y]?.[x + 1] === 0) {
            direction = '>';
          }
          break;
      }
      const value = (grid[y - 1]?.[x] || 0) +
        (grid[y + 1]?.[x] || 0) +
        (grid[y]?.[x - 1] || 0) +
        (grid[y]?.[x + 1] || 0) +
        (grid[y - 1]?.[x - 1] || 0) +
        (grid[y - 1]?.[x + 1] || 0) +
        (grid[y + 1]?.[x - 1] || 0) +
        (grid[y + 1]?.[x + 1] || 0);
      grid[y][x] = value;
      i = value;
    }
    return i;
  }
}
