import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    const width = this.isExample ? 7 : 50;
    const height = this.isExample ? 3 : 6;
    this.grid = Array.from({ length: height }, () => Array.from({ length: width }, () => '.'));

    for (const line of this.lines) {
      if (line.startsWith('rect')) {
        const [x, y] = line.split(' ')[1].split('x').map(Number);
        for (let i = 0; i < y; i += 1) {
          for (let j = 0; j < x; j += 1) {
            this.grid[i][j] = '#';
          }
        }
      } else if (line.startsWith('rotate column')) {
        const [x, y] = line.split('=')[1].split(' by ').map(Number);
        const column = this.grid.map((row) => row[x]);
        const newColumn = Array.from({ length: height }, (_, i) => column[(i - y + height) % height]);
        this.grid.forEach((row, i) => {
          row[x] = newColumn[i];
        });
      } else if (line.startsWith('rotate row')) {
        const [x, y] = line.split('=')[1].split(' by ').map(Number);
        const row = this.grid[x];
        const newRow = Array.from({ length: width }, (_, i) => row[(i - y + width) % width]);
        this.grid[x] = newRow;
      }
    }

    return this.grid.flat().filter((c) => c !== '.').length;
  }

  public async part2(): Promise<string | number> {
    console.log('');
    this.printGrid();
    return 'see above';
  }
}
