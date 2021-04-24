const functions = require("firebase-functions");
//We are going to build an express app as the backend and host the app on the cloud using cloud functions.

const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51IjRF3SBKBeyxaBzaJiZa5Xd1002eovOdRLXf3LGs30fe1O8YdsDQHWyOZjzwLyU2mmx4HjbLLZKJZ4i86ZvvxZM002sVg2jFu"
);

//API

//App config
const app = express();

//Middlewares
app.use(cors({ origin: true }));
app.use(express.json());

//API Routes
app.get("/", (req, res) => {
  res.status(200).send("hello world");
});

app.post("/payments/create", async (req, res) => {
  const total = req.query.total;
  console.log("Payment request recieved: " + total);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: "usd",
  });

  //OK: Created, If the stripe allows the payment and validates it, it send the secret
  res.status(200).send({
    clientSecret: paymentIntent.client_secret,
  });
});

//Listen Command
exports.api = functions.https.onRequest(app);

//Example Endpoint
// http://localhost:5001/clone-3c328/us-central1/api
