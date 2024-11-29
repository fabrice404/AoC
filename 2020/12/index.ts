import AoCPuzzle from '../../puzzle';

type Direction = 'N' | 'E' | 'S' | 'W';

export default class Puzzle extends AoCPuzzle {
  private direction: Direction = 'E';

  private x: number = 0;

  private y: number = 0;

  private waypointX: number = 10;

  private waypointY: number = 1;

  private turn(angle: number) {
    if (angle % 360 === 0) {
      return;
    }
    const directions: Direction[] = ['N', 'E', 'S', 'W'];
    const currentIndex = directions.indexOf(this.direction);
    let newIndex = currentIndex + (angle / 90);
    while (newIndex > this.direction.length - 1) { newIndex -= 4; }
    while (newIndex < 0) { newIndex += 4; }
    this.direction = directions[newIndex];

    const xdiff = this.waypointX - this.x;
    const ydiff = this.waypointY - this.y;
    switch (angle % 360) {
      case -270:
      case 90:
        this.waypointX = this.x + ydiff;
        this.waypointY = this.y - xdiff;
        break;

      case -180:
      case 180:
        this.waypointX = this.x - xdiff;
        this.waypointY = this.y - ydiff;
        break;

      case -90:
      case 270:
        this.waypointX = this.x - ydiff;
        this.waypointY = this.y + xdiff;
        break;
    }
  }

  public async part1(): Promise<string | number> {
    for (const line of this.lines) {
      const [action, ...valueArray] = line.split('');
      const value = +valueArray.join('');

      switch (action) {
        case 'N': this.y += value; break;
        case 'S': this.y -= value; break;
        case 'E': this.x += value; break;
        case 'W': this.x -= value; break;
        case 'F':
          switch (this.direction) {
            case 'N': this.y += value; break;
            case 'S': this.y -= value; break;
            case 'E': this.x += value; break;
            case 'W': this.x -= value; break;
          }
          break;
        case 'R': this.turn(+value); break;
        case 'L': this.turn(-value); break;
      }
    }

    return Math.abs(this.x) + Math.abs(this.y);
  }

  public async part2(): Promise<string | number> {
    this.direction = 'E' as Direction;
    this.x = 0;
    this.y = 0;
    this.waypointX = 10;
    this.waypointY = 1;

    for (const line of this.lines) {
      const [action, ...valueArray] = line.split('');
      const value = +valueArray.join('');

      switch (action) {
        case 'N': this.waypointY += value; break;
        case 'S': this.waypointY -= value; break;
        case 'E': this.waypointX += value; break;
        case 'W': this.waypointX -= value; break;
        case 'F':
          const xdiff = this.waypointX - this.x;
          const ydiff = this.waypointY - this.y;
          this.x += value * xdiff;
          this.y += value * ydiff;
          this.waypointX = this.x + xdiff;
          this.waypointY = this.y + ydiff;
          break;
        case 'R': this.turn(+value); break;
        case 'L': this.turn(-value); break;
      }
    }

    return Math.abs(this.x) + Math.abs(this.y);
  }
}
