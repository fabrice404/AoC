import {
  copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync,
} from 'fs';
import path from 'path';

/**
 * Read a file and return the contents
 * @param path
 * @returns string
 */
export const readFile = (filepath: string): string => {
  if (!existsSync(filepath)) {
    writeFileSync(filepath, '', { encoding: 'utf-8' });
  }
  return readFileSync(filepath, 'utf8').trimEnd();
};

/**
 * Copy code template file to the specified folder
 * @param folder
 */
export const generateCodeFile = (folder: string): void => {
  mkdirSync(folder, { recursive: true });
  copyFileSync(path.join(__dirname, 'template.ts'), path.join(folder, 'index.ts'));
};
