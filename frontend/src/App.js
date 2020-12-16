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
import Profile from './components/Profile';
import Login from './components/Auth/Login';
import Logout from './components/Auth/Logout';
import Explore from './components/Explore';

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
    globalUser: 1,
    header: null,
    authtoken:null,
    timelineUser: 1,
    profileUser: -1,
    profileView: false,
    searchBar: null,

    // Added by Matt.
    uploadCheck: false,
  };

  handleClick = () => {
    this.setState({upload: true})
  }
  hide(){
    this.setState({upload:false})
  }
  onClick = (id) => {
    //this.setState({header: new Headers({'Authorization': 'Bearer ' + id})})
    //console.log("onclick")
    this.setState({authtoken: id})
    //console.log("authApp.js",this.state.authtoken)
    fetch(serverName+"authenticate", {
      method: 'post',
      headers: new Headers({
        'Authorization': 'Bearer ' + id
      })
    })
    .then(res => res.json())
    .then(res => {
      //console.log("logged user: ",res)
      this.setState({timelineUser: res.data})
    })
  }

  onLogout = () => {
    this.setState({authtoken:null})
  }

  viewProfile = (id) => {
    console.log("button click: ",id)
    this.setState({profileUser:id})
    this.setState({profileView: true})
  }
  goBack = () => {
    this.setState({profileView:false})
  }
  onTextChange = event =>{
    this.setState({searchBar:event.target.value})
  }
  onSearch = () =>{
    //do search
  }

  uploadCheck = () =>{
    // Check if login matches profile.

  }

  render() {
    //console.log(this.state.upload)
    return (
    <ApolloProvider client={client}>
      <div className="App">
        <Header/>
        <Login onClick={this.onClick}/>
        <Logout onClick={this.onLogout}/>
        <button  onClick={() =>  this.handleClick()} disabled={this.state.profileView}>Upload</button>
        <button disabled={!this.state.profileView} onClick={this.goBack}>Back</button>
        <form id="search">
          <input type="text" placeholder="Search User" onChange={this.onTextChange}/>
        </form>
        <button onClick={this.onSearch} disabled={this.state.searchBar === null}>Search</button>
        {this.state.profileView === true && (
          <Profile globalUser={"John"} userid={this.state.profileUser} profileView = {this.state.profileView} onClick={this.viewProfile}/>
        )}
        {this.state.authtoken !== null && this.state.profileView === false&&(
          <Timeline globalUser={"John"} loggedUserid={this.state.timelineUser} auth={this.state.authtoken} onClick={this.viewProfile}/>
        )}
        {this.state.authtoken === null && this.state.profileView === false &&(
          <Explore onClick={this.viewProfile}/>
        )}
        <Rodal customStyles={customStyles} visible = {this.state.upload} onClose={this.hide.bind(this)}>
          <Upload authtoken={this.state.authtoken}/>
        </Rodal>
      </div>
    </ApolloProvider>
  );}
} 

export default App;
