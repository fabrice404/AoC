import AoCPuzzle from "../../puzzle";

type Cost = [number, number, number, number];

interface Blueprint {
  costs: [Cost, Cost, Cost, Cost];
  robotLimit: [number, number, number, number];
}

interface Minute {
  timer: number;
  robots: [number, number, number, number];
  ores: [number, number, number, number];
  geodes: number;
}

enum Type {
  Ore = 0,
  Clay = 1,
  Obsidian = 2,
  Geode = 3,
}

export default class Puzzle extends AoCPuzzle {
  private blueprints: Blueprint[] = [];

  private buildRobot(blueprint: Blueprint, minute: Minute, type: Type): Minute {
    const nextMinute: Minute = {
      timer: minute.timer,
      robots: [...minute.robots],
      ores: [...minute.ores],
      geodes: minute.geodes,
    };

    while (!this.canBuildRobot(blueprint, nextMinute, type) && nextMinute.timer > 1) {
      nextMinute.ores = nextMinute.ores.map((ore, i) => ore + nextMinute.robots[i]) as [number, number, number, number];
      nextMinute.timer -= 1;
    }

    nextMinute.ores = nextMinute.ores.map((ore, i) => ore + nextMinute.robots[i] - blueprint.costs[type][i]) as [number, number, number, number];
    nextMinute.timer -= 1;
    if (type === Type.Geode) {
      nextMinute.ores[type] += nextMinute.timer;
      nextMinute.geodes += nextMinute.timer;
    } else {
      nextMinute.robots[type] += 1;
    }

    return nextMinute;
  }

  private canBuildRobot(blueprint: Blueprint, minute: Minute, type: Type): boolean {
    return blueprint.costs[type].every((cost, i) => cost <= minute.ores[i]);
  }

  private findMaxGeodes(blueprint: Blueprint, minute: Minute, limits: [number, number, number, number]): number {
    if (minute.timer === 1) {
      return minute.geodes;
    }
    let max = minute.geodes;

    for (const type of [Type.Ore, Type.Clay, Type.Obsidian, Type.Geode]) {
      if (
        minute.timer < limits[type] ||
        blueprint.robotLimit[type] < minute.robots[type] ||
        (type === Type.Ore && minute.robots[Type.Clay] > 1) ||
        (type === Type.Obsidian && minute.robots[Type.Clay] === 0) ||
        (type === Type.Geode && minute.robots[Type.Obsidian] === 0)
      ) {
        continue;
      }
      const nextMinute = this.buildRobot(blueprint, minute, type);
      if (nextMinute.timer === 0) {
        continue;
      }
      const nextMax = this.findMaxGeodes(blueprint, nextMinute, limits);
      max = Math.max(max, nextMax);
    }

    return max;
  }

  private generateBlueprints(): void {
    this.blueprints = this.lines.map((line) => {
      const [, oreOre, clayOre, obsidianOre, obsidianClay, geodeOre, geodeObsidian] = line.match(/-?\d+/g)!.map(Number);
      return {
        costs: [
          [oreOre, 0, 0, 0],
          [clayOre, 0, 0, 0],
          [obsidianOre, obsidianClay, 0, 0],
          [geodeOre, 0, geodeObsidian, 0],
        ],
        robotLimit: [Math.max(oreOre, clayOre, obsidianOre, geodeOre), obsidianClay, geodeObsidian, 0],
      };
    });
  }

  public async part1(): Promise<string | number> {
    this.generateBlueprints();

    let result = 0;
    for (let i = 0; i < this.blueprints.length; i += 1) {
      const blueprint = this.blueprints[i];
      const minute0: Minute = {
        timer: 24,
        robots: [1, 0, 0, 0],
        ores: [0, 0, 0, 0],
        geodes: 0,
      };
      const maxGeodes = this.findMaxGeodes(blueprint, minute0, [15, 6, 3, 1]);
      result += maxGeodes * (i + 1);
    }

    return result;
  }

  public async part2(): Promise<string | number> {
    this.generateBlueprints();

    let result = 1;
    for (let i = 0; i < Math.min(3, this.blueprints.length); i += 1) {
      const blueprint = this.blueprints[i];
      const minute0: Minute = {
        timer: 32,
        robots: [1, 0, 0, 0],
        ores: [0, 0, 0, 0],
        geodes: 0,
      };
      const maxGeodes = this.findMaxGeodes(blueprint, minute0, [15, 6, 3, 1]);
      result *= maxGeodes;
    }

    return result;
  }
}
