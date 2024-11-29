export const gcd = (a: number, b: number): number => {
  if (b === 0) {
    return a;
  }

  return gcd(b, a % b);
};

export const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

export const decimalToBinary = (n: number, length?: number): string => {
  const result = n.toString(2);
  return (length ? result.padStart(length, '0') : result);
};

export const binaryToDecimal = (s: string): number => parseInt(s, 2);
