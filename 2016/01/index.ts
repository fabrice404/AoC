import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    let x = 0;
    let y = 0;

    let direction: 'N' | 'S' | 'W' | 'E' = 'N';

    const instructions = this.input.split(', ');
    for (const instruction of instructions) {
      const turn = instruction[0];
      const distance = parseInt(instruction.slice(1), 10);

      switch (direction) {
        case 'N':
          if (turn === 'R') {
            direction = 'E';
            x += distance;
          } else {
            direction = 'W';
            x -= distance;
          }
          break;
        case 'E':
          if (turn === 'R') {
            direction = 'S';
            y -= distance;
          } else {
            direction = 'N';
            y += distance;
          }
          break;
        case 'S':
          if (turn === 'R') {
            direction = 'W';
            x -= distance;
          } else {
            direction = 'E';
            x += distance;
          }
          break;
        case 'W':
          if (turn === 'R') {
            direction = 'N';
            y += distance;
          } else {
            direction = 'S';
            y -= distance;
          }
          break;
      }
    }

    return Math.abs(x) + Math.abs(y);
  }

  public async part2(): Promise<string | number> {
    let x = 0;
    let y = 0;

    const visitedLocations: string[] = ['0,0'];

    const isVisited = (a: number, b: number): boolean => {
      const key = `${a},${b}`;
      if (visitedLocations.includes(key)) {
        return true;
      }
      visitedLocations.push(key);
      return false;
    };

    const addToX = (n: number): boolean => {
      for (let i = 0; i < Math.abs(n); i += 1) {
        x += n > 0 ? 1 : -1;
        if (isVisited(x, y)) {
          return true;
        }
      }
      return false;
    };

    const addToY = (n: number): boolean => {
      for (let i = 0; i < Math.abs(n); i += 1) {
        y += n > 0 ? 1 : -1;
        if (isVisited(x, y)) {
          return true;
        }
      }
      return false;
    };

    let direction: 'N' | 'S' | 'W' | 'E' = 'N';
    const instructions = this.input.split(', ');
    for (const instruction of instructions) {
      const turn = instruction[0];
      const distance = parseInt(instruction.slice(1), 10);

      switch (direction) {
        case 'N':
          if (turn === 'R') {
            direction = 'E';
            if (addToX(distance)) {
              return Math.abs(x) + Math.abs(y);
            }
          } else {
            direction = 'W';
            if (addToX(-distance)) {
              return Math.abs(x) + Math.abs(y);
            }
          }
          break;
        case 'E':
          if (turn === 'R') {
            direction = 'S';
            if (addToY(-distance)) {
              return Math.abs(x) + Math.abs(y);
            }
          } else {
            direction = 'N';
            if (addToY(distance)) {
              return Math.abs(x) + Math.abs(y);
            }
          }
          break;
        case 'S':
          if (turn === 'R') {
            direction = 'W';
            if (addToX(-distance)) {
              return Math.abs(x) + Math.abs(y);
            }
          } else {
            direction = 'E';
            if (addToX(distance)) {
              return Math.abs(x) + Math.abs(y);
            }
          }
          break;
        case 'W':
          if (turn === 'R') {
            direction = 'N';
            if (addToY(distance)) {
              return Math.abs(x) + Math.abs(y);
            }
          } else {
            direction = 'S';
            if (addToY(-distance)) {
              return Math.abs(x) + Math.abs(y);
            }
          }
          break;
      }
    }

    return Math.abs(x) + Math.abs(y);
  }
}
