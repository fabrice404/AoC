import AoCPuzzle from '../../puzzle';

interface Path {
  x: number;
  y: number;
  history: string[];
  finished: boolean;
  distance: number;
}

interface Point {
  x: number;
  y: number;
}

interface Distance {
  path: string[];
  distance: number;
}

export default class Puzzle extends AoCPuzzle {
  private paths: Path[] = [];

  private finishedPaths: Path[] = [];

  private intersections: Point[] = [];

  private visitedIntersections: Point[] = [];

  private getAt(x: number, y: number): string {
    return this.lines[y]?.[x];
  }

  private canMove(path: Path, direction: 'up' | 'down' | 'left' | 'right'): Path | undefined {
    let { x, y } = path;
    switch (direction) {
      case 'up': y -= 1; break;
      case 'down': y += 1; break;
      case 'left': x -= 1; break;
      case 'right': x += 1; break;
      default: throw new Error('Invalid direction');
    }

    if (x < 0 || x >= this.lines.length || y < 0 || y >= this.lines[0].length) {
      return;
    }

    const key = `${x},${y}`;
    // already visited
    if (path.history.includes(key)) {
      return;
    }

    // slopes
    if (
      (this.getAt(path.x, path.y) === '>' && direction !== 'right')
      || (this.getAt(path.x, path.y) === '<' && direction !== 'left')
      || (this.getAt(path.x, path.y) === '^' && direction !== 'up')
      || (this.getAt(path.x, path.y) === 'v' && direction !== 'down')
    ) {
      return;
    }

    // forests
    if (this.getAt(x, y) === '#') {
      return;
    }
    const finished = !!this.intersections.find((point) => point.x === x && point.y === y);
    const newPath: Path = { x, y, history: [...path.history, key], finished, distance: path.distance + 1 };
    return newPath;
  }

  private findPaths(startX: number, startY: number): Path[] {
    this.paths = [{ x: startX, y: startY, history: [`${startX},${startY}`], finished: false, distance: 0 }];
    this.finishedPaths = [];

    while (this.paths.filter((p) => !p.finished).length > 0) {
      const path = this.paths.pop()!;
      if (path.finished) {
        this.finishedPaths.push(path);
        continue;
      }
      const paths: Path[] = ['up', 'down', 'left', 'right']
        .map((d) => this.canMove(path, d as 'up' | 'down' | 'left' | 'right'))
        .filter((p) => p)
        .map((p) => p as Path);

      this.paths.push(...paths);
    }
    this.finishedPaths.push(...this.paths);
    const results = this.finishedPaths.sort((a, b) => (a.distance > b.distance ? -1 : 1));
    return results;
  }

  private isIntersection(x: number, y: number): boolean {
    let paths = 0;
    if (this.getAt(x, y) === '.') {
      if (this.getAt(x, y - 1) === '.') { paths += 1; }
      if (this.getAt(x, y + 1) === '.') { paths += 1; }
      if (this.getAt(x - 1, y) === '.') { paths += 1; }
      if (this.getAt(x + 1, y) === '.') { paths += 1; }
    }
    return paths > 2;
  }

  private findIntersections(): void {
    this.intersections = [];
    this.intersections.push({ x: this.lines[0].indexOf('.'), y: 0 });
    this.grid.forEach((line, y) => {
      line.forEach((cell, x) => {
        if (this.isIntersection(x, y)) {
          this.intersections.push({ x, y });
        }
      });
    });
    this.intersections.push({ x: this.lines[this.lines.length - 1].indexOf('.'), y: this.lines.length - 1 });
  }

  public part1(): string | number {
    const startX = this.lines[0].indexOf('.');
    const startY = 0;

    this.intersections = [];
    this.intersections.push({ x: this.lines[this.lines.length - 1].indexOf('.'), y: this.lines.length - 1 });

    return this.findPaths(startX, startY)[0].history.length - 1;
  }

  public part2(): string | number {
    this.setInput(this.input.replace(/\^|v|<|>/gi, '.'));
    this.findIntersections();

    const results: { [key: string]: { [key: string]: number } } = {};
    for (let i = 0; i < this.intersections.length - 1; i += 1) {
      const intersection = this.intersections[i];
      const paths = this.findPaths(intersection.x, intersection.y);
      paths.forEach((path) => {
        const from = `${intersection.x},${intersection.y}`;
        const to = `${path.x},${path.y}`;
        if (results[from] == null) {
          results[from] = {};
        }
        results[from][to] = path.distance;
      });
    }

    const distances: Distance[] = [];
    const calculateDistance = (from: string, distance: number, history: string[]): void => {
      // console.log(`from: ${from}`);
      if (results[from] != null) {
        Object.entries(results[from])
          .forEach((point) => {
            if (!history.includes(point[0])) {
              calculateDistance(point[0], distance + point[1], [...history, from]);
            }
          });
      } else {
        distances.push({ path: history, distance });
      }
    };

    calculateDistance(`${this.intersections[0].x},${this.intersections[0].y}`, 0, []);
    return distances.sort((a, b) => (a.distance > b.distance ? -1 : 1))[0].distance;
  }
}
