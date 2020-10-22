import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//this is temporary and will need to get updated
let endpoint = 'https://localhost:5000/'

var buttonStyle = {
    margin: '10px 10px 10px 0'
};

class Screen extends React.Component{
    
    //Add the hook to the server here to check client/server comms
    handleClick(){
        alert('Clicked');

        //this will create an async request to the server
        //when activating this, the handleClick() must be changed to async handleClick()
        //update the endpoint variable above when the server endpoint is secured
        /*
        let url = new URL(endpoint + 'test');
        let response = await fetch(url);
        let result = await response.json()
        console.log(response);
        alert(result.item[0].data);
        */
    }

    render(){
        return(
            <button 
            onClick={()=>this.handleClick()}
            style = {buttonStyle}
            >Talk to server</button>
        )
    }
}




// ========================================

ReactDOM.render(
<Screen />,
document.getElementById('root')
)