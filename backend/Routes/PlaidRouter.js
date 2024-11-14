'use strict';

const express = require('express');
const { Configuration, PlaidApi, Products, PlaidEnvironments, CraCheckReportProduct } = require('plaid');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const util = require('util');
require('dotenv').config();

// Environment Variables
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';
const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || 'transactions').split(',');
const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || 'US').split(',');
const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || '';
const PLAID_ANDROID_PACKAGE_NAME = process.env.PLAID_ANDROID_PACKAGE_NAME || '';

// Initialize Plaid Client
const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV.toLowerCase()],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
      'Plaid-Version': '2020-09-14',
    },
  },
});
const plaidClient = new PlaidApi(configuration);

const router = express.Router();

// Health Check Function
async function plaidHealthCheck() {
  try {
    console.log('Running Plaid Health Check...');
    const request = {
      institution_id: 'ins_109508', // Plaid public test institution for Chase Bank
      country_codes: PLAID_COUNTRY_CODES,
    };
    const response = await plaidClient.institutionsGetById(request);
    console.log('Plaid is working. Successfully connected to:', response.data.institution.name);
  } catch (error) {
    console.error('Plaid Health Check Failed:', error.response?.data?.error_message || error.message);
  }
}

// Create Link Token
router.post('/create_link_token', async (req, res) => {
  try {
    console.log('Creating link token...');
    const configs = {
      user: {
        client_user_id: 'user-id',
      },
      client_name: 'Expense Tracker App',
      products: PLAID_PRODUCTS,
      country_codes: PLAID_COUNTRY_CODES,
      language: 'en',
    };

    if (PLAID_REDIRECT_URI) {
      configs.redirect_uri = PLAID_REDIRECT_URI;
    }
    if (PLAID_ANDROID_PACKAGE_NAME) {
      configs.android_package_name = PLAID_ANDROID_PACKAGE_NAME;
    }

    console.log('Link token configs:', configs);
    const createTokenResponse = await plaidClient.linkTokenCreate(configs);
    console.log('Link token created successfully:', createTokenResponse.data);
    prettyPrintResponse(createTokenResponse);
    res.json(createTokenResponse.data);
  } catch (error) {
    console.error('Error in create_link_token:', error.response?.data?.error_message || error.message);
    res.status(500).json({ error: 'Failed to create link token' });
  }
});

// Exchange Public Token for Access Token
router.post('/set_access_token', async (req, res) => {
  if (!req.body.public_token) {
    console.error('Public token is missing in request body');
    return res.status(400).json({ error: 'public_token is required' });
  }

  try {
    console.log('Exchanging public token for access token...');
    const tokenResponse = await plaidClient.itemPublicTokenExchange({
      public_token: req.body.public_token,
    });
    console.log('Access token exchange successful:', tokenResponse.data);
    prettyPrintResponse(tokenResponse);
    res.json({
      access_token: tokenResponse.data.access_token,
      item_id: tokenResponse.data.item_id,
      error: null,
    });
  } catch (error) {
    console.error('Error in set_access_token:', error.response?.data?.error_message || error.message);
    res.status(500).json({ error: 'Failed to set access token' });
  }
});

// Get Accounts Information
router.post('/accounts', async (req, res) => {
  if (!req.body.access_token) {
    console.error('Access token is missing in request body');
    return res.status(400).json({ error: 'access_token is required' });
  }

  try {
    console.log('Fetching accounts information...');
    const accountsResponse = await plaidClient.accountsGet({
      access_token: req.body.access_token,
    });
    console.log('Accounts fetched successfully:', accountsResponse.data);
    prettyPrintResponse(accountsResponse);
    res.json(accountsResponse.data);
  } catch (error) {
    console.error('Error in accounts endpoint:', error.response?.data?.error_message || error.message);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
});

// Pretty Print for Debugging
const prettyPrintResponse = (response) => {
  console.log(util.inspect(response.data, { colors: true, depth: 4 }));
};

module.exports = {
  router,
  plaidHealthCheck,
};
