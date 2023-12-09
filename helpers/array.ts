/**
 * Add an item to an array if it doesn't already exist
 * @param array
 * @param item
 */
export const addUniqueItem = (array: any[], item: any): void => {
  if (!array.includes(item)) {
    array.push(item);
  }
};

/**
 * Output a 2d array to the console
 * @param array
 */
export const print2d = (array: any[][]): void => {
  console.log(array.map((row) => row.join('')).join('\n'));
};

/**
 * Count each item in the *input* array
 * @param array
 * @returns Map<any, number>
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
 * @param array
 * @returns
 */
export const sum = (array: number[]): number => array.reduce((acc, val) => acc + val, 0);

/**
 * Multiply all the numbers in the array
 * @param array
 * @returns
 */
export const multiply = (array: number[]): number => array.reduce((acc, val) => acc * val, 1);
