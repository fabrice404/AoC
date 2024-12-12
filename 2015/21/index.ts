import AoCPuzzle from "../../puzzle";

const WEAPONS = [
  { name: "Dagger", cost: 8, damage: 4, armor: 0 },
  { name: "Shortsword", cost: 10, damage: 5, armor: 0 },
  { name: "Warhammer", cost: 25, damage: 6, armor: 0 },
  { name: "Longsword", cost: 40, damage: 7, armor: 0 },
  { name: "Greataxe", cost: 74, damage: 8, armor: 0 },
];

const ARMORS = [
  { name: "Leather", cost: 13, damage: 0, armor: 1 },
  { name: "Chainmail", cost: 31, damage: 0, armor: 2 },
  { name: "Splintmail", cost: 53, damage: 0, armor: 3 },
  { name: "Bandedmail", cost: 75, damage: 0, armor: 4 },
  { name: "Platemail", cost: 102, damage: 0, armor: 5 },
];

const RINGS = [
  { name: "Damage +1", cost: 25, damage: 1, armor: 0 },
  { name: "Damage +2", cost: 50, damage: 2, armor: 0 },
  { name: "Damage +3", cost: 100, damage: 3, armor: 0 },
  { name: "Defense +1", cost: 20, damage: 0, armor: 1 },
  { name: "Defense +2", cost: 40, damage: 0, armor: 2 },
  { name: "Defense +3", cost: 80, damage: 0, armor: 3 },
];

interface Combination {
  damage: number;
  armor: number;
  cost: number;
  set: string[];
}
export default class Puzzle extends AoCPuzzle {
  private combinations: Combination[] = [];

  private fight(playerLife: number, playerDamage: number, playerArmor: number, bossLife: number, bossDamage: number, bossArmor: number) {
    let turn = 0;
    while (playerLife > 0 && bossLife > 0) {
      if (turn % 2 === 0) {
        bossLife -= Math.max(1, playerDamage - bossArmor);
      } else {
        playerLife -= Math.max(1, bossDamage - playerArmor);
      }
      turn += 1;
    }
    return playerLife > bossLife;
  }

  public async part1(): Promise<string | number> {
    const [bossLife, bossDamage, bossArmor] = this.lines.map((line) => +line.replace(/[^0-9]/gi, ""));
    const playerLife = 100;

    for (const w of WEAPONS) {
      let damage = w.damage;
      let armor = w.armor;
      let cost = w.cost;
      let set = [w.name];
      this.combinations.push({ damage, armor, cost, set });

      for (const a of ARMORS) {
        damage = w.damage + a.damage;
        armor = w.armor + a.armor;
        cost = w.cost + a.cost;
        set = [w.name, a.name];
        this.combinations.push({ damage, armor, cost, set });

        for (const r of RINGS) {
          damage = w.damage + a.damage + r.damage;
          armor = w.armor + a.armor + r.armor;
          cost = w.cost + a.cost + r.cost;
          set = [w.name, a.name, r.name];
          this.combinations.push({ damage, armor, cost, set });

          for (const r2 of RINGS.filter((r2) => r2.name !== r.name)) {
            damage = w.damage + a.damage + r.damage + r2.damage;
            armor = w.armor + a.armor + r.armor + r2.armor;
            cost = w.cost + a.cost + r.cost + r2.cost;
            set = [w.name, a.name, r.name, r2.name];
            this.combinations.push({ damage, armor, cost, set });
          }
        }
      }

      for (const r of RINGS) {
        damage = w.damage + r.damage;
        armor = w.armor + r.armor;
        cost = w.cost + r.cost;
        set = [w.name, r.name];
        this.combinations.push({ damage, armor, cost, set });

        for (const r2 of RINGS.filter((r2) => r2.name !== r.name)) {
          damage = w.damage + r.damage + r2.damage;
          armor = w.armor + r.armor + r2.armor;
          cost = w.cost + r.cost + r2.cost;
          set = [w.name, r.name, r2.name];
          this.combinations.push({ damage, armor, cost, set });
        }
      }
    }

    for (const combination of this.combinations.sort((a, b) => a.cost - b.cost)) {
      if (this.fight(playerLife, combination.damage, combination.armor, bossLife, bossDamage, bossArmor)) {
        return combination.cost;
      }
    }

    return 0;
  }

  public async part2(): Promise<string | number> {
    const [bossLife, bossDamage, bossArmor] = this.lines.map((line) => +line.replace(/[^0-9]/gi, ""));
    const playerLife = 100;

    for (const combination of this.combinations.sort((a, b) => b.cost - a.cost)) {
      if (!this.fight(playerLife, combination.damage, combination.armor, bossLife, bossDamage, bossArmor)) {
        return combination.cost;
      }
    }

    return 0;
  }
}
