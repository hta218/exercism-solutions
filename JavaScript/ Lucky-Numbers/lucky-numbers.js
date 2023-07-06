/**
 * Calculates the sum of the two input arrays.
 *
 * @param {number[]} array1
 * @param {number[]} array2
 * @returns {number} sum of the two arrays
 */
export function twoSum(array1, array2) {
  let sum1 = array1.reduce((a, c) => a + c, "");
  let sum2 = array2.reduce((a, c) => a + c, "");
  return Number(sum1) + Number(sum2);
}

/**
 * Checks whether a number is a palindrome.
 *
 * @param {number} value
 * @returns {boolean} whether the number is a palindrome or not
 */
export function luckyNumber(value) {
  let reversed = String(value).split("").reverse().join("");
  return value === Number(reversed);
}

/**
 * Determines the error message that should be shown to the user
 * for the given input value.
 *
 * @param {string|null|undefined} input
 * @returns {string} error message
 */
export function errorMessage(input) {
  if (!input) return "Required field";
  let numb = Number(input);
  if (!numb || isNaN(numb)) return "Must be a number besides 0";
  return "";
}
