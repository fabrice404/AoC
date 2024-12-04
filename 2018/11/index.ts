import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private serialNumber: number = 0;

  private gridN: number[][] = [];

  private findPowerLevel(x: number, y: number): number {
    const rackId = x + 10;
    let powerLevel = rackId * y;
    powerLevel += this.serialNumber;
    powerLevel *= rackId;
    powerLevel = Math.floor(powerLevel / 100) % 10;
    powerLevel -= 5;
    return powerLevel;
  }

  public async part1(): Promise<string | number> {
    this.serialNumber = Number(this.input.trim());

    this.gridN = Array(300)
      .fill(0)
      .map(() => Array(300).fill(0));
    this.gridN = this.gridN.map((row, y) => row.map((_, x) => this.findPowerLevel(x + 1, y + 1)));

    let maxPower = -Infinity;
    let maxPowerX = 0;
    let maxPowerY = 0;
    for (let y = 0; y < 297; y += 1) {
      for (let x = 0; x < 297; x += 1) {
        let power = 0;
        for (let dy = 0; dy < 3; dy += 1) {
          for (let dx = 0; dx < 3; dx += 1) {
            power += this.gridN[y + dy][x + dx];
          }
        }
        if (power > maxPower) {
          maxPower = power;
          maxPowerX = x + 1;
          maxPowerY = y + 1;
        }
      }
    }
    return `${maxPowerX},${maxPowerY}`;
  }

  public async part2(): Promise<string | number> {
    let maxPower = -Infinity;
    let maxPowerX = 0;
    let maxPowerY = 0;
    let maxSize = 0;
    for (let y = 0; y < 297; y += 1) {
      for (let x = 0; x < 297; x += 1) {
        for (let size = 1; size <= 300 - Math.max(x, y); size += 1) {
          let power = 0;
          for (let dy = 0; dy < size; dy += 1) {
            for (let dx = 0; dx < size; dx += 1) {
              power += this.gridN[y + dy][x + dx];
            }
          }
          if (power > maxPower) {
            maxPower = power;
            maxPowerX = x + 1;
            maxPowerY = y + 1;
            maxSize = size;
          }
        }
      }
    }
    return `${maxPowerX},${maxPowerY},${maxSize}`;
  }
}
