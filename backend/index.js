const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const AuthRouter = require("./Routes/AuthRouter");
const ExpenseRouter = require("./Routes/ExpenseRouter");
const {
  router: PlaidRouter,
  plaidHealthCheck,
} = require("./Routes/plaidRouter"); // Import the Plaid router and health check
const ensureAuthenticated = require("./Middlewares/Auth");

require("dotenv").config();
require("./Models/db");

const app = express();

// Health Check for Plaid on Startup
plaidHealthCheck();

const allowedOrigins = [
  "http://localhost:3000", // Development
  "https://fin-track-lh21.vercel.app", // Frontend in production
];

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
app.use("/expenses", ensureAuthenticated, ExpenseRouter);
app.use("/plaid", PlaidRouter); // Use the Plaid router

// Export the app for Vercel
module.exports = app;
