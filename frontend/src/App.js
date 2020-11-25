import React, { Component, useState } from 'react';
import './App.css';
import ApolloClient from 'apollo-boost'
import {ApolloProvider} from "react-apollo"

import Header from './components/Header';
import Post from './components/Post';
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

class App extends Component {

  state = {
    targetFile: null,
    upload: false,
    preview: null,
  };

  handleClick = (a) => {
    console.log("upload button:",a)
    this.setState({upload: true})
  }

  onFileChange = event =>{
    console.log("on change", event.target.files)
    this.setState({targetFile: event.target.files[0]})
    const objUrl = URL.createObjectURL(event.target.files[0])
    this.setState({preview: objUrl})
  }

  onFileUpload = () => {
    if(this.state.targetFile){
      const form = new FormData()
      form.append(
        "file",
        this.state.targetFile,
        this.state.targetFile.name,
      );
      this.setState({upload:false})
      console.log("state",this.state.targetFile)
      console.log("form", form);}
      //DO POST REQUEST HERE

  }

  FileData = () => {
    if(this.state.targetFile && this.state.upload){
      return(
        <div className="thumbnail-wrapper">
          <img className="thumbnail"src={this.state.preview}/>
        </div>)
    }
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
          {this.state.upload === true && ( 
              <div className="container">
                <Input onChange={this.onFileChange} />
                <button onClick={this.onFileUpload}>Submit</button>
              </div>
          )}
          {this.FileData()}
      </div>
    </ApolloProvider>
  );}
} 

export default App;
