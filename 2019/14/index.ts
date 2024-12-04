import { sum } from "../../helpers/numbers";
import AoCPuzzle from "../../puzzle";

interface Resource {
  name: string;
  receipe?: Receipe;
}

interface Receipe {
  ingredients: Ingredient[];
  quantityMade: number;
}

interface Ingredient {
  name: string;
  quantity: number;
}

export default class Puzzle extends AoCPuzzle {
  private resources: Resource[] = [];

  private getResource(name: string): Resource {
    let found = this.resources.find((r) => r.name === name);
    if (!found) {
      this.resources.push({ name });
      found = this.resources.find((r) => r.name === name);
    }
    return found!;
  }

  private leftovers: Map<string, number> = new Map<string, number>();

  private getOreRequired(name: string, quantity: number): number {
    const quantityNeeded = quantity - (this.leftovers.get(name) || 0);
    if (quantityNeeded < 0) {
      this.leftovers.set(name, (this.leftovers.get(name) || 0) - quantity);
      return 0;
    }

    const resource = this.getResource(name);
    if (resource.receipe) {
      const { quantityMade } = resource.receipe;
      const multiplier = Math.ceil(quantityNeeded / quantityMade);
      this.leftovers.set(resource.name, quantityMade * multiplier - quantityNeeded);
      return resource.receipe?.ingredients
        .map((ingredient) => (ingredient.name === "ORE" ? ingredient.quantity * multiplier : this.getOreRequired(ingredient.name, ingredient.quantity * multiplier)))
        .reduce(sum);
    }
    return 0;
  }

  public async part1(): Promise<string | number> {
    this.lines.forEach((line) => {
      const [ingredients, [{ name, quantity }]] = line.split("=>").map((s: string) => {
        return s
          .trim()
          .split(/,/gi)
          .map((sub) => {
            const [quantity, name] = sub.trim().split(/\s/);
            return { name, quantity: +quantity };
          });
      });

      this.getResource(name).receipe = { ingredients, quantityMade: quantity };
    });

    return this.getOreRequired("FUEL", 1);
  }

  public async part2(): Promise<string | number> {
    let i = 0;
    let incrementSize = 1e12;
    while (true) {
      this.leftovers.clear();
      const oreRequired = this.getOreRequired("FUEL", i);
      if (oreRequired > 1e12) {
        i -= incrementSize;
        if (incrementSize === 1) {
          break;
        }
        incrementSize /= 10;
      }
      i += incrementSize;
    }
    return i;
  }
}
