import React from 'react';
const Input = (props) => (
    <input
      type="file"
      accept=".jpg,.png"
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
            const form = new FormData()
            form.append(
            "file",
            this.state.targetFile,
            this.state.targetFile.name,
            );
            this.setState({upload:false})
            console.log("state",this.state.targetFile)
            console.log("caption", this.state.caption);}
            //DO POST REQUEST HERE
            document.getElementById("cap").reset()
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