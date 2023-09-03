# Instructions

You run a pizza shop, and offer three types of pizzas:

- Margherita: $7
- Caprese: $9
- Formaggio: $10

If customers want, they can add an unlimited number of extra options: either "ExtraSauce" for $1 or "ExtraToppings" for $2.

Your task is to write code that assists the customer in figuring out the cost to them.

### 1. Calculate the price of a pizza

Provided the pizza's name as the first argument, and an unlimited number of added options, calculate the price of the pizza in dollars.

```js
pizzaPrice("Margherita");
// => 7

pizzaPrice("Caprese", "ExtraSauce", "ExtraToppings");
// => 12

pizzaPrice(
  "Caprese",
  "ExtraToppings",
  "ExtraToppings",
  "ExtraToppings",
  "ExtraToppings"
);
// => 17
```

### 2. Calculate the total price of an order

Your function is called with a list of `PizzaOrders` and should return the total price of the order in dollars. Each `PizzaOrder` has a `pizza` property - the pizza's name, and an `extras` property - the list of extra options.

```js
const margherita = new PizzaOrder("Margherita");
const caprese = new PizzaOrder("Caprese", "ExtraToppings");
orderPrice([margherita, caprese]);
// => 18
```

---

View the exercise on [Exercism](https://exercism.org/tracks/javascript/exercises/pizza-order).
