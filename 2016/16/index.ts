import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  private diskSize: number = 0;

  private calculateChecksum(): string {
    let data = this.input;
    while (data.length < this.diskSize) {
      const reversedCopy = data.split('').reverse().map((c) => (c === '0' ? '1' : '0')).join('');
      data = `${data}0${reversedCopy}`;
    }
    if (data.length > this.diskSize) {
      data = data.slice(0, this.diskSize);
    }
    let checksum = data;
    do {
      let newChecksum = '';
      for (let i = 0; i < checksum.length; i += 2) {
        newChecksum += checksum[i] === checksum[i + 1] ? '1' : '0';
      }
      checksum = newChecksum;
    } while (checksum.length % 2 === 0);

    return checksum;
  }

  public async part1(): Promise<string | number> {
    this.diskSize = this.isExample ? 20 : 272;
    return this.calculateChecksum();
  }

  public async part2(): Promise<string | number> {
    this.diskSize = 35651584;
    return this.calculateChecksum();
  }
}
