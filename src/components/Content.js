
import React from "react";
import All from "../assets/images/all.png";
import Burger from "../assets/images/burger.png";
import Salad from "../assets/images/salad.png";
import Pizza from "../assets/images/pizza.png";
import Dessert from "../assets/images/dessert.png";
import Dev from "../assets/images/cms.png";
import Order from "../assets/images/order.gif";
import Modal from 'react-modal';
import ReactDOM from 'react-dom';

class Content extends React.Component {

    constructor(props) {
        super(props);
        this.state = { food: {}, order: {}, allOrder: {}, devModalOpen:null, foodModalOpen:null, orderPlaceModal:null, foodModal:{}, foodModalparent:{} };
    }


    componentDidMount() {
    
        // Retrieve food data 
        let foodRequest = this.props.requestHeader;
        foodRequest['body'] = JSON.stringify({  companyID: this.props.stateData.companyID }) 
        fetch( process.env.REACT_APP_BACKEND_API + 'get/food', foodRequest)
            .then(response => response.json())
            .then(data => this.setState({ food: data }));


        // Retrieve placed order 
        let orderedRequest = this.props.requestHeader;
        orderedRequest['body'] = JSON.stringify({ userID: this.props.stateData.userID });
        fetch(  process.env.REACT_APP_BACKEND_API + 'get/order', orderedRequest)
            .then(response => response.json())
            .then(data => this.setState({ order: data }));


        // Retrieve everyone placed order 
        if(this.props.stateData.isAdmin){
            let allOrderedRequest = this.props.requestHeader;
            allOrderedRequest['body'] = JSON.stringify({ companyID:  this.props.stateData.companyID  }) 
            fetch( process.env.REACT_APP_BACKEND_API + 'get/order', orderedRequest)
                .then(response => response.json())
                .then(data => this.setState({ allOrder: data }));
        }

    }
    

    render() {

        // Function to place food order 
        function placeOrder(foodID, userID, requestHeader){

            // Retrieve food data 
            let orderRequest = requestHeader;
            orderRequest['body'] = JSON.stringify({ foodID:foodID, userID: userID})   ;

            // Create order 
            fetch(process.env.REACT_APP_BACKEND_API +  'create/order', orderRequest)
                .then(response => response.json())
                .then(data => this.setState({ food: data })); 
        }


        return (
            <>
                <div id='contentSection'>
                    <div id='categorySection' onClick={() => this.setState({devModalOpen: true})}>
                        <div className='categoryItem active'>
                            <img src={All}/>
                            <p> All </p>
                        </div>
                        <div className='categoryItem'>
                            <img src={Pizza}/>
                            <p> Pizza </p>
                        </div>
                        <div className='categoryItem'>
                            <img src={Burger}/>
                            <p> Burgers </p>
                        </div>
                        <div className='categoryItem'>
                            <img src={Salad}/>
                            <p> Salads </p>
                        </div>
                        <div className='categoryItem'>
                            <img src={Dessert}/>
                            <p> Desserts </p>
                        </div>
                    </div>
                    
                    {/* 
                    <h1> Your current order </h1>
                    {
                        Object.keys(this.state.order).map((key,index)=>(
                            <div key={key}>
                                <img src={this.state.order[key].food.image}/>
                                Order ID : {this.state.order[key].order_id}
                                Name : {this.state.order[key].food.name}
                                Description : {this.state.order[key].food.description}
                                Status : Delivering
                                Price : {this.state.order[key].price}
                            </div>
                        ))
                    } */}
                    <div  id='foodListSection'>
                    {
                        Object.keys(this.state.food).map((key, index)=>(
                            <>
                                {/* <h2>
                                    {this.state.food[key].name}
                                </h2>
                                <p>
                                    {this.state.food[key].description}
                                </p> */}
                                {
                                    (this.state.food[key].food !== undefined)?
                                    Object.keys(this.state.food[key].food).map((foodKey, foodIndex)=>(
                                    <div className='foodItem' key={foodKey} onClick={() => this.setState({foodModalOpen: true, foodModal:this.state.food[key].food[foodKey], foodModalParent:this.state.food[key]})}>
                                        <div className='foodItemImg' style={{ background : 'url(' + this.state.food[key].food[foodKey].image +') no-repeat top left'}} ></div>
                                        <div className='foodItemContent'>
                                            <h4>
                                                {this.state.food[key].food[foodKey].name}
                                            </h4>
                                            <p>
                                                {this.state.food[key].food[foodKey].description}
                                            </p>
                                            <span>
                                                ${this.state.food[key].food[foodKey].price}
                                            </span>
                                        </div>
                                      
                                    </div>
                                    )) : <></>
                                }
                            </>
                        ))
                    }
                    </div>
                </div>
                <Modal id='devModal' isOpen={this.state.devModalOpen} >
                    <button className='modalCloseBtn' onClick={() => this.setState({devModalOpen: false})}>✖</button>
                    <img src={Dev}/>
                    <h1> Filter function is not currently supported </h1>
                </Modal>
                <Modal id='foodModal' isOpen={this.state.foodModalOpen} >
                    <button className='modalCloseBtn' onClick={() => this.setState({foodModalOpen: false})}>✖</button>
                    <img src={(this.state.foodModal !== undefined)?this.state.foodModal.image: null}/>
                   
                    <h4>
                        {(this.state.foodModal !== undefined)?this.state.foodModal.name: null}
                    </h4>
                    <p>
                        {(this.state.foodModal !== undefined)?this.state.foodModal.description: null}
                    </p>
                    <div className='orderSection'>
                        <span>
                            ${(this.state.foodModal !== undefined)?this.state.foodModal.price: null}
                        </span>
                        <button className='place-order' onClick={() => {placeOrder((this.state.foodModal !== undefined)?this.state.foodModal.id: null,  this.props.stateData.userID, this.props.requestHeader);  this.setState({foodModalOpen: false});  this.setState({orderPlaceModal: true});  }}> Place Order </button> 
                    </div>
                    <div className='toyouknowSection'>
                        <h2> Do you know ? </h2>
                        <p> By eating this vegetarian meal, you can save nearly <b>1.92 kg of CO2</b> per year, which actually contributes a lot to climate change! Keep it up and save our earth !</p> 
                    </div>
                </Modal>
                <Modal id='orderPlacedModal' isOpen={this.state.orderPlaceModal} >
                    <button className='modalCloseBtn' onClick={() => this.setState({orderPlaceModal: false})}>✖</button>
                    <img src={Order}/>
                    <h1> Order Placed </h1>
                </Modal>
            </>
        );
    }

}

export default Content;
