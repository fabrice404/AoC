import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  private countOccupiedSeatsAround(x: number, y: number): number {
    return [
      [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
      [x - 1, y], [x + 1, y],
      [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
    ].filter(([xS, yS]) => this.grid[yS] && this.grid[yS][xS] === '#').length;
  }

  private countOccupiedSeatsInDirection(xOrigin: number, yOrigin: number): number {
    let count = 0;
    let x = xOrigin;
    let y = yOrigin;

    const fns = [
      () => { y -= 1; }, // N
      () => { y -= 1; x -= 1; }, // NW
      () => { x -= 1; }, // W
      () => { y += 1; x -= 1; }, // SW
      () => { y += 1; }, // S
      () => { y += 1; x += 1; }, // SE
      () => { x += 1; }, // E
      () => { y -= 1; x += 1; }, // NE
    ];

    for (const fn of fns) {
      x = xOrigin;
      y = yOrigin;
      while (
        y > 0 && y < this.grid.length - 1 &&
        x > 0 && x < this.grid[y].length - 1
      ) {
        fn();
        if (this.grid[y][x] === '#') {
          count += 1;
          break;
        } else if (this.grid[y][x] === 'L') {
          break;
        }
      }
    }
    return count;
  }

  private addWallsToGrid() {
    const width = this.grid[0].length;
    const horizontal = ['+', ...Array.from({ length: width }, () => '-'), '+'];
    this.grid = [horizontal, ...this.grid.map((row) => ['|', ...row, '|']), horizontal];
  }

  private run(part: 1 | 2): number {
    this.addWallsToGrid();

    let hasMoved = true;
    while (hasMoved) {
      hasMoved = false;
      const futureGrid = [...this.grid.map((row) => [...row])];
      for (let y = 0; y < this.grid.length; y += 1) {
        for (let x = 0; x < this.grid[y].length; x += 1) {
          const seat = this.grid[y][x];

          // free seat
          if (seat === 'L' &&
            (
              (part === 1 && this.countOccupiedSeatsAround(x, y) === 0) ||
              (part === 2 && this.countOccupiedSeatsInDirection(x, y) === 0)
            )
          ) {
            futureGrid[y][x] = '#';
            hasMoved = true;
          }

          // occupied seat
          if (seat === '#' &&
            (
              (part === 1 && this.countOccupiedSeatsAround(x, y) >= 4) ||
              (part === 2 && this.countOccupiedSeatsInDirection(x, y) >= 5)
            )
          ) {
            futureGrid[y][x] = 'L';
            hasMoved = true;
          }
        }
      }
      if (hasMoved) {
        this.grid = futureGrid;
        if (this.isExample) {
          this.printGrid();
        }
      }
    }

    return this.grid.flat().filter((seat) => seat === '#').length;
  }

  public async part1(): Promise<string | number> {
    return this.run(1);
  }

  public async part2(): Promise<string | number> {
    this.setInput(this.input);
    return this.run(2);
  }
}
