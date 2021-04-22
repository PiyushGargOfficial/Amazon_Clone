import React from "react";
import CurrencyFormat from "react-currency-format";
import "../CSS/Subtotal.css";
import { useStateValue } from "../StateProvider";
import { getBasketTotal } from "../Reducer";

function Subtotal() {
  const [{ basket }, dispatch] = useStateValue();

  return (
    <div className="subtotal">
      <CurrencyFormat
        renderText={(value) => (
          <>
            <p>
              Subtotal ({basket?.length} items): <strong>{value}</strong>
            </p>
            <small className="subtotal__gift">
              <input type="checkbox" /> This order contains a gift
            </small>
          </>
        )}
        decimalScale={2} //value of decimals upto 2 spaces
        value={getBasketTotal(basket)} //amount
        displayType={"text"}
        thousandSeparator={true}
        prefix={"$"} //currency
      />

      <button>Proceed to Checkout</button>
    </div>
  );
}

export default Subtotal;
