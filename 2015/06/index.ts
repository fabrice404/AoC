import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private ngrid: number[][] = [];

  public async part1(): Promise<string | number> {
    this.ngrid = new Array(1000).fill(0).map(() => new Array(1000).fill(0));

    for (const line of this.lines) {
      const [, action, x1, y1, x2, y2] = line.match(/(turn on|turn off|toggle) (\d+),(\d+) through (\d+),(\d+)/)!;
      for (let x = +x1; x <= +x2; x += 1) {
        for (let y = +y1; y <= +y2; y += 1) {
          switch (action) {
            case "turn on":
              this.ngrid[x][y] = 1;
              break;
            case "turn off":
              this.ngrid[x][y] = 0;
              break;
            case "toggle":
              this.ngrid[x][y] = this.ngrid[x][y] === 0 ? 1 : 0;
              break;
            default:
              break;
          }
        }
      }
    }
    return this.ngrid.flat().filter((x) => x === 1).length;
  }

  public async part2(): Promise<string | number> {
    this.ngrid = new Array(1000).fill(0).map(() => new Array(1000).fill(0));

    for (const line of this.lines) {
      const [, action, x1, y1, x2, y2] = line.match(/(turn on|turn off|toggle) (\d+),(\d+) through (\d+),(\d+)/)!;
      for (let x = +x1; x <= +x2; x += 1) {
        for (let y = +y1; y <= +y2; y += 1) {
          switch (action) {
            case "turn on":
              this.ngrid[x][y] += 1;
              break;
            case "turn off":
              this.ngrid[x][y] -= 1;
              if (this.ngrid[x][y] < 0) {
                this.ngrid[x][y] = 0;
              }
              break;
            case "toggle":
              this.ngrid[x][y] += 2;
              break;
            default:
              break;
          }
        }
      }
    }
    return this.ngrid.flat().reduce((acc, val) => acc + val, 0);
  }
}
