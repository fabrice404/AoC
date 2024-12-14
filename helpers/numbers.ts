import { Point } from "../types";

/**
 * Calculates the greatest common divisor (GCD) of two numbers.
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} The GCD of the two numbers.
 */
export const gcd = (a: number, b: number): number => {
  if (b === 0) {
    return a;
  }

  return gcd(b, a % b);
};

/**
 * Calculates the least common multiple (LCM) of two numbers.
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} The LCM of the two numbers.
 */
export const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

/**
 * Converts a decimal number to a binary string.
 * @param {number} n - The decimal number.
 * @param {number} [length] - The length to pad the binary string to.
 * @returns {string} The binary string representation of the number.
 */
export const decimalToBinary = (n: number, length?: number): string => {
  const result = n.toString(2);
  return length ? result.padStart(length, "0") : result;
};

/**
 * Converts a binary string to a decimal number.
 * @param {string} s - The binary string.
 * @returns {number} The decimal number representation of the binary string.
 */
export const binaryToDecimal = (s: string): number => parseInt(s, 2);

/**
 * Calculates the Manhattan distance between two points.
 * @param {Point} a - The first point.
 * @param {Point} b - The second point.
 * @returns {number} The Manhattan distance between the two points.
 */
export const manhattanDistance = (a: Point, b: Point): number => Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs((a.z || 0) - (b.z || 0));

/**
 * Sums two numbers, useful in a reduce function.
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} The sum of the two numbers.
 */
export const sum = (a: number, b: number) => a + b;

/**
 * Multiplies two numbers, useful in a reduce function.
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} The product of the two numbers.
 */
export const multiply = (a: number, b: number) => a * b;

/**
 * Checks if a number is between two other numbers (inclusive).
 * @param {number} n - The number to check.
 * @param {number} a - The lower bound.
 * @param {number} b - The upper bound.
 * @returns {boolean} True if the number is between the two bounds, false otherwise.
 */
export const between = (n: number, a: number, b: number): boolean => a <= n && n <= b;

/**
 * Calculates the absolute modulo of a number.
 * @param {number} n - The number.
 * @param {number} m - The modulo.
 * @returns {number} The absolute modulo of the number.
 */
export const absoluteModulo = (n: number, m: number): number => ((n % m) + m) % m;
