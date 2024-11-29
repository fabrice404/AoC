import AoCPuzzle from '../../puzzle';

interface Cell {
  type: 'wall' | 'open' | 'unit';
  unit: Unit | null;
}

interface Unit {
  id: number;
  type: Type;
  hp: number;
  round: number;
}

type Type = 'elf' | 'goblin';

interface Coordinates {
  x: number;
  y: number;
}

interface CalculateShortestDistanceParams {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  steps: Coordinates[];
}

interface Highlight {
  x: number;
  y: number;
  color: number;
}

export default class Puzzle extends AoCPuzzle {
  private playgrid: Cell[][] = [];

  private currentRound: number = 0;

  private hasElves(): boolean {
    return this.playgrid.flat().some((cell) => cell.type === 'unit' && cell.unit?.type === 'elf');
  }

  private hasGoblins(): boolean {
    return this.playgrid.flat().some((cell) => cell.type === 'unit' && cell.unit?.type === 'goblin');
  }

  private isFreeCell({ x, y }: Coordinates): boolean {
    return this.playgrid[y][x].type === 'open';
  }

  private checkEnemyInRange(x: number, y: number, enemyType: Type): Coordinates | null {
    const around = [[x, y - 1], [x - 1, y], [x + 1, y], [x, y + 1]];

    let result = null;
    let minHP = 300;
    for (const [xE, yE] of around) {
      if (this.playgrid[yE][xE].type === 'unit' &&
        this.playgrid[yE][xE].unit?.type === enemyType) {
        const enemy = this.playgrid[yE][xE].unit!;
        if (enemy.hp < minHP) {
          minHP = enemy.hp;
          result = { x: xE, y: yE };
        }
      }
    }
    return result;
  }

  private shortestDistance: number = Number.MAX_SAFE_INTEGER;

  private shortestPath: Coordinates[] = [];

  private calculateShortestDistance(fromX: number, fromY: number, toX: number, toY: number, steps: Coordinates[] = []): CalculateShortestDistanceParams[] {
    if (fromX === toX && fromY === toY) {
      if (steps.length < this.shortestDistance) {
        this.shortestPath = steps;
        this.shortestDistance = steps.length;
      }
      return [];
    }
    if (steps.length >= this.shortestDistance || steps.length >= this.playgrid.flat().length) {
      return [];
    }

    return [[fromX, fromY - 1], [fromX - 1, fromY], [fromX + 1, fromY], [fromX, fromY + 1]]
      .map(([x, y]) => {
        if (this.isFreeCell({ x, y }) && !steps.some((s) => s.x === x && s.y === y)) {
          return ({ fromX: x, fromY: y, toX, toY, steps: [...steps, { x, y }] });
        }
        return null;
      })
      .filter(Boolean) as CalculateShortestDistanceParams[];
  }

  private moveToClosestEnemy(x: number, y: number, enemyType: Type): Coordinates | null {
    const enemies = this.playgrid.flat().filter((cell) => cell.type === 'unit' && cell.unit?.type === enemyType);
    if (enemies.length === 0) {
      return null;
    }

    const potentialCoordinates: number[][] = [];
    for (let yA = 0; yA < this.playgrid.length; yA += 1) {
      for (let xA = 0; xA < this.playgrid[yA].length; xA += 1) {
        if (this.playgrid[yA][xA].type === 'unit' && this.playgrid[yA][xA].unit?.type === enemyType) {
          [[xA, yA - 1], [xA - 1, yA], [xA + 1, yA], [xA, yA + 1]]
            .forEach(([xE, yE]) => {
              if (this.isFreeCell({ x: xE, y: yE })) {
                potentialCoordinates.push([xE, yE]);
              }
            });
        }
      }
    }

    let minDistance = Number.MAX_SAFE_INTEGER;
    let minPath: Coordinates[] = [];
    let coordinates: Coordinates | null = null;
    for (const p of potentialCoordinates) {
      this.shortestDistance = Number.MAX_SAFE_INTEGER;
      const queue: CalculateShortestDistanceParams[] = [{ fromX: x, fromY: y, toX: p[0], toY: p[1], steps: [{ x, y }] }];
      while (queue.length) {
        // console.log(queue.length);
        const next = queue.shift()!;
        const result = this.calculateShortestDistance(next.fromX, next.fromY, next.toX, next.toY, next.steps);
        if (result) {
          queue.push(...result);
        }
      }
      const distance = this.shortestDistance;
      if (distance < minDistance) {
        minDistance = distance;
        minPath = this.shortestPath;
        [, coordinates] = this.shortestPath;
      }
    }
    if (minPath.length) {
      this.print([
        ...minPath.slice(0, -1).map((s) => ({ x: s.x, y: s.y, color: 42 })),
        ...minPath.slice(-1).map((s) => ({ x: s.x, y: s.y, color: 43 })),
      ]);
    }

    if (coordinates) {
      if (coordinates.y < y) {
        this.print([{ x: coordinates.x, y: coordinates.y, color: 44 }, { x, y: y - 1, color: 42 }]);
        this.playgrid[y - 1][x] = this.playgrid[y][x]; this.playgrid[y][x] = { type: 'open', unit: null };
        return { x, y: y - 1 };
      }
      if (coordinates.x < x) {
        this.print([{ x: coordinates.x, y: coordinates.y, color: 44 }, { x: x - 1, y, color: 42 }]);
        this.playgrid[y][x - 1] = this.playgrid[y][x]; this.playgrid[y][x] = { type: 'open', unit: null };
        return { x: x - 1, y };
      }
      if (coordinates.x > x) {
        this.print([{ x: coordinates.x, y: coordinates.y, color: 44 }, { x: x + 1, y, color: 42 }]);
        this.playgrid[y][x + 1] = this.playgrid[y][x]; this.playgrid[y][x] = { type: 'open', unit: null };
        return { x: x + 1, y };
      }
      if (coordinates.y > y) {
        this.print([{ x: coordinates.x, y: coordinates.y, color: 44 }, { x, y: y + 1, color: 42 }]);
        this.playgrid[y + 1][x] = this.playgrid[y][x]; this.playgrid[y][x] = { type: 'open', unit: null };
        return { x, y: y + 1 };
      }
    }
    return null;
  }

  private attackEnemy(x: number, y: number, enemy: Coordinates): void {
    const enemyUnit = this.playgrid[enemy.y][enemy.x].unit!;
    enemyUnit.hp -= 3;
    if (enemyUnit.hp <= 0) {
      this.playgrid[enemy.y][enemy.x] = { type: 'open', unit: null };
    }
    this.print([{ x, y, color: 44 }, { x: enemy.x, y: enemy.y, color: 41 }]);
  }

  private takeTurn(x: number, y: number, enemyType: Type): void {
    if (this.playgrid[y][x].unit!.round < this.currentRound) {
      this.playgrid[y][x].unit!.round = this.currentRound;

      const enemies = this.playgrid.flat().filter((cell) => cell.type === 'unit' && cell.unit?.type === enemyType);
      if (enemies.length === 0) {
        return;
      }

      let enemy = this.checkEnemyInRange(x, y, enemyType);

      if (!enemy) {
        const newCoordinates = this.moveToClosestEnemy(x, y, enemyType);
        if (newCoordinates) {
          x = newCoordinates.x;
          y = newCoordinates.y;
        }
        enemy = this.checkEnemyInRange(x, y, enemyType);
      }

      if (enemy) {
        this.attackEnemy(x, y, enemy);
      }
    }
  }

  private print(highlights: Highlight[] = []): void {
    if (!this.isExample) {
      return;
    }
    console.log(
      this.playgrid
        .map((row, y) => {
          const line = row
            .map((cell, x) => {
              let output = '';
              switch (cell.type) {
                case 'wall': output = '#'; break;
                case 'open': output = '.'; break;
                case 'unit': output = cell.unit?.type === 'elf' ? 'E' : 'G'; break;
                default: output = '?'; break;
              }
              const highlight = highlights.find((h) => h.x === x && h.y === y);
              if (highlight) {
                output = `\x1b[${highlight.color}m${output}\x1b[0m`;
              }
              return output;
            })
            .join('');

          return `${line}   ${row.filter((cell) => cell.type === 'unit').map((cell) => `${cell.unit?.type === 'elf' ? 'E' : 'G'}(${cell.unit?.hp})`).join(', ')}`;
        })
        .join('\n'),
    );
  }

  private play(grid: string) {
    let unitId = 1;
    this.playgrid = grid.split('\n').map((line) => line.split('').map((char) => {
      switch (char) {
        case '#': return { type: 'wall' } as Cell;
        case 'E': return { type: 'unit', unit: { id: unitId++, type: 'elf', hp: 200, round: -1 } } as Cell; // eslint-disable-line no-plusplus
        case 'G': return { type: 'unit', unit: { id: unitId++, type: 'goblin', hp: 200, round: -1 } } as Cell; // eslint-disable-line no-plusplus
        default: return { type: 'open' } as Cell;
      }
    }));

    this.currentRound = 0;
    this.print();
    do {
      this.currentRound += 1;
      console.log(`\n===============\nRound ${this.currentRound}`);
      for (let y = 0; y < this.playgrid.length; y += 1) {
        for (let x = 0; x < this.playgrid[y].length; x += 1) {
          const cell = this.playgrid[y][x];
          if (cell.type === 'unit') {
            this.takeTurn(x, y, cell.unit!.type === 'elf' ? 'goblin' : 'elf');
          }
        }
      }
      console.log(`\nAfter ${this.currentRound} rounds:`);
      this.print();
    } while (this.hasElves() && this.hasGoblins());

    const totalHP = this.playgrid.flat().filter((cell) => cell.type === 'unit').reduce((acc, cell) => acc + cell.unit!.hp, 0);
    // console.log(this.currentRound, totalHP);

    return totalHP * this.currentRound;
  }

  public async part1(): Promise<string | number> {
    return this.input.split('\n\n').map((grid) => this.play(grid)).join(',');
  }

  public async part2(): Promise<string | number> {
    return '<NOT YET IMPLEMENTED>';
  }
}
