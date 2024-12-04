import { manhattanDistance } from "../../helpers/numbers";
import AoCPuzzle from "../../puzzle";
import { Point } from "../../types";

type Groups = { [key: string]: Point[] };

export default class Puzzle extends AoCPuzzle {
  private asteroids: Point[] = [];

  private groups: Groups = {};

  private countInLightOfSight(asteroid: Point): Groups {
    const groups: Groups = { src: [asteroid] };

    this.asteroids.forEach((a) => {
      if (a.x === asteroid.x && a.y === asteroid.y) {
        return;
      }
      const dot = a.x - asteroid.x;
      const det = a.y - asteroid.y;
      let angle = (Math.atan2(det, dot) * 180) / Math.PI;
      if (angle >= 0 && angle <= 90) {
        angle = Math.abs(angle - 90);
      } else if (angle < 0) {
        angle = Math.abs(angle) + 90;
      } else {
        angle = 450 - angle;
      }
      const key = angle;
      if (groups[key] == null) {
        groups[key] = [];
      }
      groups[key].push(a);
    });

    return groups;
  }

  public async part1(): Promise<string | number> {
    for (let y = 0; y < this.grid.length; y += 1) {
      for (let x = 0; x < this.grid[y].length; x += 1) {
        if (this.grid[y][x] === "#") {
          this.asteroids.push({ x, y });
        }
      }
    }

    return this.asteroids.reduce((max, asteroid) => {
      const groups = this.countInLightOfSight(asteroid);
      if (Object.keys(groups).length - 1 > max) {
        max = Object.keys(groups).length - 1;
        this.groups = groups;
      }
      return max;
    }, 0);
  }

  public async part2(): Promise<string | number> {
    const angles = Object.keys(this.groups)
      .filter((k) => k !== "src")
      .map(Number)
      .sort((a, b) => ((a <= 180 ? 360 + a : a) > (b <= 180 ? 360 + b : b) ? -1 : 1));
    const [laserPoint] = this.groups["src"];

    let i = 0;
    const vaporizedIndex = 200;
    let lastAsteroid: Point;
    while (i < vaporizedIndex) {
      const angle = angles.shift();
      const group = this.groups[`${angle}`];
      if (group.length > 0) {
        if (group.length > 1) {
          angles.push(angle!);
          group.sort((a, b) => (manhattanDistance(laserPoint.x, laserPoint.y, a.x, a.y) > manhattanDistance(laserPoint.x, laserPoint.y, b.x, b.y) ? 1 : -1));
        }
        lastAsteroid = group.shift()!;
        i += 1;
      }
    }

    return lastAsteroid!.x * 100 + lastAsteroid!.y;
  }
}
