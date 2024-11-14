const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ExpenseRouter = require('./Routes/ExpenseRouter');
const { router: PlaidRouter, plaidHealthCheck } = require('./Routes/plaidRouter'); // Import the Plaid router and health check
const ensureAuthenticated = require('./Middlewares/Auth');

require('dotenv').config();
require('./Models/db');
const PORT = process.env.PORT || 8080;

// Health Check for Plaid on Startup
plaidHealthCheck();


app.use(bodyParser.json());
app.use(cors());
app.use('/auth', AuthRouter);
app.use('/expenses', ensureAuthenticated, ExpenseRouter);
app.use('/plaid', PlaidRouter); // Use the Plaid router

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
