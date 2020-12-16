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
    constructor(props){
        super(props)
        this.state = {
            preview: null,
            targetFile: null,
            caption: null,
            authtoken: this.props.authtoken,
        }
        //console.log("upload auth", this.state.authtoken)
    }
    onFileChange = event =>{
        //console.log("on change", event.target.name)
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
                'file', this.state.targetFile,
            )
            form.append(
                'caption',this.state.caption
            )
            this.setState({upload:false})
            //console.log("state",this.state.targetFile)
            //console.log("caption", this.state.caption);
            console.log("upload token", this.state.authtoken)
            document.getElementById("cap").reset()
            //DO POST REQUEST HERE
            fetch(serverName + 'upload',{
                method: 'post',
                body: form,
                headers: new Headers({
                    'Authorization': 'Bearer ' + this.state.authtoken
                })
            })
                .then(res => res.json())
                .then(res => {
                    console.log("upload",res)
                    //get the post id form here
                })
            this.setState({preview:null})
            this.setState({targetFile:null})
        }
    }
    /* static getDerivedStateFromProps(props, state) {
        console.log("getDerivedStateFromProps", props.authtoken);
        return {
          authtoken: props.authtoken,
        };
      } */
    componentDidUpdate(prevProps){
        if(this.props.authtoken !== prevProps.authtoken){
            this.setState({authtoken: this.props.authtoken})
            //console.log("update authtoken: ", this.props.authtoken)
            //console.log("old authtoken: ", prevProps.authtoken)
            //console.log("Update authtoken UPLOAD", this.state.authtoken)
        }
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