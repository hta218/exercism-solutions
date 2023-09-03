let pizzaPrices = {
  Margherita: 7,
  Caprese: 9,
  Formaggio: 10,
};
let toppingPrices = {
  ExtraSauce: 1,
  ExtraToppings: 2,
};

/**
 * Determine the prize of the pizza given the pizza and optional extras
 *
 * @param {Pizza} pizza name of the pizza to be made
 * @param {Extra[]} extras list of extras
 *
 * @returns {number} the price of the pizza
 */
export function pizzaPrice(pizza, ...extras) {
  let toppingPrice = extras.reduce((a, c) => {
    a += toppingPrices[c];
    return a;
  }, 0);

  return pizzaPrices[pizza] + toppingPrice;
}

/**
 * Calculate the prize of the total order, given individual orders
 *
 * @param {PizzaOrder[]} pizzaOrders a list of pizza orders
 * @returns {number} the price of the total order
 */
export function orderPrice(pizzaOrders) {
  return pizzaOrders.reduce((a, c) => {
    a += pizzaPrice(c.pizza, ...c.extras);
    return a;
  }, 0);
}
