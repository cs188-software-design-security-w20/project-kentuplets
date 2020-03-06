import React from 'react';
import {Auth, Storage } from 'aws-amplify';
import { getItemTable,listItemTables, getKennysListUserTable} from '../../../graphql/queries';
import {createItemTable,createLatestUserBidTable, createUserBidsTable,updateKennysListUserTable,createKennysListUserTable } from '../../../graphql/mutations';

import API, { graphqlOperation } from '@aws-amplify/api';
import uuid from "uuid";
import './AddItem.css'

export default class AddItem extends React.Component {
    constructor(props){
        super(props)
        this.state = {value: '', file:'',desc: '',category: 'Other',cond:'New',startingBid:0,marketPrice:0, accountCreated: false, APItime:''};
        this.handleName = this.handleName.bind(this);
        this.handleSub = this.handleSub.bind(this);
        this.handleFile = this.handleFile.bind(this);
        this.handleDesc = this.handleDesc.bind(this);
        this.handleCategory = this.handleCategory.bind(this);
        this.checkSellable = this.checkSellable.bind(this);
        this.handleCondition = this.handleCondition.bind(this);
        this.handleStartingBid = this.handleStartingBid.bind(this);
        this.handleMarketPrice = this.handleMarketPrice.bind(this);
    }
    handleCategory(event){
        this.setState({category: event.target.value});
    }
    handleFile(event){
        this.setState({file: event.target.files[0]});
    }
    handleName(event) {//enforce alphanumeric input
        const re = /^[a-z\d\s]+$/i;
        if(event.target.value===''||re.test(event.target.value)){
            this.setState({value: event.target.value});
        }
      }
    handleDesc(event){
        const re = /^[a-z\d\s]+$/i;
        if(event.target.value===''||re.test(event.target.value)){
            this.setState({desc: event.target.value});
        }
    }
    handleCondition(event){
        this.setState({cond: event.target.value});
    }
    handleStartingBid(event){
        if(event.target.value >=0.0){
            this.setState({startingBid:event.target.value});
        }
    }
    handleMarketPrice(event){
        if(event.target.value >=0.0){
            this.setState({marketPrice:event.target.value});
        }
    }

    async handleSub(event) {
        event.preventDefault();
        this.refs.sub.setAttribute("disabled", "disabled");
        const file = this.state.file;
        const title = this.state.value;
        const desc = this.state.desc;
        const cate = this.state.category;
        const condi = this.state.cond;
        const startBid = this.state.startingBid;
        const markPrice = this.state.marketPrice;
        const uID = uuid.v4();
        const user = (await Auth.currentAuthenticatedUser()).username;
        const sellable =await this.checkSellable(user);
        const time = this.state.APItime;
        if(sellable ==false){
            alert('You can only sell 5 items at a time. Please Delete Some Items or wait');
            console.log('adding too many items');
        }
        else if(user == null){
            alert("your session has expired please log in again");
        }
        else if(file ==''||title==''||desc==''){
            alert('Missing an input');
            console.log("missing an input");
        }
        else{
            const itemIDStore = uID.toString();
            Storage.put(uID, file, {
                level: 'protected',
                contentType: 'image/png'
            })
            .then (result => {Storage.get(uID, {level: 'protected'}
            ).then(r=>

            {
                API.graphql(graphqlOperation(createItemTable,
                {input: {itemID: itemIDStore, description: desc,itemOwner:user,
                    name: title, postTime: time, category: cate, startingBid: startBid, marketPrice: markPrice, images: [r.substring(0,r.indexOf('?'))], condition: condi}})).then(e=>{alert('Successful Upload');this.setState({value: '',desc: '',category: 'Other'}); this.refs.sub.removeAttribute("disabled");}).catch(err=>console.log(err)); this.refs.btn.removeAttribute("disabled");}).catch(e=>console.log(e));}

                    ).catch(err => console.log(err));

            API.graphql(graphqlOperation(createLatestUserBidTable,
                {input:{
                        lubtProductID: itemIDStore,
                        BidAmt: startBid,
                        Username: `${user}, (seller)`,
                    }}))

            API.graphql(graphqlOperation(createUserBidsTable,
                {input:{
                        ProductID: itemIDStore,
                        Username: `${user}, (seller)`
                    }}))
        }
      }
      async checkSellable(uname){
        let itemList = [];
        let currentUser = uname;

        await (API.graphql(graphqlOperation(listItemTables, {filter:{itemOwner:{eq:currentUser}}})).then((evt) => {
            if(evt.data.listItemTables.items!= null){
                evt.data.listItemTables.items.map((itemDB,i) =>{itemList.push(itemDB);});
            }
        }));
        if(itemList.length <5){
            console.log("returning True");
            return true;
        }
        else{
            console.log("returning False");
            return false;
        }
      }

      async stripeAccount(){
        let user = (await Auth.currentAuthenticatedUser()).username;
        if (user == null){
            await Auth.signOut().catch(err=>console.log(err));
        }

        //Generate random value to associate with user
        let magicNumbers = new Uint32Array(2);
        window.crypto.getRandomValues(magicNumbers);

        let magicString = "";
        for (let i = 0; i < 2; i++) {
            let append = magicNumbers[i].toString();
            magicString += append; 
        }

        //Store (user, magicString) tuple in database
        let response = await API.graphql(graphqlOperation(getKennysListUserTable, {username: user}));

        //Update pre-existing database entry
        if (response.data.getKennysListUserTable !== null) {
            API.graphql(graphqlOperation(updateKennysListUserTable, {input:{
                username: user,
                randstring: magicString
            }}));
        } 
        
        //Create new database entry
        else {
            API.graphql(graphqlOperation(createKennysListUserTable, {input:{username: user,randstring:magicString}}));
        }

        let link = "https://connect.stripe.com/express/oauth/authorize?client_id=ca_Glz8Mb09LGrSthPbSj28gU0WsDX65f6g&state="+magicString;
        window.open(link);
        location.reload();
    }

    async componentDidMount() {

        let user = (await Auth.currentAuthenticatedUser()).username;
        let response = await API.graphql(graphqlOperation(getKennysListUserTable, {username: user}));
        if (response.data.getKennysListUserTable!== null && response.data.getKennysListUserTable.accountID !== null) {
            console.log("Account already created!");
            this.setState({accountCreated: true});
        }
  
        await fetch('https://worldtimeapi.org/api/timezone/America/Los_Angeles')
        .then(respose => respose.json())
        .then(times => this.setState({APItime: times.datetime}))
        .catch(error => console.log('Error:', error));
    }

  //images will be validated server side as well
    render() {
        return (
            <div className="formContainer">

                <form onSubmit = {this.handleSubmit}>
                    <div className = "row">
                        <div className = "col-25">
                            <label htmlFor="fileName">Image:</label>
                        </div>
                        <div className = "col-75">
                            <input id = "fileName" type="file" accept='image/png' onChange={this.handleFile}/>
                        </div>
                    </div>
                    <div className = "row">
                        <div className = "col-25">
                            <label htmlFor="title">Title:</label>
                        </div>
                        <div className = "col-75">
                            <input id ="title" type="text" value = {this.state.value} onChange={this.handleName} />
                        </div>
                    </div>
                    <div className = "row">
                        <div className = "col-25">
                            <label htmlFor="startingBid">Starting Bid</label>
                        </div>
                        <div className = "col-75">
                            <input type="number" step = "0.01" min = "0"  id="startingBid" value = {this.state.startingBid} onChange = {this.handleStartingBid}/>
                        </div>
                    </div>
                    <div className = "row">
                        <div className = "col-25">
                            <label htmlFor="marketPrice">Market Price</label>
                        </div>
                        <div className = "col-75">
                            <input type="number" step = "0.01" min = "0"  id="marketPrice" value = {this.state.marketPrice} onChange = {this.handleMarketPrice}/>
                        </div>
                    </div>
                    <div className = "row">
                        <div className = "col-25">
                            <label htmlFor="desc">Description of Item:</label>
                        </div>
                        <div className = "col-75">
                            <textarea id="desc" type="text" value = {this.state.desc} onChange={this.handleDesc} />
                        </div>
                    </div>
                    <div className = "row">
                        <div className = "col-25">
                            <label htmlFor ="category">Category:</label>
                        </div>
                        <div className = "col-75">
                            <select id="category" value = {this.state.category} onChange={this.handleCategory}>
                                <option value="Other">Other</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Home">Home</option>
                            </select>
                        </div>
                    </div>
                    <div className = "row">
                        <div className = "col-25">
                            <label htmlFor = "condition">Condition:</label>
                        </div>
                        <div className = "col-75">
                            <select id="condition" onChange={this.handleCondition}>
                                <option value="New">New</option>
                                <option value="Used">Used</option>
                            </select>
                        </div>
                    </div>
                    <div className ="row">
                        {this.state.accountCreated ? <button onClick = {this.handleSub} ref ="sub" >Submit</button> : <button onClick={this.stripeAccount}>Create Stripe Account</button>}
                    </div>
                </form>

            </div>
        )
    }
  }
