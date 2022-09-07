import React from "react";
import "./assets/style/App.css";
import Bill from "./components/Bill";
import mondaySdk from "monday-sdk-js";
import TopNav from "./components/TopNav";
import Content from "./components/Content";

// Monday.com SDK
const monday = mondaySdk();
const requestHeader = {
    method : 'POST',
    headers: { 'Content-Type': 'application/json', 'ClientKey' :  process.env.REACT_APP_CLIENT_KEY , 'ClientSecret' : process.env.REACT_APP_CLIENT_SECRET}
}

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = { settings: {}, company: {}, userID: null, companyID: null, isAdmin: "", isGuest: "" };
        // this.state = { settings: {}, company: {}, userID: '12', companyID: '1', isAdmin: true, isGuest: false };
    }

    componentDidMount() {
    
        // Query Monday.com API
        monday.api(`query { me { is_guest, is_admin, name, id, account { name id  }  }}`).then((res) => {
       
            // Update state
            this.setState({ isAdmin: res.data.me.is_admin, isGuest : res.data.me.is_guest,  userID : res.data.me.id, companyID : res.data.me.account.id});
            
            // Check and create company record
            let companyRequest = requestHeader;
            // companyRequest['body'] =  JSON.stringify({ name:'Test company', id:'1' })
            companyRequest['body'] =  JSON.stringify({ name:res.data.me.account.name, id: res.data.me.account.id });
            fetch( process.env.REACT_APP_BACKEND_API  + 'update/company', companyRequest)
                .then(response => response.json())
                .then(data => this.setState({ company: data }));

            // Check and create user record
            let userRequest = requestHeader;
            // userRequest['body'] =  JSON.stringify({ name: 'test', id: '12', companyID: '1' });
            userRequest['body'] =  JSON.stringify({ name: res.data.me.name, id: res.data.me.id, companyID: res.data.me.account.id });
            fetch( process.env.REACT_APP_BACKEND_API + 'update/user', userRequest).then(response => response.json());

        });
    
    }

    render() {

        // Check if user is guest - show error
        if(this.state.isGuest) 
            return <div className='ErrorMessage'> Guest user do not have permission to access </div>

        if(this.state.companyID && this.state.userID){
            return (
                <div className="App">
                    <Bill stateData={this.state} />
                    <TopNav stateData={this.state} requestHeader={requestHeader}/>
                    <Content stateData={this.state} requestHeader={requestHeader}/>
                </div>
            );
        }
    }   
}

export default App;
