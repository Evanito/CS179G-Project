import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

var buttonStyle = {
    margin: '10px 10px 10px 0'
};

class Screen extends React.Component{
    
    //Add the hook to the server here to check client/server comms
    handleClick(){
        alert('Clicked');
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