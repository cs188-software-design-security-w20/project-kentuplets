import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {formatMoney} from "../Pipes/priceFormatter";
import {getItemTable, getLatestUserBidTable, listUserBidsTables, listItemTables} from '../../graphql/queries';
import {
    createUserBidsTable,
    updateLatestUserBidTable,
    updateUserBidsTable
} from '../../graphql/mutations';
import {addProductToCart,updateUsername} from "../../actions";
import API, { graphqlOperation } from '@aws-amplify/api'
import { Auth } from 'aws-amplify';
import axios from 'axios';

const ProductDetail = (props) => {
    const {
        condition,
        itemID, name, description,marketPrice
    } = props.product;

    const [value, setValue] = useState('');
    const [BidHistory, setBidHistory] = useState(null);
    const [currentUser, setCurrentUsername] = useState('');
    const [expTime, setExpTime] = useState(1000);
    const [errorValidation, setErrorValidation] = useState('');

    const expTimeFormatted = () => {
        var time = expTime;
        const days = Math.floor(time / 86400);
        time = time % 86400;
        const hours = Math.floor(time / 3600);
        time = time % 3600;
        const minutes = Math.floor(time / 60);
        time = time % 60;
        const seconds = time;

        var formattedTime = "";

        if (days) formattedTime += days + "d ";
        if (hours) formattedTime += hours + "h ";
        if (minutes) formattedTime += minutes + "m ";

        formattedTime += seconds + "s ";

        return formattedTime;
    };

    useEffect(() => {
        try {
            Auth.currentAuthenticatedUser({
                bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
            }).then(user => {
                setCurrentUsername(user.username);
            })
        }
        catch (e) {
            console.log("failed to get username");
        }

    }, []);

    useEffect(() => {

        //Fetch the item data from the server and set the expiration time accordingly.
        if (expTime <= 0)
            return;
        
     
        const fetchData = async () => {

            const result = await axios('https://worldtimeapi.org/api/timezone/America/Los_Angeles');
            
            await (API.graphql(graphqlOperation(getItemTable, {itemID: itemID})).then(e => {
                const curTimeInEpoch = Math.round(Date.parse(result.data.datetime) / 1000);
                const postTimeInEpoch = Math.round((Date.parse(e.data.getItemTable.postTime) / 1000));
                const bidTime = 500;// 604800 = seven days in seconds
                const time = bidTime - (curTimeInEpoch - postTimeInEpoch);
                if (time > 0) {
                    setExpTime(time);
                } else {
                    setExpTime(0);
                }
            }));
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (expTime <= 0){
            return;
        };
   
        const interval = setInterval(() => {
            setExpTime(expTime - 1);
        }, 1000);

        return () => clearInterval(interval);
        
    }, [expTime]);


    const clearState = () => {
        setValue('');
    };
    const handleChange = e => {
        e.preventDefault();
        setValue(e.target.value);
      };

    useEffect(() => {
        const fetchData = async () => {
            await (API.graphql(graphqlOperation(getLatestUserBidTable, {lubtProductID: itemID})).then(e => {
                setBidHistory(e.data.getLatestUserBidTable.BidAmt);
            }).catch(e => {console.log("Failed to retrieve data");}));
        };
        fetchData();
    }, []);

    const handleSubmit = async event => {
        event.preventDefault();
        clearState();

        let period = Math.floor((Math.random() * 3000));
        await new Promise(r => setTimeout(r, period));

        //Pull latest bid from DB here
        let response = await (API.graphql(graphqlOperation(getLatestUserBidTable, {lubtProductID: itemID})));
        let currentBid = response.data.getLatestUserBidTable.BidAmt;
        if (currentBid !== BidHistory) {
            alert("The current bid has been updated! Please reload the page!");
            return;
        }
        //validations for bid input
        if(value.trim() === "" || value.split('').includes('e')||value.split('').includes('-')|| value.split('').includes('+')){
            setErrorValidation('Bid Value is invalid');
            return;
        }

        //validations for bid input
        const convertNum = parseInt(value, 10);
        if(convertNum <= BidHistory){
            setErrorValidation(`Bid Value must be greater than $${BidHistory}`);
            return;
        }

        //validations for bid input
        if(convertNum >= 999999999){
            setErrorValidation(`Bid Value is too large!! Try Again`)
            return;
        }

        setBidHistory(value);
        setErrorValidation('');

    
        await API.graphql(graphqlOperation(updateLatestUserBidTable,
            {input:{
                lubtProductID: itemID,
                    Username: currentUser,
                    BidAmt: value
                }}));

        let bidding_users = [];
        await API.graphql(graphqlOperation(listUserBidsTables,{limit: 500, filter:{ProductID:{eq:itemID}}})).then((evt) => {
            evt.data.listUserBidsTables.items.forEach(tuple => {
                bidding_users.push(tuple.Username);
            });
        });

        if(bidding_users.includes(currentUser)){
            await API.graphql(graphqlOperation(updateUserBidsTable,
                {input:{
                        ProductID : itemID,
                        Username: currentUser,
                        BidAmt : value,
                        Status: "Bidding"
                    }}));
        }
        else{
            await API.graphql(graphqlOperation(createUserBidsTable,
                {input:{
                        ProductID: itemID,
                        Username: currentUser,
                        BidAmt : value,
                        Status: "Bidding"
                    }}))
        }
    };

    
    async function getWinner() {
        if(expTime<=0){
            let winnerr = '';
            let curUser = currentUser;
            await API.graphql(graphqlOperation(getLatestUserBidTable, {lubtProductID: itemID})).then(e => {
                // setWinner(e.data.getLatestUserBidTable.Username);
                winnerr = e.data.getLatestUserBidTable.Username
            }).catch(e => {console.log("Failed to retrieve data");})

            let bid_users = [];
            await API.graphql(graphqlOperation(listUserBidsTables,{limit: 500, filter:{ProductID:{eq:itemID}}})).then((evt) => {
                evt.data.listUserBidsTables.items.forEach(key => {
                    bid_users.push(key.Username);
                });
            });

            if(bid_users.includes(curUser)){
                if(currentUser == winnerr){
                    await API.graphql(graphqlOperation(updateUserBidsTable,
                    {
                        input: {
                            ProductID: itemID,
                            Username: currentUser,
                            Status: "Won"
                        }
                    }))
                }
                else{
                    await API.graphql(graphqlOperation(updateUserBidsTable,
                    {
                        input: {
                            ProductID: itemID,
                            Username: currentUser,
                            Status: "Lost"
                        }
                    }))
                }
        
                }else{console.log("No Bid");} 
        };
    };

    getWinner();

    return (
        <aside className="col-sm-7">
            <article className="card-body p-5">
                <h3 className="title mb-3">{name}</h3>

                <p className="price-detail-wrap">
                <span className="price h3 text-warning">
                    <span className="currency">$</span><span className="num">{formatMoney(marketPrice)} (Market Value)</span>
                </span>
                </p>

                <h6 className="mb-3"><strong>Condition:</strong> {condition}</h6>
                <h6 className="mb-3">
                <strong >Base Bid: $</strong>
                        <span>{BidHistory}</span>
                </h6>
                <h6 className="mb-3">
                <strong>Time Left: </strong>
                    {!expTime ? (<span>SOLD</span>):(<span>{expTimeFormatted()}</span>)}

                </h6>
                <form onSubmit={handleSubmit}>
                    <div>
                        <h6><strong>Your bid:</strong></h6>
                        <input style={{float:"right"}} className="mt-2 mr-3" type="submit" value="Place Bid" disabled={expTime<=0}/>
                        <input style={{ width: "290px" }} 
                                    id={itemID} name="input-field" 
                                    className="form-control mt-3" 
                                    type="number" 
                                    value={value}
                                    placeholder="Your Bid"  
                                    onChange={handleChange} />
                        {errorValidation.length > 0 ? (<div style={{color: 'red'}}>{errorValidation}</div>):(<div></div>)}
                    </div>
                </form>
                <hr/>
                <dl className="item-property">
                    <dt>Description</dt>
                    <dd><p className="text-capitalize">{description}</p></dd>
                </dl>
            </article>
        </aside>
    );
};

export default connect()(ProductDetail);
