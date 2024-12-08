import { getUpRightLeftDownCoordinates } from "../../helpers/array";
import { DIRECTIONS } from "../../helpers/helpers";
import { between, binaryToDecimal } from "../../helpers/numbers";
import AoCPuzzle from "../../puzzle";
import { Direction, Point } from "../../types";

type Layer = any[][];

type Layers = { [key: string]: Layer };

export default class Puzzle extends AoCPuzzle {
  private biodiversityRatings: Set<number> = new Set();

  private getBugs(direction: Direction, layer: Layer, layers: Layers, level: number, { x, y }: Point): number {
    const loop5 = Array.from({ length: 5 }, (_, i) => i);

    if ((direction === "U" && y === 0) || (direction === "R" && x === 4) || (direction === "D" && y === 4) || (direction === "L" && x === 0)) {
      const upperLayer = layers[`${level + 1}`];
      if (!upperLayer) {
        return 0;
      }
      return {
        U: upperLayer[1][2],
        R: upperLayer[2][3],
        D: upperLayer[3][2],
        L: upperLayer[2][1],
      }[direction] === "#"
        ? 1
        : 0;
    }

    if (
      (direction === "U" && x === 2 && y === 3) ||
      (direction === "R" && x === 1 && y === 2) ||
      (direction === "D" && x === 2 && y === 1) ||
      (direction === "L" && x === 3 && y === 2)
    ) {
      const lowerLayer = layers[`${level - 1}`];
      if (!lowerLayer) {
        return 0;
      }

      return {
        U: loop5.map((i) => lowerLayer[4][i]),
        R: loop5.map((i) => lowerLayer[i][0]),
        D: loop5.map((i) => lowerLayer[0][i]),
        L: loop5.map((i) => lowerLayer[i][4]),
      }[direction].filter((cell) => cell === "#").length;
    }

    const neighbor = getUpRightLeftDownCoordinates({ x, y })[DIRECTIONS.indexOf(direction)];
    return layer[neighbor.y][neighbor.x] === "#" ? 1 : 0;
  }

  private printLayers(layers: Layers, minute: number): void {
    console.log(`Minute ${minute}`);
    const keys = Object.keys(layers).sort((a, b) => (+a > +b ? 1 : -1));

    for (const key of keys) {
      console.log(`\t\tLayer ${key}`);
      console.log(layers[key].map((row) => "\t\t\t" + row.join("")).join("\n"));
    }
  }

  public async part1(): Promise<string | number> {
    while (true) {
      const newGrid = this.cloneGrid();

      this.getGridLoopXY().forEach(({ x, y }) => {
        const current = this.grid[y][x];
        const neighbors = getUpRightLeftDownCoordinates({ x, y });
        const bugsAround = neighbors.filter((n) => this.isInGrid(n) && this.grid[n.y][n.x] === "#").length;

        if (current === "#" && bugsAround !== 1) {
          newGrid[y][x] = ".";
        } else if (between(bugsAround, 1, 2)) {
          newGrid[y][x] = "#";
        }
      });

      this.grid = [...newGrid];

      const biodiversityRating = binaryToDecimal(
        this.grid
          .flat()
          .map((c) => (c === "#" ? "1" : "0"))
          .reverse()
          .join(""),
      );

      if (this.biodiversityRatings.has(biodiversityRating)) {
        return biodiversityRating;
      } else {
        this.biodiversityRatings.add(biodiversityRating);
      }
    }

    return -1;
  }

  public async part2(): Promise<string | number> {
    const minutes = this.isExample ? 10 : 200;

    this.setInput(this.input);
    this.grid[2][2] = "?";

    const layer0 = this.cloneGrid();

    this.grid = Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => "."));
    this.grid[2][2] = "?";

    let layers: Layers = {
      0: layer0,
    };

    let minute = 0;
    while (minute < minutes) {
      layers[minute + 1] = this.cloneGrid();
      layers[-(minute + 1)] = this.cloneGrid();

      const newLayers: Layers = JSON.parse(JSON.stringify(layers));

      for (const level in layers) {
        const layer: Layer = layers[level];
        const newLayer: Layer = this.cloneGrid();

        this.getGridLoopXY()
          .filter(({ x, y }) => !(x === 2 && y === 2))
          .forEach(({ x, y }) => {
            const bugs =
              this.getBugs("U", layer, layers, +level, { x, y }) +
              this.getBugs("R", layer, layers, +level, { x, y }) +
              this.getBugs("D", layer, layers, +level, { x, y }) +
              this.getBugs("L", layer, layers, +level, { x, y });

            newLayer[y][x] = (layer[y][x] === "#" && bugs === 1) || (layer[y][x] === "." && between(bugs, 1, 2)) ? "#" : ".";
          });
        newLayers[level] = newLayer;
      }
      // this.printLayers(layers, minute);
      layers = newLayers;
      minute += 1;
    }

    return Object.values(layers)
      .flat(2)
      .filter((c) => c === "#").length;
  }
}
