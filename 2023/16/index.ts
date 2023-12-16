import { sum } from '../../helpers/array';
import AoCPuzzle from '../../puzzle';

interface Beam {
  x: number;
  y: number;
  active: boolean;
  direction: '^' | 'v' | '<' | '>';
}

const run = (initialBeam: Beam, grid: string[][]): number => {
  const beams: Beam[] = [initialBeam];

  const alreadyVisited: Beam[] = [];

  const move = (beam: Beam): void => {
    if (!beam.active) {
      return;
    }
    switch (beam.direction) {
      case '^': beam.y -= 1; break;
      case 'v': beam.y += 1; break;
      case '<': beam.x -= 1; break;
      case '>': beam.x += 1; break;
      default: throw new Error(`Unknown direction ${beam.direction}`);
    }
    if (beam.x < 0 || beam.y < 0 || beam.x >= grid[0].length || beam.y >= grid.length) {
      beam.active = false;
    }
  };

  const interact = (beam: Beam): void => {
    if (!beam.active) {
      return;
    }
    const tile = grid[beam.y][beam.x];
    switch (tile) {
      case '\\':
        switch (beam.direction) {
          case '^': beam.direction = '<'; break;
          case '>': beam.direction = 'v'; break;
          case 'v': beam.direction = '>'; break;
          case '<': beam.direction = '^'; break;
          default: throw new Error(`Impossible direction for \\: ${beam.direction}`);
        }
        break;
      case '/':
        switch (beam.direction) {
          case '^': beam.direction = '>'; break;
          case '>': beam.direction = '^'; break;
          case 'v': beam.direction = '<'; break;
          case '<': beam.direction = 'v'; break;
          default: throw new Error(`Impossible direction for /: ${beam.direction}`);
        }
        break;
      case '|':
        switch (beam.direction) {
          case '^': break;
          case '>': beam.direction = '^'; beams.push({ x: beam.x, y: beam.y, active: true, direction: 'v' }); break;
          case 'v': break;
          case '<': beam.direction = '^'; beams.push({ x: beam.x, y: beam.y, active: true, direction: 'v' }); break;
          default: throw new Error(`Impossible direction for |: ${beam.direction}`);
        }
        break;
      case '-':
        switch (beam.direction) {
          case '^': beam.direction = '>'; beams.push({ x: beam.x, y: beam.y, active: true, direction: '<' }); break;
          case '>': break;
          case 'v': beam.direction = '>'; beams.push({ x: beam.x, y: beam.y, active: true, direction: '<' }); break;
          case '<': break;
          default: throw new Error(`Impossible direction for |: ${beam.direction}`);
        }
        break;
      case '.':
        switch (beam.direction) {
          case '^': break;
          case '>': break;
          case 'v': break;
          case '<': break;
          default: throw new Error(`Impossible direction for |: ${beam.direction}`);
        }
        break;
      default: throw new Error(`Unknown tile ${tile}`); break;
    }
  };
  const tiles: string[][] = [...grid.map((row) => [...row])];
  tiles[initialBeam.y][initialBeam.x] = '#';

  while (beams.find((b) => b.active)) {
    beams.filter((b) => b.active)
      .forEach((beam) => {
        interact(beam);
        move(beam);
        if (alreadyVisited.find((b) => b.x === beam.x
          && b.y === beam.y
          && b.direction === beam.direction)
        ) {
          beam.active = false;
        } else {
          alreadyVisited.push({ ...beam });
          if (beam.active) {
            tiles[beam.y][beam.x] = '#';
          }
        }
      });
  }

  return sum(tiles.map((row) => row.filter((tile) => tile === '#').length));
};

export default class Puzzle extends AoCPuzzle {
  public part1(): string | number {
    const initialBeam: Beam = { x: 0, y: 0, active: true, direction: '>' };
    return run(initialBeam, this.grid);
  }

  public part2(): string | number {
    const results = [];
    for (let y = 0; y < this.grid.length; y += 1) {
      results.push(run({ x: 0, y, active: true, direction: '>' }, this.grid));
      results.push(run({ x: this.grid[0].length - 1, y, active: true, direction: '<' }, this.grid));
    }
    for (let x = 0; x < this.grid[0].length; x += 1) {
      results.push(run({ x, y: 0, active: true, direction: 'v' }, this.grid));
      results.push(run({ x, y: this.grid.length - 1, active: true, direction: '^' }, this.grid));
    }

    return Math.max(...results);
  }
}
