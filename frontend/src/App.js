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

const App = () =>{
  const {
    files,
    pending,
    next,
    uploading,
    uploaded,
    status,
    onSubmit,
    onChange,
  } = useFileHandlers()

  const [upload, setUpload] = useState(true)

  const handleClick = (a) => {
    console.log("upload button:",a)
    setUpload(a)
  }

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Header onClick={() => handleClick(true)}/>
        <section className="App-Feed">
          <Post/>
        </section>
          {upload === true && ( 
            <div className="container">
              <form className="form" onSubmit={onSubmit}>
                {status === 'FILES_UPLOADED' && (
                  <div className="success-container">
                    <div>
                      <h2>Congratulations!</h2>
                      <small>You uploaded your files. Get some rest.</small>
                    </div>
                  </div>
                )}
                <div>
                  <Input onChange={onChange} />
                  <button type="submit">Submit</button>
                </div>
                <div>
                  {files.map(({ file, src, id }, index) => (
                    <div
                    style={{
                      opacity: uploaded[id] ? 0.2 : 1,
                    }}
                    key={`thumb${index}`}
                    className="thumbnail-wrapper"
                    >
                      <img className="thumbnail" src={src} alt="" />
                      <div className="thumbnail-caption">{file.name}</div>
                    </div>
                  ))}
                </div>
              </form>
            </div>
          )}
      </div>
    </ApolloProvider>
  );
} 

export default App;
