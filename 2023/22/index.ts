import { addUniqueItem, sum } from "../../helpers/array";
import AoCPuzzle from "../../puzzle";

interface Brick {
  name: string;
  xA: number;
  yA: number;
  zA: number;
  xB: number;
  yB: number;
  zB: number;
  height: number;
  supports: string[];
  supportedBy: string[];
}

export default class Puzzle extends AoCPuzzle {
  private bricks: Brick[] = [];

  private grid3d: string[][][] = []; // y, z, x

  private maxX: number = 0;

  private maxY: number = 0;

  private minX: number = 0;

  private minY: number = 0;

  private getLayer(i: number): void {
    const gridLayer = Array(this.maxY - this.minY + 1)
      .fill(".")
      .map(() => Array(this.maxX - this.minX + 1).fill("."));
    while (this.grid3d.length < i + 1) {
      this.grid3d.push([...gridLayer]);
    }
  }

  public async part1(): Promise<string | number> {
    this.lines.forEach((line, i) => {
      let [xA, yA, zA, xB, yB, zB] = line.split(/,|~/gi).map((x) => parseInt(x, 10));
      [xA, xB] = [xA, xB].sort((a, b) => (a > b ? 1 : -1));
      [yA, yB] = [yA, yB].sort((a, b) => (a > b ? 1 : -1));
      [zA, zB] = [zA, zB].sort((a, b) => (a > b ? 1 : -1));
      this.minX = Math.min(this.minX, xA, xB);
      this.maxX = Math.max(this.maxX, xA, xB);
      this.minY = Math.min(this.minY, zA, zB);
      this.maxY = Math.max(this.maxY, zA, zB);

      const height = Math.abs(zB - zA) + 1;

      const name = `brick${i}`;
      const brick: Brick = {
        name,
        xA,
        yA,
        zA,
        xB,
        yB,
        zB,
        height,
        supports: [],
        supportedBy: [],
      };
      this.bricks.push(brick);
    });
    this.getLayer(0);

    this.bricks
      .sort((a, b) => (a.zA > b.zA ? 1 : -1))
      .forEach((brick) => {
        let layerIndex = this.grid3d.length - 1;
        let hasBrickInLayer = false;

        while (!hasBrickInLayer && layerIndex >= 0) {
          for (let y = brick.yA; y <= brick.yB; y += 1) {
            for (let x = brick.xA; x <= brick.xB; x += 1) {
              const cell = this.grid3d[layerIndex][y][x];
              if (cell !== ".") {
                hasBrickInLayer = true;
                addUniqueItem(brick.supportedBy, cell);
                const supporter = this.bricks.find((b) => b.name === cell)!;
                addUniqueItem(supporter.supports, brick.name);
              }
            }
          }
          layerIndex += hasBrickInLayer ? 1 : -1;
          this.getLayer(layerIndex);
        }

        if (layerIndex < 0) {
          layerIndex = 0;
          this.getLayer(layerIndex);
        }

        for (let z = 0; z < brick.height; z += 1) {
          for (let y = brick.yA; y <= brick.yB; y += 1) {
            for (let x = brick.xA; x <= brick.xB; x += 1) {
              this.getLayer(layerIndex);
              this.grid3d[layerIndex][y][x] = brick.name;
            }
          }
          layerIndex += 1;
        }
      });

    const disintegratableBricks = this.bricks.filter((brick) =>
      brick.supports.every((supported) => this.bricks.some((b) => b.supports.includes(supported) && b.name !== brick.name)),
    );

    return disintegratableBricks.length;
  }

  public async part2(): Promise<string | number> {
    const result = this.bricks
      .sort((a, b) => (a.zA > b.zA ? 1 : -1))
      .map((b) => {
        const removed: string[] = [];
        const getSupportedBricks = (brickName: string): void => {
          removed.push(brickName);
          const brick = this.bricks.find((b2) => b2.name === brickName)!;

          brick.supports.forEach((supportedBrickName) => {
            const supportedBrick = this.bricks.find((b2) => b2.name === supportedBrickName)!;
            if (supportedBrick.supportedBy.every((b3) => removed.includes(b3))) {
              getSupportedBricks(supportedBrickName);
            }
          });
        };

        getSupportedBricks(b.name);
        return new Set(removed).size - 1;
      });
    return sum(result);
  }
}
