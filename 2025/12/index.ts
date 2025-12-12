import { sum } from "../../helpers/array";
import AoCPuzzle from "../../puzzle";

type Gift = {
  id: string;
  shape: string[][];
};

type Region = {
  width: number;
  height: number;
  gifts: number[];
};

export default class Puzzle extends AoCPuzzle {
  private gifts: Gift[] = [];

  private regions: Region[] = [];

  public async part1(): Promise<string | number> {
    for (const input of this.input.split("\n\n")) {
      if (input.match(/^\d+:\n/gi)) {
        const [id, ...shapeLines] = input.split("\n");
        this.gifts.push({
          id: id.replace(":", ""),
          shape: shapeLines.map((line) => line.split("")),
        });
      } else {
        for (const line of input.split("\n")) {
          const [sizes, giftString] = line.split(":").map((part) => part.trim());
          const [width, height] = sizes.split("x").map(Number);
          this.regions.push({
            width,
            height,
            gifts: giftString.split(" ").map((id) => Number(id.trim())),
          });
        }
      }
    }

    return this.regions.filter((region) => {
      const availableArea = region.width * region.height;
      const requiredArea = sum(
        region.gifts.map((quantity, id) => {
          if (quantity === 0) {
            return 0;
          }
          const gift = this.gifts.find((g) => g.id === id.toString());
          if (!gift) {
            return 0;
          }
          const area = gift.shape[0].length! * gift.shape.length!;
          return area * quantity;
        }),
      );
      return availableArea >= requiredArea;
    }).length;
  }

  public async part2(): Promise<string | number> {
    return "HAPPY XMAS!";
  }
}
