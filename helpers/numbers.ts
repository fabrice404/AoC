export const gcd = (a: number, b: number): number => {
  if (b === 0) {
    return a;
  }

  return gcd(b, a % b);
};

export const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

export const decimalToBinary = (n: number, length?: number): string => {
  const result = n.toString(2);
  return length ? result.padStart(length, "0") : result;
};

export const binaryToDecimal = (s: string): number => parseInt(s, 2);

export const manhattanDistance = (x1: number, y1: number, x2: number, y2: number): number => Math.abs(x2 - x1) + Math.abs(y2 - y1);

export const sum = (a: number, b: number) => a + b;

export const multiply = (a: number, b: number) => a * b;

export const between = (n: number, a: number, b: number): boolean => a <= n && n <= b;

export const absoluteModulo = (n: number, m: number): number => ((n % m) + m) % m;
