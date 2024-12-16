import { sum } from "../../helpers/array";
import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private run(floors: number[]) {
    let count = 0;

    const total = sum(floors);
    let currentFloor = 1;
    let piecesInElevator = Math.min(floors[1], 2);
    floors[1] -= piecesInElevator;

    while (floors[4] !== total - 1) {
      while (piecesInElevator < 2 && currentFloor > 1) {
        currentFloor -= 1;
        const piecesTaken = Math.min(floors[currentFloor], 2 - piecesInElevator);
        if (piecesTaken > 0) {
          piecesInElevator += piecesTaken;
          floors[currentFloor] -= piecesTaken;
        }
        count += 1;
      }

      while (currentFloor < 4) {
        currentFloor += 1;
        const piecesTaken = Math.min(floors[currentFloor], 2 - piecesInElevator);
        if (piecesTaken > 0) {
          piecesInElevator += piecesTaken;
          floors[currentFloor] -= piecesTaken;
        }
        count += 1;
      }

      floors[4] += 1;
      piecesInElevator -= 1;
    }

    return count;
  }

  public async part1(): Promise<string | number> {
    const floors = this.lines.map((line) => (line.match(/generator|microchip/gi) || []).length);
    return this.run([0, ...floors]);
  }

  public async part2(): Promise<string | number> {
    const floors = this.lines.map((line) => (line.match(/generator|microchip/gi) || []).length);
    floors[0] += 4;
    return this.run([0, ...floors]);
  }
}
