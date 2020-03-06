import React from 'react';
import Auth from 'aws-amplify';

export default class CreateAccount extends React.Component {
    constructor(props){
        super(props);
        this.state = {username: ""};
    }

    async componentDidMount(){
        let currentUser = "";
        try {
            let response = await Auth.currentAuthenticatedUser();
            currentUser = response.username;
            this.setState({username: currentUser});
          } catch(err) {
              console.log("ERROR: Failed to retrieve username.");
        }
    }
    
    render() {
        return (<div></div>);
    }
  }
