import React, { Component, useState } from 'react';
import './App.css';
import ApolloClient from 'apollo-boost'
import {ApolloProvider} from "react-apollo"
import Rodal from 'rodal';
// include styles
import 'rodal/lib/rodal.css';
import Header from './components/Header';
import Post from './components/Post';
import Upload from './components/Upload';
import useFileHandlers from './components/FileHandler/useFileHandler'

let serverName = "http://evpi.nsupdate.info:14200/user";

const client = new ApolloClient({
  uri: serverName
})

const Input = (props) => (
  <input
    type="file"
    accept=".jpg,.png"
    name="img-loader-input"
    multiple
    {...props}
  />
)

class App extends React.Component {

  state = {
    upload: false,
  };

  handleClick = () => {
    this.setState({upload: true})

  }
  hide(){
    this.setState({upload:false})
  }

  render() {
    console.log(this.state.upload)
    return (
    <ApolloProvider client={client}>
      <div className="App">
        <Header/>
        <button  onClick={() =>  this.handleClick(true)}>Upload</button>
        <section className="App-Feed">
          <Post/>
        </section>
          <Rodal visible = {this.state.upload} onClose={this.hide.bind(this)}>
            <Upload />
          </Rodal>
      </div>
    </ApolloProvider>
  );}
} 

export default App;
