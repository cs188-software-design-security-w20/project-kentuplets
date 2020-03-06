const stripe = require('stripe')('sk_test_Eylua5wcXgHoTlHYk0Og1upe00ENr8WpAi');

exports.handler = async (event, context, callback) => {
    // Creates the INTENT to pay. Not yet getting any payment info. Says somebody wants to pay user X
    
    return stripe.paymentIntents.create({
  payment_method_types: ['card'],
  amount: event.amount,
  currency: 'usd',
  transfer_data: {
    //destination: '{{CONNECTED_STRIPE_ACCOUNT_ID}}',
    destination: event.accountID,
  },
}).then(function(paymentIntent) {
    const response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body:({
          message: `Charge processed succesfully!`,
          clientSecret: paymentIntent.client_secret,
        }),
      };
      callback(null, response);
    })
    .catch((err) => { // Error response
      const response = {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: err.message,
        }),
      };
      callback(null, response);
    });

};
