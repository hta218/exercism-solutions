/**
 * Implement the functions needed to solve the exercise here.
 * Do not forget to export them so they are available for the
 * tests. Here an example of the syntax as reminder:
 *
 * export function yourFunction(...) {
 *   ...
 * }
 */

// Task 1
export function cookingStatus(remainingTime) {
  if (remainingTime === undefined) return "You forgot to set the timer.";
  if (remainingTime === 0) return "Lasagna is done.";
  return "Not done, please wait.";
}

// Task 2
export function preparationTime(layers, averageTime) {
  return layers.length * (averageTime || 2);
}

// Task 3
export function quantities(layers) {
  let noodles = layers.filter((i) => i === "noodles").length;
  let sauce = layers.filter((i) => i === "sauce").length;
  return {
    noodles: noodles * 50,
    sauce: sauce * 0.2,
  };
}

// Task 4
export function addSecretIngredient(friendsList, myList) {
  myList.push(friendsList[friendsList.length - 1]);
}

// Task 5
export function scaleRecipe(recipe, numb) {
  let ratio = numb / 2;
  return Object.entries(recipe).reduce((a, [k, v]) => {
    a[k] = v * ratio;
    return a;
  }, {});
}
