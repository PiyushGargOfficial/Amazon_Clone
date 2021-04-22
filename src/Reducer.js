import { CssBaseline } from "@material-ui/core";

export const initialState = {
  basket: [],
  user: null,
};

// Selector
export const getBasketTotal = (basket) =>
  basket?.reduce((amount, item) => amount + item.price, 0);

// export const getBasketTotal = (basket) => {
//   basket?.reduce((accumulator, item) => {
//     return accumulator + item.price;
//   }, 0);
// };

const reducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case "ADD_TO_BASKET":
      return {
        ...state,
        basket: [...state.basket, action.item],
      };

    case "EMPTY_BASKET":
      return {
        ...state,
        basket: [],
      };

    case "REMOVE_FROM_BASKET":
      const index = state.basket.findIndex(
        (basketItem) => basketItem.id === action.id
      );
      let newBasket = [...state.basket];

      if (index >= 0) {
        //if we find an item, its index will be 0 to n
        newBasket.splice(index, 1);
      } else {
        console.warn(
          `Cant remove product (id: ${action.id}) as its not in basket!`
        );
      }

      return {
        ...state,
        basket: newBasket,
      };

    //My Code using filter method:
    //the problem is that if we have multiple items of the same id it is going to remove all of them.
    // var basket = state.basket;
    // const newBasket = basket.filter((item) => item.id !== action.id);
    // return {
    //   ...state,
    //   basket: newBasket,
    // };

    case "SET_USER":
      return {
        ...state,
        user: action.user,
      };

    default:
      return state;
  }
};

export default reducer;
