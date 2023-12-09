import { print2d } from '../../helpers/array';
import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  private elaspedTime: number = 0;

  private skippedTime: number = 0;

  public part1(): string | number {
    let minX = 0;
    let maxX = 0;
    let minY = 0;
    let maxY = 0;
    const points: any[] = this.lines.map((line) => {
      const data = line.match(/position=<\s*(-?\d+),\s*(-?\d+)> velocity=<\s*(-?\d+),\s*(-?\d+)>/)!.slice(1).map((n) => parseInt(n, 10));
      let [posX, posY] = data;
      const [, , velX, velY] = data;
      if (this.lines.length > 100) {
        // skip first 10000 iterations
        this.skippedTime = 10000;
        posX += velX * this.skippedTime;
        posY += velY * this.skippedTime;
      }
      minX = Math.min(minX, posX);
      maxX = Math.max(maxX, posX);
      minY = Math.min(minY, posY);
      maxY = Math.max(maxY, posY);
      return {
        posX, posY, velX, velY,
      };
    });

    let grid: string[][];

    const xOffset = Math.abs(minX);
    const yOffset = Math.abs(minY);
    let currentArea = (xOffset + maxX) * (yOffset + maxY);
    let previousArea = currentArea + 1;

    while (currentArea < previousArea) {
      let smallerX = Infinity;
      let biggerX = -Infinity;
      let smallerY = Infinity;
      let biggerY = -Infinity;
      grid = new Array(yOffset + maxY + 1).fill(0).map(() => new Array(xOffset + maxX + 1).fill(' '));
      points.forEach((point) => {
        if (point.posX + xOffset > 0
          && point.posX + xOffset < grid[0].length
          && point.posY + yOffset > 0
          && point.posY + yOffset < grid.length
        ) {
          grid[point.posY + yOffset][point.posX + xOffset] = '#';
        }
        point.posX += point.velX;
        point.posY += point.velY;
        smallerX = Math.min(smallerX, point.posX);
        biggerX = Math.max(biggerX, point.posX);
        smallerY = Math.min(smallerY, point.posY);
        biggerY = Math.max(biggerY, point.posY);
      });
      previousArea = currentArea;
      currentArea = (biggerX - smallerX) * (biggerY - smallerY);
      this.elaspedTime += 1;
    }

    let firstNonEmptyColumn = 0;
    while (grid!.every((row) => row[firstNonEmptyColumn] === ' ')) {
      firstNonEmptyColumn += 1;
    }
    grid = grid!.filter((row) => row.some((cell) => cell === '#')).map((row) => row.join('').trimEnd().split('').slice(firstNonEmptyColumn));
    console.log(`${this.elaspedTime - 1} seconds elapsed\n`);
    print2d(grid);
    console.log('');

    return '';
  }

  public part2(): string | number {
    return this.elaspedTime - 1 + this.skippedTime;
  }
}
