import React, { Component } from 'react';
import './App.css';
import ApolloClient from 'apollo-boost'
import {ApolloProvider} from "react-apollo"

import Header from './components/Header';
import Post from './components/Posts';
import images from './Images/sample.png';
import av from './Images/avatar.png';
let serverName = "http://evpi.nsupdate.info:14200/user";

const client = new ApolloClient({
  uri: serverName
})

class  App extends Component{
  render(){
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <Header/>
          <section className="App-Feed">
            <Post/>
          </section>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
