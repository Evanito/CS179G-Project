import React from 'react';
const Input = (props) => (
    <input
      type="file"
      accept=".jpg,.png"
      name="img-loader-input"
      multiple
      {...props}
    />
  )
export default class Upload extends React.Component{
    state = {
        preview: null,
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
            this.setState({preview:null})
            //DO POST REQUEST HERE
    }
    render(){
        return(
        <div id="overlay" className="container">
            <div className="container-content">
            <Input onChange={this.onFileChange} />
            <button onClick={this.onFileUpload}>Submit</button>
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