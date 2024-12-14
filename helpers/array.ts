import { Point } from "../types";
import { sum as sumNumeric, multiply as multiplyNumeric } from "./numbers";

/**
 * Add an item to an array if it doesn't already exist
 * @param {any[]} array - The array to add the item to
 * @param {any} item - The item to add
 */
export const addUniqueItem = (array: any[], item: any): void => {
  if (!array.includes(item)) {
    array.push(item);
  }
};

/**
 * Output a 2D array to the console
 * @param {any[][]} array - The 2D array to print
 */
export const print2d = (array: any[][]): void => {
  console.log(`${array.map((row) => row.join("")).join("\n")}\n`);
};

/**
 * Count each item in the input array
 * @param {any[]} input - The array to count items from
 * @returns {Map<any, number>} A map with items as keys and their counts as values
 */
export const countItems = (input: any[]): Map<any, number> => {
  const map = new Map<any, number>();
  input.forEach((item) => {
    const count = map.get(item) || 0;
    map.set(item, count + 1);
  });
  return map;
};

/**
 * Sum all the numbers in the array
 * @param {number[]} array - The array of numbers to sum
 * @returns {number} The sum of all numbers in the array
 */
export const sum = (array: number[]): number => array.reduce(sumNumeric, 0);

/**
 * Multiply all the numbers in the array
 * @param {number[]} array - The array of numbers to multiply
 * @returns {number} The product of all numbers in the array
 */
export const multiply = (array: number[]): number => array.reduce(multiplyNumeric, 1);

/**
 * Returns true if the value is in one of the 4 cardinal directions from the given x, y coordinates
 * @param {any[]} array - The 2D array to check
 * @param {number} x - The x coordinate
 * @param {number} y - The y coordinate
 * @param {any} value - The value to check for
 * @returns {boolean} True if the value is next to the coordinates, false otherwise
 */
export const isNextTo = (array: any[], x: number, y: number, value: any): boolean =>
  array[y - 1]?.[x] === value || array[y + 1]?.[x] === value || array[y]?.[x - 1] === value || array[y]?.[x + 1] === value;

/**
 * Returns true if the value is in one of the 6 cardinal directions in a 3D array from the given x, y, z coordinates
 * @param {any[][][]} array - The 3D array to check
 * @param {number} x - The x coordinate
 * @param {number} y - The y coordinate
 * @param {number} z - The z coordinate
 * @param {any} value - The value to check for
 * @returns {boolean} True if the value is next to the coordinates, false otherwise
 */
export const isNextTo3D = (array: any[][][], x: number, y: number, z: number, value: any): boolean =>
  array[z][y - 1]?.[x] === value ||
  array[z][y + 1]?.[x] === value ||
  array[z][y]?.[x - 1] === value ||
  array[z][y]?.[x + 1] === value ||
  array[z - 1]?.[y]?.[x] === value ||
  array[z + 1]?.[y]?.[x] === value;

/**
 * Rotate the array 90 degrees clockwise
 * @param {string[]} array - The array to rotate
 * @returns {string[]} The rotated array
 */
export const rotate = (array: string[]): string[] => {
  const newArray: string[] = Array(array[0].length).fill("");

  for (let i = 0; i < array.length; i += 1) {
    for (let j = 0; j < array[i].length; j += 1) {
      const char = array[i][j];
      newArray[j] += char;
    }
  }
  return newArray;
};

/**
 * Create a 2D array of the given width and height and fill it with the default value
 * @param {number} width - The width of the array
 * @param {number} height - The height of the array
 * @param {any} [defaultValue=null] - The default value to fill the array with
 * @returns {any[][]} The created 2D array
 */
export const create2DArray = (width: number, height: number, defaultValue: any = null): any[][] => {
  const array: any[][] = [];
  for (let i = 0; i < height; i += 1) {
    array.push(Array(width).fill(defaultValue));
  }
  return array;
};

/**
 * Returns the coordinates of the 4 cardinal directions from the given x, y coordinates
 * @param {Point} param0 - The point with x and y coordinates
 * @returns {Point[]} The coordinates of the 4 cardinal directions
 */
export const getUpRightLeftDownCoordinates = ({ x, y }: Point): Point[] =>
  [
    [0, -1],
    [+1, 0],
    [0, +1],
    [-1, 0],
  ].map(([mx, my]) => ({ x: x + mx, y: y + my }));

/**
 * Returns the coordinates of the 4 cardinal directions from the given x, y coordinates
 */
export const getNeighborsCoordinates = getUpRightLeftDownCoordinates;

/**
 * Returns the coordinates of the 8 cardinal directions from the given x, y coordinates
 * @param {Point} param0 - The point with x and y coordinates
 * @returns {Point[]} The coordinates of the 8 cardinal directions
 */
export const getAllNeighborsCoordinates = ({ x, y }: Point): Point[] =>
  [
    [-1, -1],
    [+0, -1],
    [+1, -1],
    [-1, 0],
    [+1, 0],
    [-1, +1],
    [+0, +1],
    [+1, +1],
  ].map(([mx, my]) => ({ x: x + mx, y: y + my }));

/**
 * Returns all possible permutations of the given array
 * @param {any[]} s - The array to generate permutations from
 * @returns {any[]} An array of all possible permutations
 */
export const permutations = (s: any[]): any[] => {
  if (s.length < 2) {
    return [s];
  }
  const result: any[] = [];
  for (let i = 0; i < s.length; i += 1) {
    const c = s[i];

    if (s.indexOf(c) !== i) {
      continue;
    }

    for (const sub of permutations([...s.slice(0, i), ...s.slice(i + 1, s.length)])) {
      result.push([c, ...sub]);
    }
  }
  return result;
};

/**
 * Returns all possible combinations of the given array
 * @param {any[]} s - The array to generate combinations from
 * @param {number} len - The length of each combination
 * @returns {any[][]} An array of all possible combinations
 */
export const combinations = (s: any[], len: number): any[][] => {
  if (len === 0) return [[]];
  const result = [];
  for (let i = 0; i <= s.length - len; i++) {
    const sub_result = combinations(s.slice(i + 1), len - 1);
    for (const combination of sub_result) {
      result.push([s[i], ...combination]);
    }
  }
  return result;
};

/**
 * Sort the array alphabetically
 * @param {string} a - The first string to compare
 * @param {string} b - The second string to compare
 * @returns {number} The comparison result
 */
export const sortAlpha = (a: string, b: string) => (a.localeCompare(b) ? 1 : -1);

/**
 * Sort the array numerically
 * @param {number} a - The first number to compare
 * @param {number} b - The second number to compare
 * @returns {number} The comparison result
 */
export const sortNumeric = (a: number, b: number) => (a > b ? 1 : -1);

/**
 * Converts an array to a point, 2D or 3D depending on the array length
 * @param {number[]} array - The array to convert
 * @returns {Point} The converted point
 */
export const arrayToPoint = (array: number[]): Point => (array.length === 3 ? { x: array[0], y: array[1], z: array[2] } : { x: array[0], y: array[1] });
