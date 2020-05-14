/*
 * Compare two JSON objects by comparing stringified json
 */
export const jsonEqual = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b);
};