import { countItems } from '../../helpers/array';
import AoCPuzzle from '../../puzzle';

interface Coordinates {
  name: string;
  x: number;
  y: number;
}

export default class Puzzle extends AoCPuzzle {
  private coordinates: Coordinates[] = [];

  private grid: string[][] = [];

  private calculateDistance(x: number, y: number, coord: Coordinates): number {
    return Math.abs(coord.x - x) + Math.abs(coord.y - y);
  }

  private findClosestCoordinate(x: number, y: number): Coordinates | undefined {
    const distances = this.coordinates.map((coord) => {
      const distance = this.calculateDistance(x, y, coord);
      return { coord, distance };
    });

    distances.sort((a, b) => a.distance - b.distance);
    if (distances[0].distance === distances[1].distance) {
      return undefined;
    }
    return distances[0].coord;
  }

  public part1(): string | number {
    this.coordinates = this.lines.map((line, i) => {
      const [x, y] = line.split(', ').map((coord) => parseInt(coord, 10));
      return { name: i.toString(), x, y };
    });

    const maxX = Math.max(...this.coordinates.map((coord) => coord.x));
    const maxY = Math.max(...this.coordinates.map((coord) => coord.y));

    this.grid = Array(maxY + 2).fill(0).map(() => Array(maxX + 2).fill('.'));
    this.coordinates.forEach((coord) => {
      this.grid[coord.y][coord.x] = coord.name;
    });

    const excluded: string[] = ['.'];
    for (let y = 0; y < this.grid.length; y += 1) {
      for (let x = 0; x < this.grid[y].length; x += 1) {
        const closest = this.findClosestCoordinate(x, y);
        if (closest) {
          this.grid[y][x] = closest.name;
          if (x === 0 || y === 0 || x === this.grid[y].length - 1 || y === this.grid.length - 1) {
            excluded.push(closest.name);
          }
        }
      }
    }
    const flatGrid = excluded
      .reduce((acc, val) => acc.filter((n) => n !== val), this.grid.flat().sort());
    const count = countItems(flatGrid);
    return Array.from(count.values()).sort((a, b) => b - a)[0];
  }

  public part2(): string | number {
    let points: number = 0;
    for (let y = 0; y < this.grid.length; y += 1) {
      for (let x = 0; x < this.grid[y].length; x += 1) {
        const totalDistance = this.coordinates
          .reduce((acc, val) => acc + this.calculateDistance(x, y, val), 0);
        if (totalDistance < (this.coordinates.length === 6 ? 32 : 10000)) {
          points += 1;
        }
      }
    }
    return points;
  }
}
