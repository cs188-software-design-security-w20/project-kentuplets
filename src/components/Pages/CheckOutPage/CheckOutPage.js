import React from 'react';
import {Auth, Storage } from 'aws-amplify';
import API, { graphqlOperation } from '@aws-amplify/api';
import { listUserBidsTables, getItemTable } from '../../../graphql/queries';
import {connect} from 'react-redux';
import styled from 'styled-components';
import BidCartItem2 from '../../BidCartItem/BidCartItem2';
export default class CheckoutPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {biddingItems: []};
    }

    async componentDidMount(){
        let currentUser = "";
        try {
            let response = await Auth.currentAuthenticatedUser();
            currentUser = response.username;
          } catch(err) {
              console.log("ERROR: Failed to retrieve username.");
        }

        //Clear state
        this.setState({biddingItems: []});
        await API.graphql(graphqlOperation(listUserBidsTables, {limit:500, filter:{Username:{eq:currentUser}}})).then((evt) => {
            let itemIds = [];
            let currentBids = [];
            let currentStatus = [];

            evt.data.listUserBidsTables.items.forEach(tuple => {
                itemIds.push(tuple.ProductID);
                currentBids.push(tuple.BidAmt);
                currentStatus.push(tuple.Status);
            });

            for (let i = 0; i < itemIds.length; i++) {
                API.graphql(graphqlOperation(getItemTable, {itemID: itemIds[i]})).then((evt) => {
                    let temp = this.state.biddingItems;
                    let temp2 = evt.data.getItemTable;
                    temp2.currentBid = currentBids[i];
                    temp2.currentSta = currentStatus[i];
                    temp.push(temp2);
                    this.setState({biddingItems: temp});
                }); 
            }
        });
    }

    render() {
        return (
        <CheckoutPageContainer>
            <CheckoutHeaderContainer>
                <HeaderBlockContainer>
                    <span>Product</span>
                </HeaderBlockContainer>
                <HeaderBlockContainer>
                    <span>Title</span>
                </HeaderBlockContainer>
                <HeaderBlockContainer>
                    <span>Status</span>
                </HeaderBlockContainer>
                <HeaderBlockContainer>
                    <span>Current Bid</span>
                </HeaderBlockContainer>
                <HeaderBlockContainer>
                    <span>Checkout</span>
                </HeaderBlockContainer>
            </CheckoutHeaderContainer>
            {this.state.biddingItems.length !== 0 ? this.state.biddingItems.map((cart, index) => (
                <div key={index}>
                <BidCartItem2  img={cart.images[0]} id={cart.itemID} title={cart.name} currentBid={cart.currentBid} currentSta={cart.currentSta} />
                </div>)) : <h1 className="display-4 mt-5 text-center">There is no bid in your BidCart</h1> }
        </CheckoutPageContainer>);
    }
}

export const CheckoutPageContainer = styled.div`
  width: 55%;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px auto 0;
  padding-top: 40px;
  button {
    margin-left: auto;
    margin-top: 50px;
  }
`;

export const CheckoutHeaderContainer = styled.div`
  width: 95%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid darkgrey;
`;

export const HeaderBlockContainer = styled.div`
  text-transform: capitalize;
  width: 23%;
  &:last-child {
    width: 12%;
  }
`;
