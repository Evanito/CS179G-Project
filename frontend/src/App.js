import React, { Component } from 'react';
import './App.css';
import Header from './components/Header';
import Post from './components/Posts';
import images from './Images/sample.png';
import av from './Images/avatar.png';

class  App extends Component{
  render(){
    return (
      <div className="App">
        <Header/>
        <section className="App-Feed">
          <Post name="123" avatar={av} image={images} caption="car"/>
          <Post name="123" avatar={av} image={images} caption="car"/>
        </section>
      </div>
    );
  }
}

export default App;
