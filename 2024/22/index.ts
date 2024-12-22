import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private getNextSecret(secret: bigint): bigint {
    secret = (secret ^ (secret * 64n)) % 16777216n;
    secret = (secret ^ ~~(secret / 32n)) % 16777216n;
    secret = (secret ^ (secret * 2048n)) % 16777216n;
    return secret;
  }

  public async part1(): Promise<string | number> {
    return this.lines
      .map((line: string) => {
        let secret = BigInt(line);
        for (let i = 0; i < 2000; i += 1) {
          secret = this.getNextSecret(secret);
        }
        return secret;
      })
      .reduce((acc: bigint, val: bigint) => acc + val, 0n)
      .toString();
  }

  public async part2(): Promise<string | number> {
    const grandTotals: { [key: string]: bigint } = {};

    for (const line of this.lines) {
      const totals: { [key: string]: bigint } = {};
      let secret = BigInt(line);
      const secrets = [secret % 10n];
      for (let i = 0; i <= 2000; i += 1) {
        secret = this.getNextSecret(secret);
        secrets.push(secret % 10n);
      }

      for (let i = 4; i < secrets.length; i += 1) {
        const a = secrets[i - 4];
        const b = secrets[i - 3];
        const c = secrets[i - 2];
        const d = secrets[i - 1];
        const e = secrets[i];

        const key = [b - a, c - b, d - c, e - d].join(",");
        if (totals[key] == null) {
          totals[key] = e;
        }
      }
      for (const [key, value] of Object.entries(totals)) {
        grandTotals[key] = (grandTotals[key] || 0n) + value;
      }
    }

    return Object.entries(grandTotals)
      .sort((a, b) => (a[1] > b[1] ? -1 : 1))[0][1]
      .toString();
  }
}
