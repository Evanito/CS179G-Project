import React, {} from 'react';
import './App.css';
import ApolloClient from 'apollo-boost'
import {ApolloProvider} from "react-apollo"
import Rodal from 'rodal';
import axios from 'axios'
// include styles
import 'rodal/lib/rodal.css';
import Header from './components/Header';
import Timeline from './components/Timeline';
import Upload from './components/Upload';

import Login from './components/Auth/Login';
import Logout from './components/Auth/Logout';

let serverName = "http://evpi.nsupdate.info:14200/";
let tempUser = 1;

const client = new ApolloClient({
  uri: serverName
})



const customStyles = {
  height: 'auto',
  bottom: 'auto',
  width: '50%',
  top: '30%',
};

class App extends React.Component {

  state = {
    upload: false,
    globalUser: -1,
  };

  handleClick = () => {
    this.setState({upload: true})
  }
  hide(){
    this.setState({upload:false})
  }
  onClick = (id) => {
    this.setState({globalUser: id})
    //console.log("globaluserid",this.state.globalUser)

    fetch(serverName+"authenticate", {
      method: 'post',
      headers: new Headers({
        'Authorization': 'Bearer ' + this.state.globalUser
      })
    })

    /* axios.post(serverName+"authenticate", {headers: {
      "Authorization" : `Bearer ${this.state.globalUser}`
    }})
      .then(res => {
        console.log(res.data)
        .catch((error)=>{
          console.log(error)
        })
      }) */
  }

  render() {
    console.log(this.state.upload)
    return (
    <ApolloProvider client={client}>
      <div className="App">
        <Header/>
        <button  onClick={() =>  this.handleClick()}>Upload</button>
        <Login onClick={this.onClick}/>
        <Logout />
        <Timeline globalUser={"John"} loggedUserid={tempUser}/>
        <Rodal customStyles={customStyles} visible = {this.state.upload} onClose={this.hide.bind(this)}>
          <Upload />
        </Rodal>
      </div>
    </ApolloProvider>
  );}
} 

export default App;
