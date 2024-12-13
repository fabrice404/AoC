import AoCPuzzle from "../../puzzle";

interface GameState {
  bossHealth: number;
  bossDamage: number;
  playerHealth: number;
  playerMana: number;
  playerArmor: number;
  shield: number;
  poison: number;
  recharge: number;
  manaSpent: number;
  nextToMove: "player" | "boss";
  turn: number;
  hardMode: boolean;
}

interface Spell {
  name: string;
  mana: number;
  damage: number;
  heal: number;
}

const SPELLS: Spell[] = [
  { name: "Magic Missile", mana: 53, damage: 4, heal: 0 },
  { name: "Drain", mana: 73, damage: 2, heal: 2 },
  { name: "Shield", mana: 113, damage: 0, heal: 0 },
  { name: "Poison", mana: 173, damage: 3, heal: 0 },
  { name: "Recharge", mana: 229, damage: 0, heal: 0 },
];

export default class Puzzle extends AoCPuzzle {
  private miniMana = Number.MAX_VALUE;

  private playGame(hardMode: boolean = false) {
    const [bossHealth, bossDamage] = this.input.split("\n").map((line) => +line.replace(/[^0-9]/g, ""));
    const [playerHealth, playerMana] = [50, 500];
    this.miniMana = Number.MAX_VALUE;

    const initialState: GameState = {
      bossHealth,
      bossDamage,
      playerHealth,
      playerMana,
      playerArmor: 0,
      shield: 0,
      poison: 0,
      recharge: 0,
      manaSpent: 0,
      nextToMove: "player",
      turn: 0,
      hardMode,
    };

    const q: GameState[] = [initialState];

    while (q.length > 0) {
      q.unshift(...this.playRound(q.shift()!));
    }

    return this.miniMana;
  }

  private playRound(state: GameState): GameState[] {
    const result: GameState[] = [];

    const nextState = { ...state };
    nextState.turn += 1;

    if (nextState.hardMode && nextState.nextToMove === "player") {
      nextState.playerHealth -= 1;
      if (nextState.playerHealth <= 0) {
        return [];
      }
    }

    if (nextState.shield > 0) {
      nextState.playerArmor = 7;
      nextState.shield -= 1;
    } else {
      nextState.playerArmor = 0;
    }

    if (nextState.poison > 0) {
      nextState.bossHealth -= 3;
      nextState.poison -= 1;
    }
    if (nextState.recharge > 0) {
      nextState.playerMana += 101;
      nextState.recharge -= 1;
    }

    if (nextState.bossHealth <= 0) {
      this.miniMana = Math.min(this.miniMana, nextState.manaSpent);
      return [];
    }

    if (nextState.playerHealth <= 0 || nextState.manaSpent >= this.miniMana) {
      return [];
    }

    if (nextState.nextToMove === "boss") {
      nextState.nextToMove = "player";
      nextState.playerHealth -= Math.max(1, nextState.bossDamage - nextState.playerArmor);
      result.unshift(nextState);
    } else {
      nextState.nextToMove = "boss";

      for (const spell of SPELLS) {
        if (spell.mana >= nextState.playerMana) {
          continue;
        }

        const spellState = { ...nextState };
        spellState.playerMana -= spell.mana;
        spellState.manaSpent += spell.mana;

        switch (spell.name) {
          case "Magic Missile":
            spellState.bossHealth -= 4;
            break;
          case "Drain":
            spellState.bossHealth -= 2;
            spellState.playerHealth += 2;
            break;
          case "Shield":
            if (spellState.shield > 0) {
              continue;
            }
            spellState.shield = 6;
            break;
          case "Poison":
            if (spellState.poison > 0) {
              continue;
            }
            spellState.poison = 6;
            break;
          case "Recharge":
            if (spellState.recharge > 0) {
              continue;
            }
            spellState.recharge = 5;
            break;
        }

        if (spellState.bossHealth <= 0) {
          return [];
        }
        result.unshift(spellState);
      }
    }

    return result;
  }

  public async part1(): Promise<string | number> {
    return this.playGame(false);
  }

  public async part2(): Promise<string | number> {
    return this.playGame(true);
  }
}
