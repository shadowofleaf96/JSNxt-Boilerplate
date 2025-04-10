const {createAdminRestApiClient} = require('@shopify/admin-api-client');

const client = createAdminRestApiClient({
    storeDomain: process.env.SHOPIFY_URL,
    apiVersion: '2024-07',
    accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
  });
  
module.exports = client;