import { pointToKey, waitSync } from "../../helpers/helpers";
import AoCPuzzle from "../../puzzle";
import { IntCodeComputer } from "../int-code-computer";

export default class Puzzle extends AoCPuzzle {
  private maxX: number = Number.MIN_SAFE_INTEGER;

  private maxY: number = Number.MIN_SAFE_INTEGER;

  private minX: number = Number.MAX_SAFE_INTEGER;

  private minY: number = Number.MAX_SAFE_INTEGER;

  private tiles: Map<string, number> = new Map<string, number>();

  private printScreen(): void {
    for (let y = this.minY; y <= this.maxY; y += 1) {
      const row = [];
      for (let x = this.minX - 1; x <= this.maxX; x += 1) {
        const key = pointToKey({ x, y });
        let pixel = " ";
        if (this.tiles.has(key)) {
          switch (this.tiles.get(key)) {
            case 1:
              pixel = "█";
              break;
            case 2:
              pixel = "\x1b[34m█\x1b[0m";
              break;
            case 3:
              pixel = "▀";
              break;
            case 4:
              pixel = "\x1b[31mO\x1b[0m";
              break;
          }
        }
        row.push(pixel);
      }
      console.log(row.join(""));
    }
    waitSync(3);
  }

  public async part1(): Promise<string | number> {
    const computer = new IntCodeComputer(this.input);

    let finished = false;
    const outputs = [];

    while (!finished) {
      finished = computer.compute(false);
      outputs.push(computer.output);
    }

    for (let i = 0; i < outputs.length; i += 3) {
      const [x, y, tile] = [outputs[i], outputs[i + 1], outputs[i + 2]];
      if (x && y && tile) {
        this.minX = Math.min(this.minX, x);
        this.maxX = Math.max(this.maxX, x);
        this.minY = Math.min(this.minY, y);
        this.maxY = Math.max(this.maxY, y);

        this.tiles.set(pointToKey({ x, y }), tile);
      }
    }

    this.printScreen();

    return [...this.tiles.values()].filter((v) => v === 2).length;
  }

  public async part2(): Promise<string | number> {
    this.tiles = new Map<string, number>();
    this.minX = Number.MAX_SAFE_INTEGER;
    this.maxX = Number.MIN_SAFE_INTEGER;
    this.minY = Number.MAX_SAFE_INTEGER;
    this.maxY = Number.MIN_SAFE_INTEGER;

    const computer = new IntCodeComputer("2" + this.input.slice(1));

    let finished = false;

    let ballX = null;
    let paddleX = null;
    let joystick = 0;
    let score = 0;

    while (!finished) {
      finished = computer.compute(false);
      if (finished) {
        break;
      }
      const x = computer.output;

      finished = computer.compute(false);
      if (finished) {
        break;
      }
      const y = computer.output;

      finished = computer.compute(false);
      if (finished) {
        break;
      }
      const tile = computer.output;

      if (x === -1 && y === 0) {
        score = tile;
      }

      this.minX = Math.min(this.minX, x);
      this.maxX = Math.max(this.maxX, x);
      this.minY = Math.min(this.minY, y);
      this.maxY = Math.max(this.maxY, y);
      this.tiles.set(pointToKey({ x, y }), tile);

      if (tile === 3) {
        paddleX = x;
      }
      if (tile === 4) {
        ballX = x;
        if (paddleX! > ballX) {
          joystick = -1;
        } else if (paddleX! < ballX) {
          joystick = 1;
        } else {
          joystick = 0;
        }
        computer.addInputs([joystick]);
        // this.printScreen();
      }
    }

    return score;
  }
}
