import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private furthestDistance: number = 0;

  private targetX: number = 0;

  private targetY: number = 0;

  public async part1(): Promise<string | number> {
    const input = this.input.split(",");

    const startX = Math.round((input.length * 3) / 2);
    const startY = Math.round((input.length * 3) / 2);

    this.targetX = +startX;
    this.targetY = +startY;

    for (const dir of input) {
      switch (dir) {
        case "n":
          this.targetY -= 2;
          break;
        case "s":
          this.targetY += 2;
          break;
        case "ne":
          this.targetX += 1;
          this.targetY -= 1;
          break;
        case "nw":
          this.targetX -= 1;
          this.targetY -= 1;
          break;
        case "se":
          this.targetX += 1;
          this.targetY += 1;
          break;
        case "sw":
          this.targetX -= 1;
          this.targetY += 1;
          break;
        default:
          throw new Error(`Unknown direction: ${dir}`);
      }
      this.furthestDistance = Math.max(this.furthestDistance, Math.abs(this.targetX - startX) / 2 + Math.abs(this.targetY - startY) / 2);
    }

    return Math.abs(this.targetX - startX) / 2 + Math.abs(this.targetY - startY) / 2;
  }

  public async part2(): Promise<string | number> {
    return this.furthestDistance;
  }
}
