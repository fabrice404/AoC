import AoCPuzzle from "../../puzzle";

interface Ingredient {
  name: string;
  capacity: number;
  durability: number;
  flavor: number;
  texture: number;
  calories: number;
}

export default class Puzzle extends AoCPuzzle {
  private ingredients: Ingredient[] = [];

  private maxScore: number = Number.MIN_SAFE_INTEGER;

  private maxScoreCalories: number = Number.MIN_SAFE_INTEGER;

  public async part1(): Promise<string | number> {
    this.ingredients = this.lines.map((line) => {
      const [name, properties] = line.split(": ");
      const [capacity, durability, flavor, texture, calories] = properties
        .replace(/[^\d,-]/g, "")
        .split(",")
        .map(Number);
      return { name, capacity, durability, flavor, texture, calories };
    });

    if (this.isExample) {
      for (let i = 0; i <= 100; i += 1) {
        for (let j = 0; j <= 100 - i; j += 1) {
          const capacity = Math.max(0, i * this.ingredients[0].capacity + j * this.ingredients[1].capacity);
          const durability = Math.max(0, i * this.ingredients[0].durability + j * this.ingredients[1].durability);
          const flavor = Math.max(0, i * this.ingredients[0].flavor + j * this.ingredients[1].flavor);
          const texture = Math.max(0, i * this.ingredients[0].texture + j * this.ingredients[1].texture);
          const score = capacity * durability * flavor * texture;
          if (score > this.maxScore) {
            this.maxScore = score;
          }
          const calories = i * this.ingredients[0].calories + j * this.ingredients[1].calories;
          if (calories === 500 && score > this.maxScoreCalories) {
            this.maxScoreCalories = score;
          }
        }
      }
    } else {
      for (let i = 0; i <= 100; i += 1) {
        for (let j = 0; j <= 100 - i; j += 1) {
          for (let k = 0; k <= 100 - i - j; k += 1) {
            const l = 100 - i - j - k;

            const capacity = Math.max(0, i * this.ingredients[0].capacity + j * this.ingredients[1].capacity + k * this.ingredients[2].capacity + l * this.ingredients[3].capacity);
            const durability = Math.max(
              0,
              i * this.ingredients[0].durability + j * this.ingredients[1].durability + k * this.ingredients[2].durability + l * this.ingredients[3].durability,
            );
            const flavor = Math.max(0, i * this.ingredients[0].flavor + j * this.ingredients[1].flavor + k * this.ingredients[2].flavor + l * this.ingredients[3].flavor);
            const texture = Math.max(0, i * this.ingredients[0].texture + j * this.ingredients[1].texture + k * this.ingredients[2].texture + l * this.ingredients[3].texture);
            const score = capacity * durability * flavor * texture;
            if (score > this.maxScore) {
              this.maxScore = score;
            }
            const calories = i * this.ingredients[0].calories + j * this.ingredients[1].calories + k * this.ingredients[2].calories + l * this.ingredients[3].calories;
            if (calories === 500 && score > this.maxScoreCalories) {
              this.maxScoreCalories = score;
            }
          }
        }
      }
    }

    return this.maxScore;
  }

  public async part2(): Promise<string | number> {
    return this.maxScoreCalories;
  }
}
