import AoCPuzzle from '../../puzzle';

class Cart {
  public x: number;

  public y: number;

  public direction: '^' | 'v' | '<' | '>';

  public turns: number = 0;

  public crashed: boolean = false;

  constructor(x: number, y: number, direction: '^' | 'v' | '<' | '>') {
    this.x = x;
    this.y = y;
    this.direction = direction;
  }

  public move(): void {
    switch (this.direction) {
      case '^': this.y -= 1; break;
      case 'v': this.y += 1; break;
      case '<': this.x -= 1; break;
      case '>': this.x += 1; break;
      default:
        throw new Error(`Unknown direction ${this.direction}`);
    }
  }

  public rotate(track: string): void {
    switch (track) {
      case '\\':
        switch (this.direction) {
          case '^': this.direction = '<'; break;
          case '>': this.direction = 'v'; break;
          case 'v': this.direction = '>'; break;
          case '<': this.direction = '^'; break;
          default: throw new Error(`Impossible direction for \\: ${this.direction}`);
        }
        break;
      case '/':
        switch (this.direction) {
          case '^': this.direction = '>'; break;
          case '>': this.direction = '^'; break;
          case 'v': this.direction = '<'; break;
          case '<': this.direction = 'v'; break;
          default: throw new Error(`Impossible direction for /: ${this.direction}`);
        }
        break;
      case '+':
        switch (this.turns % 3) {
          case 0:
            switch (this.direction) {
              case '^': this.direction = '<'; break;
              case '>': this.direction = '^'; break;
              case 'v': this.direction = '>'; break;
              case '<': this.direction = 'v'; break;
              default: throw new Error(`Impossible direction for +: ${this.direction}`);
            }
            break;
          case 1:
            // straight
            break;
          case 2:
            switch (this.direction) {
              case '^': this.direction = '>'; break;
              case '>': this.direction = 'v'; break;
              case 'v': this.direction = '<'; break;
              case '<': this.direction = '^'; break;
              default: throw new Error(`Impossible direction for +: ${this.direction}`);
            }
            break;
          default: throw new Error(`Impossible turn: ${this.turns}`);
        }
        this.turns += 1;
        break;
      default:
        break;
    }
  }
}

export default class Puzzle extends AoCPuzzle {
  private carts: Cart[] = [];

  private tracks: any = {};

  private crashes: { x: number; y: number; tick: number }[] = [];

  private maxX: number = 0;

  private maxY: number = 0;

  private ticks: number = 0;

  private sortCarts(): Cart[] {
    this.carts.sort((a, b) => a.y - b.y || a.x - b.x);
    return this.carts;
  }

  public async part1(): Promise<string | number> {
    this.carts = [];
    this.tracks = [];
    this.crashes = [];

    this.lines.forEach((line, y) => {
      line.split('').forEach((char, x) => {
        if (['^', 'v', '<', '>'].includes(char)) {
          this.carts.push(new Cart(x, y, char as '^' | 'v' | '<' | '>'));
        }
        if (['^', 'v'].includes(char)) {
          this.tracks[`${x},${y}`] = '|';
        } else if (['<', '>'].includes(char)) {
          this.tracks[`${x},${y}`] = '-';
        } else {
          this.tracks[`${x},${y}`] = char;
        }
        this.maxX = Math.max(this.maxX, x) + 1;
      });
      this.maxY = Math.max(this.maxY, y) + 1;
    });

    while (this.carts.filter((c) => !c.crashed).length > 1) {
      this.sortCarts();
      // console.log(this.ticks, this.carts.filter(c => !c.crashed));
      this.carts
        .filter((c) => !c.crashed)
        .forEach((cart) => {
          cart.move();
          cart.rotate(this.tracks[`${cart.x},${cart.y}`]);

          const collision = this.carts.find((c) => c !== cart
            && c.x === cart.x
            && c.y === cart.y
            && !c.crashed);
          if (collision) {
            cart.crashed = true;
            collision.crashed = true;
            this.crashes.push({ x: cart.x, y: cart.y, tick: this.ticks });
          }
        });
      this.ticks += 1;
    }
    return `${this.crashes[0].x},${this.crashes[0].y}`;
  }

  public async part2(): Promise<string | number> {
    this.part1(); // call part 1 to recalculate carts for example part 2
    const lastCart = this.carts.find((c) => !c.crashed);
    return `${lastCart!.x},${lastCart!.y}`;
  }
}
