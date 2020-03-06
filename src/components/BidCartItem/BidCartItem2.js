import React from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";
import styled from 'styled-components';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from "./CheckoutForm"
import {getKennysListUserTable,getItemTable} from '../../graphql/queries';
import API, { graphqlOperation } from '@aws-amplify/api';
export default class BidCartItem2 extends React.Component {
    constructor(props){
        super(props);
        this.state ={stripe:false,stripeP:'',clientID:'', disableButton:false};
        this.startStripe = this.startStripe.bind(this);
    }

    async componentDidMount() {
      
      let currentStatus = this.props.currentSta;
      if(currentStatus == "Bidding" || currentStatus == "Lost"){
        this.setState({disableButton:true})
      }
      else{
        this.setState({disableButton:false})
      }
        
    }
    async startStripe(event){
      let url = "https://in8hc6wee5.execute-api.us-east-1.amazonaws.com/stripe/stripe-payment";
      let amount = "500";
      amount = (parseFloat(this.props.currentBid)*100).toString();
      let user = (await API.graphql(graphqlOperation(getItemTable, {itemID: this.props.id}))).data.getItemTable.itemOwner;

      let response = await API.graphql(graphqlOperation(getKennysListUserTable, {username: user}));
      let accountID = response.data.getKennysListUserTable.accountID;

      let postThis = url+"?amount="+amount+"&accountID="+accountID;
      const stripePromise = loadStripe("pk_test_NedNuvs9YOl1WOhanD0xfJtX00q2eAowF8");
      let dataJSON = await axios.get(postThis);
      if(dataJSON.data.statusCode=="200"){
        this.setState({clientID:dataJSON.data.body.clientSecret});
        this.setState({stripeP:stripePromise})
        this.setState({stripe:true});
      }
      else if(dataJSON.data.satusCode=="500"){
        alert("stripe is busy pleaes try again");
      }
    }
    render() {
        return (
            <CheckoutItemContainer>
                <ImageContainer>
                    <img src={this.props.img} />
                </ImageContainer>
                <TextContainer>
                    <Link to={"/products/" + this.props.id}>{this.props.title}</Link>
                </TextContainer>
                <StatusContainer>
                    {this.props.currentSta}
                </StatusContainer>
                <TextContainer>${this.props.currentBid}</TextContainer>
                <ButtonContainer>
                    <button onClick = {this.startStripe} disabled={this.state.disableButton}>Pay</button>
                </ButtonContainer>

                {(this.state.stripe) ? (<div style={{position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1, backgroundColor: "rgba(0,0,0,0.25)"}}>
                  <div style={{backgroundColor: "white", border: "2px solid black", height: "50%", width: "50%", margin: "0 auto", marginTop: 150, padding: "10px 20px 10px 20px"}}>
                    <Elements stripe={this.state.stripeP}>
                      <CheckoutForm clientInfo={this.state.clientID} prodID ={this.props.id}/>
                    </Elements>
                  </div>
                </div>) : <br />}

            </CheckoutItemContainer>
        );
    }
};

const CheckoutItemContainer = styled.div`
  width: 100%;
  display: flex;
  min-height: 100px;
  border-bottom: 1px solid darkgrey;
  padding: 15px 0;
  font-size: 20px;
  align-items: center;
`;

const ImageContainer = styled.div`
  width: 20%;
  padding-right: 40px;
  img {
    width: 100%;
    height: 100%;
  }
`;

const TextContainer = styled.span`
  width: 23%;
`;

const StatusContainer = styled(TextContainer)`
  display: flex;
  padding-left: 20px;
  color: red;
  span {
    margin: 0 20px;
  }
  div {
    cursor: pointer;
  }
`;

const ButtonContainer = styled.div`
  padding-left: 12px;
  cursor: pointer;
  padding-bottom: 50px;
`;