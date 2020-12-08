import axios from 'axios';
import React from 'react';
let serverName = "http://evpi.nsupdate.info:14200/";
const Input = (props) => (
    <input
      type="file"
      accept=".jpg,.png,.jpeg,.gif"
      name="image"
      multiple
      {...props}
    />
  )
export default class Upload extends React.Component{
    state = {
        preview: null,
        targetFile: null,
        caption: null,
    }
    onFileChange = event =>{
        console.log("on change", event.target.name)
        this.setState({targetFile: event.target.files[0]})
        const objUrl = URL.createObjectURL(event.target.files[0])
        this.setState({preview: objUrl})
    }
    onTextChange = event =>{
        console.log("on change", event.target.value)
        this.setState({caption: event.target.value})
    }

    onFileUpload = () => {
        if(this.state.targetFile){
            let form = new FormData()
            form.append(
                'image', this.state.targetFile,
            )
            form.append(
                this.state.caption
            )
            this.setState({upload:false})
            console.log("state",this.state.targetFile)
            console.log("caption", this.state.caption);}
            document.getElementById("cap").reset()
            //DO POST REQUEST HERE
            axios.post(serverName + '/upload')
                .then(res => {
                    console.log(res)
                    //get the post id form here
                })
            this.setState({preview:null})
            this.setState({targetFile:null})
    }
    render(){
        return(
        <div id="overlay" className="container">
            <div className="container-content">
            <Input onChange={this.onFileChange} />
            <form id="cap">
                <input type="text" name="caption" placeholder="Write a caption..." onChange={this.onTextChange}/>
                <button onClick={this.onFileUpload} disabled={this.state.targetFile === null}>Upload</button>
            </form>
            {this.state.preview !== null && (
                <div className="thumbnail-wrapper">
                <img className="thumbnail"src={this.state.preview}/>
            </div>
            )}
            </div>
        </div>
        )
    }
}