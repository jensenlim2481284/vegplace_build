
import React from "react";
import Modal from 'react-modal';
import ReactDOM from 'react-dom';
import Coin from "../assets/images/coin.png"

class Bill extends React.Component {

    constructor(props) {
        super(props);
        this.state = { billModalOpen: false };
    }

    render() {


        // Check if user is admin - hide for membrer
        if(!this.props.stateData.isAdmin) return true;

        return (
            <div id='billNav'>
                <div className='credit-section'>
                    <img src={Coin}/>
                    <b> ${this.props.stateData.company.credit} </b>
                </div>
                <button className='topupBtn' onClick={() => this.setState({billModalOpen: true})}> Topup </button>
                
                <Modal id='billModal' isOpen={this.state.billModalOpen} >
                    <button className='modalCloseBtn' onClick={() => this.setState({billModalOpen: false})}>✖</button>
                    <div className='billCreditSection'>
                        <img src={Coin}/>
                        <b> ${this.props.stateData.company.credit} </b>
                    </div>
                    <form action={"https://www.sandbox.paypal.com/cgi-bin/webscr?custom=" + this.props.stateData.companyID}  method="post" target="print_popup">
                        <input type="hidden" name="cmd" value="_s-xclick"/>
                        <input type="hidden" name="hosted_button_id" value="CNEBV2DQTNB6A"/>
                        <input type="hidden" name="on0" value="Topup Amount"/>
                        <p> Topup Amount </p>
                        <select name="os0">
                            <option value="Option 1">Option 1 $50.00</option>
                            <option value="Option 2">Option 2 $100.00</option>
                            <option value="Option 3">Option 3 $200.00</option>
                        </select> 
                        <input type="hidden" name="currency_code" value="MYR"/>
                        <button name='submit' className='billButton'> Topup </button>
                    </form>
                </Modal>
            </div>
        );
    }

}

export default Bill;
