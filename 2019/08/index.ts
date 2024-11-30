import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  private layers: number[][] = [];
  public async part1(): Promise<string | number> {
    const pixels = this.input.split('').map(Number);

    let minZeroDigits = Number.MAX_SAFE_INTEGER;
    let minZeroDigitsLayer = -1;

    let i = 0;
    while (pixels.length > 0) {
      this.layers[i] = pixels.splice(0, 25 * 6);
      const zeroDigits = this.layers[i].filter((p) => p === 0).length;
      if (zeroDigits < minZeroDigits) {
        minZeroDigits = zeroDigits;
        minZeroDigitsLayer = i;
      }
      i += 1;
    }

    return this.layers[minZeroDigitsLayer].filter((p) => p === 1).length *
      this.layers[minZeroDigitsLayer].filter((p) => p === 2).length;
  }

  public async part2(): Promise<string | number> {
    const image: string[] = [];

    for (const layer of this.layers.reverse()) {
      for (let i = 0; i < layer.length; i += 1) {
        const pixel = layer[i];
        if (pixel === 0) {
          image[i] = '▓';
        } else if (pixel === 1) {
          image[i] = ' ';
        }
      }
    }
    
    console.log("▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓")
    while (image.length > 0) {
      console.log(`▓${image.splice(0, 25).join('')}▓`);
    }
    console.log("▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓")


    return 'see console output';
  }
}
