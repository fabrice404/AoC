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
  console.log(`${array.map((row) => row.join('')).join('\n')}\n`);
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

export const isNextTo = (
  array: any[],
  x: number,
  y: number,
  value: any,
): boolean => array[y - 1]?.[x] === value
|| array[y + 1]?.[x] === value
|| array[y]?.[x - 1] === value
  || array[y]?.[x + 1] === value;

export const isNextTo3D = (
  array: any[][][],
  x: number,
  y: number,
  z: number,
  value: any,
): boolean => array[z][y - 1]?.[x] === value
|| array[z][y + 1]?.[x] === value
|| array[z][y]?.[x - 1] === value
|| array[z][y]?.[x + 1] === value
|| array[z - 1]?.[y]?.[x] === value
  || array[z + 1]?.[y]?.[x] === value;

export const rotate = (array: string[]): string[] => {
  const newArray: string[] = Array(array[0].length).fill('');

  for (let i = 0; i < array.length; i += 1) {
    for (let j = 0; j < array[i].length; j += 1) {
      const char = array[i][j];
      newArray[j] += char;
      // if (i === 0) {
      //   newArray.push(char);
      // } else {
      //   newArray[i] += char;
      // }
    }
  }
  return newArray;
};
