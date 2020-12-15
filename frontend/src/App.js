import React, {} from 'react';
import './App.css';
import ApolloClient from 'apollo-boost'
import {ApolloProvider} from "react-apollo"
import Rodal from 'rodal';
// include styles
import 'rodal/lib/rodal.css';
import Header from './components/Header';
import Timeline from './components/Timeline';
import Upload from './components/Upload';


let serverName = "http://evpi.nsupdate.info:14200/user";
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
        <button  onClick={() =>  this.handleClick()}>Upload</button>
        <Timeline globalUser={"John"} loggedUserid={tempUser}/>
        <Rodal customStyles={customStyles} visible = {this.state.upload} onClose={this.hide.bind(this)}>
          <Upload />
        </Rodal>
      </div>
    </ApolloProvider>
  );}
} 

export default App;
