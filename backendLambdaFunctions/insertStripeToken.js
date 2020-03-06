const stripe = require('stripe')('sk_test_Eylua5wcXgHoTlHYk0Og1upe00ENr8WpAi');
var AWS = require('aws-sdk'),
    myDocumentClient = new AWS.DynamoDB.DocumentClient();
exports.handler = function(event, context, callback) {

    const randstring = event.state;

    var params = {
        TableName : "KennysListUserTable",
        IndexName: "randstring-index",
        KeyConditionExpression: "#rstr = :yyyy",
        ExpressionAttributeNames:{
            "#rstr": "randstring"
        },
        ExpressionAttributeValues: {
            ":yyyy": randstring
        }
    };

    myDocumentClient.query(params, function(err, data) {

        
        if (err) {
            const response = {
                statusCode: 500,
                    headers: {
                      'Access-Control-Allow-Origin': '*',
                    },
                    body: JSON.stringify({
                      message: "Error: could not create account",
                    }),
                  };
            callback(null, response);
        } else {
            if (data.Count == 0) {
                const response = {
                    statusCode: 500,
                    headers: {
                      'Access-Control-Allow-Origin': '*',
                    },
                    body: JSON.stringify({
                      message: "Error: could not create account",
                    }),
                  };
                  callback(null, response);
            }
        
            const userData = data.Items[0];
            
            stripe.oauth.token({
	            grant_type: 'authorization_code',
	            code: event.code,
                }).then(function(response) {
                    const response2 = "Stripe account successfully created.";
      
                     params = {
                        TableName: 'KennysListUserTable',
                        Item: {
                          'username': userData.username,
                          'accountID': response.stripe_user_id,
                          'randstring': randstring
                        }
                     };
                      myDocumentClient.put(params, function(err, data) {
                         if (err) {
                            callback(err)
                         } else {
                            callback(null, response2)
                         }
                    }); 
     
                }
                    
                ).catch((err) => {
                    const response = {
                    statusCode: 500,
                    headers: {
                      'Access-Control-Allow-Origin': '*',
                    },
                    body: JSON.stringify({
                      message: "Error: could not create account",
                    }),
                  };
                  callback(null, response);
                });
        }
    });

    
};
