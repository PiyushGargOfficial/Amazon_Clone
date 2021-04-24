import React, { useState, useEffect } from "react";
import CheckoutProduct from "./CheckoutProduct";
import "../CSS/Payment.css";
import { useStateValue } from "../StateProvider";
import { Link, useHistory } from "react-router-dom";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { getBasketTotal } from "../Reducer";
import CurrencyFormat from "react-currency-format";
import axios from "../axios";
import { db } from "../firebase";

function Payment() {
  const [{ basket, user }, dispatch] = useStateValue();
  const [error, setError] = useState();
  const [disabled, setDisabled] = useState();
  const stripe = useStripe();
  const elements = useElements();
  const history = useHistory();

  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState("");
  const [clientSecret, setClientSecret] = useState(true);

  useEffect(() => {
    //Code to generate the special stripe secret which allows us to charge a customer
    const getClientSecret = async () => {
      const response = await axios({
        method: "post",
        //Stripe expects the total to be put in subtotal values. For Dollar, pence. For rupees, paisas.
        url: `/payments/create?total=${getBasketTotal(basket) * 100}`,
      });
      //coming from the backend: Secret
      console.log(response.data);
      setClientSecret(response.data.clientSecret);
    };
    //This is how you call an async function in useEffect
    getClientSecret();
  }, [basket]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    //Stripe Code:
    const payload = await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })
      .then(({ paymentIntent }) => {
        //paymentIntent = payment confirmation
        console.log(paymentIntent);

        //Add the order into firestore db
        //Error handling is not done here, so errors are handled poorly.xD
        db.collection("users")
          .doc(user?.uid)
          .collection("orders")
          .doc(paymentIntent.id)
          .set({
            basket: basket,
            amount: paymentIntent.amount, //There is some error and I am not able to get succeed as result, so I have improvised
            created: paymentIntent.created, //gives us a timestamp to when the order was created
          });
        setSucceeded(true);
        setError(null);
        setProcessing(false);
        //After the payment is made, we want to empty the basket.
        dispatch({
          type: "EMPTY_BASKET",
        });

        //We don't them to be able to come back to the payment page after the payment is done, so we replace the page.
        history.replace("/orders");
      });
  };

  const handleChange = (event) => {
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  return (
    <div className="payment">
      <div className="payment__container">
        <h1>
          Checkout (<Link to="/checkout">{basket?.length} items</Link>)
        </h1>
        <div className="payment__section">
          <div className="payment__title">
            <h3>Delivery Address</h3>
          </div>
          <div className="payment__address">
            <p>{user?.email}</p>
            <p>Test React Land</p>
            <p>Seoul, Korea</p>
          </div>
        </div>
        <div className="payment__section">
          <div className="payment__title">
            <h3>Review items and delivery</h3>
          </div>
          <div className="payment__items">
            {basket.map((item) => (
              <CheckoutProduct
                id={item.id}
                title={item.title}
                image={item.image}
                price={item.price}
                rating={item.rating}
              />
            ))}
          </div>
        </div>
        <div className="payment__section">
          <div className="payment__title">
            <h3>Payment Method</h3>
          </div>
          <div className="payment__details">
            <form onSubmit={handleSubmit}>
              <CardElement onChange={handleChange} />
              <div className="payment__priceContainer">
                <CurrencyFormat
                  renderText={(value) => (
                    <>
                      <h3>Order Total: {value}</h3>
                    </>
                  )}
                  decimalScale={2}
                  value={getBasketTotal(basket)} // part of the homework
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
                <button disabled={processing || disabled || succeeded}>
                  <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                </button>
              </div>
              {error && <div>{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
