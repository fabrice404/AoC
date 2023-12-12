export function memoize<R, T extends (...args: any[]) => R>(f: T): T {
  const memory = new Map<string, R>();

  const g = (...args: any[]) => {
    const key = JSON.stringify(args);
    if (!memory.has(key)) {
      memory.set(key, f(...args));
    }
    return memory.get(key);
  };

  return g as T;
}

export default {};
