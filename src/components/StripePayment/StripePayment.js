import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';

const StripePayment = ({price}) => {
    const priceForStripe = price * 100;
    const publicKey = 'pk_test_tM4fyE4fBKuIKE7K90jrwCrT00F9c4soEZ';

    const onToken = token => {
        axios ({
            url : 'payment',
            method : 'POST',
            data : {
                amount: priceForStripe,
                token
            }
        })
        .then(res => {
            alert('Payment Successful');
        })
            .catch(error => {
                console.log('Payment error', JSON.parse(error));
                alert('There was an issue with your payment!');
            });
    };

    return(
        <StripeCheckout
            label="Pay Now"
            name ="KennysList"
            shippingAddress
            billingAdress={true}
            image=""
            description={`Your total is $${price}`}
            amount={priceForStripe}
            panelLabel="Pay Now"
            allowRememberMe
            token={onToken}
            stripeKey={publicKey}
            />
    );
};

export default StripePayment;
