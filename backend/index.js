const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const AuthRouter = require("./Routes/AuthRouter");
const ExpenseRouter = require("./Routes/ExpenseRouter");
const {
  router: PlaidRouter,
  plaidHealthCheck,
} = require("./Routes/PlaidRouter"); 
const ensureAuthenticated = require("./Middlewares/Auth");

require("dotenv").config();
require("./Models/db");
const PORT = process.env.PORT || 8080;

// Health Check for Plaid
plaidHealthCheck();


const allowedOrigins = ["http://localhost:3000"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use("/auth", AuthRouter);
app.use("/transactions", ExpenseRouter);
app.use("/plaid", PlaidRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
