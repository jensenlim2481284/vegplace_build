
import React from "react";
import Modal from 'react-modal';
import ReactDOM from 'react-dom';
import Star from "../assets/images/star.png";
import Setting from "../assets/images/gear.png";
import Search from "../assets/images/search.png";
import Statistic from "../assets/images/report.gif";

class TopNav  extends React.Component {


    constructor(props) {
        super(props);
        this.state = { minPrice: null, maxPrice: null, foodOption: 1, address: null, orderPerDay: null, postcode: null, settingModalOpen:null, reportModalOpen:null, statistic: {} };
    }


    componentDidMount() {
    
        // Retrieve statistic data 
        let statisticRequest = this.props.requestHeader;
        statisticRequest['body'] = JSON.stringify({  companyID: this.props.stateData.companyID }) 
        fetch( process.env.REACT_APP_BACKEND_API + 'get/statistic', statisticRequest)
            .then(response => response.json())
            .then(data => this.setState({ statistic: data }));

    }


    render() {

        let companySetting = (this.props.stateData.company.setting !== undefined)?JSON.parse(this.props.stateData.company.setting):{};
        if(companySetting === null) companySetting = {};
        // Function to update account setting
        function updateSetting(state, companyID, requestHeader){

            let stateData = state;
            stateData['companyID'] = companyID;
            let settingRequest = requestHeader;
            settingRequest['body'] =  JSON.stringify(stateData);
            
            // Update setting
            fetch( process.env.REACT_APP_BACKEND_API + 'update/setting', settingRequest).then(response => response.json());
        }


        return (
            <>
                <div id="topNav">
                    <div className='searchBar'>
                        <img src={Search}/>
                        <input type='text' placeholder='What would you like to eat?'/>
                    </div>
                    <div className='navIcon'>
                        <div className={this.props.stateData.isAdmin?'settingIcon':'hide'} onClick={() => this.setState({settingModalOpen: true})}>
                            <img src={Setting}/>
                        </div>
                        <div className='menuIcon' onClick={() => this.setState({reportModalOpen: true})}>
                            <img src={Star}/>
                        </div>
                    </div>
                </div>
                <Modal id='settingModal' isOpen={this.state.settingModalOpen} >
                    <button className='modalCloseBtn' onClick={() => this.setState({settingModalOpen: false})}>✖</button>
                    <h1> Setting </h1>
                    <div className='formClass'>
                        <p> Max order per member per day  </p>
                        <input value={ (companySetting.orderPerDay  !== undefined)?companySetting.orderPerDay:this.state.orderPerDay} type='number' step='0.01' onChange={(e) => this.setState({orderPerDay: e.target.value})}/>
                    </div>
                    <div className='formClass'>
                        <p> Price Range : Minimum order price </p>
                        <input value={(companySetting.minPrice  !== undefined)?companySetting.minPrice:this.state.minPrice} type='number' step='0.01' onChange={(e) => this.setState({minPrice: e.target.value})}/>
                    </div>
                    <div className='formClass'>
                        <p> Price Range : Maximum order price </p>
                        <input value={(companySetting.maxPrice  !== undefined)?companySetting.maxPrice:this.state.maxPrice}  type='number' step='0.01' onChange={e => this.setState({maxPrice: e.target.value})}/>
                    </div>
                    <div className='formClass'>
                        <p> Food Option </p>
                        <select value={(companySetting.foodOption  !== undefined)?companySetting.foodOption:this.state.foodOption}  onChange={e => this.setState({foodOption: e.target.value})}>
                            <option default selected value='1'> Vegan -  excludes all meat and animal products (poultry, fish, seafood, dairy and eggs)</option>
                            <option value='2'> Vegetarian -  excludes all meat only </option>
                        </select>
                    </div>
                    <div className='formClass'>
                        <p> Company Address </p>
                        <input value={(companySetting.address  !== undefined)?companySetting.address:this.state.address}  type='text'onChange={e => this.setState({address: e.target.value})} /> 
                    </div>
                    <div className='formClass'>
                        <p> Company Postcode </p>
                        <input value={(companySetting.postcode  !== undefined)?companySetting.postcode:this.state.postcode}  type='text' onChange={e => this.setState({postcode: e.target.value})}/>
                    </div>
                    <button className='updateBtn' onClick={() => {updateSetting(this.state, this.props.stateData.companyID, this.props.requestHeader); this.setState({settingModalOpen: false});}} >Update Setting </button> 
                </Modal>
                <Modal id='reportModal' isOpen={this.state.reportModalOpen} >
                    <button className='modalCloseBtn' onClick={() => this.setState({reportModalOpen: false})}>✖</button>
                    <img src={Statistic}/>
                    <h1> Your Team have save nearly {this.state.statistic.totalCO2Saved} kg of CO2 per year ! </h1>                    
                </Modal>
            </>
        );
    }

}

export default TopNav;
