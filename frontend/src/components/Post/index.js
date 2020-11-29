import "./Post.css"
import React, { Component, useRef } from "react";
import sp from '../../Images/sample.png';
import av from '../../Images/avatar.png';
const fakeimage = sp;
const caption = "caption";
let serverName = "http://evpi.nsupdate.info:14200/";

function getName(){
    return fetch(serverName + 'user?id=1234')
            .then((response) => response.json())
            .then(data => data.data[0].username)
}

function getImage(){
    let endpoint = 'image/'
    return fetch(serverName + endpoint + '696969').then((response) => response.blob())
    .then(data => data)
}

function getAll(){
    return Promise.all([getName(), getImage()])
}

class Post extends React.Component {
    name;
    constructor(props){
        super(props)
        this.state = {
            name: "person",
            image: sp,
            userpic: av,
            caption: "caption",
            comments: "test",
            postid: null,
            newComment: null,
        };
        getAll()
            .then(([username, userImage]) => {
                this.setState({name: username});
                this.setState({image:URL.createObjectURL(userImage)})
                console.log("name ",username)
                console.log("Image ", userImage)
            })
    }
    onTextChange = event =>{
        //console.log("on change", event.target.value)
        this.setState({newComment: event.target.value})
    }
    onComment = () => {
        if(this.state.newComment){
            document.getElementById("comm").reset()
            console.log("Comment", this.state.newComment)
            //PUT COMMAND GOES HERE
            //GET THE NEW UPDATES COMMENTS HERE
        }
    }
    render(){
        return(
            <article className="Post" ref="Post">
                <header>
                    <div className="Post-user">
                    <div className="Post-user-avatar">
                        <img src={this.state.userpic} alt={this.state.name} />
                    </div>
                    <div className="Post-user-nickname">
                        <span>{this.state.name}</span>
                    </div>
                    </div>
                </header>
                <div className="Post-image">
                    <div className="Post-image-bg">
                    <img src={this.state.image} />
                    </div>
                </div>
                <div className="Post-caption">
                    <strong>{this.state.name}</strong> {this.state.caption}
                </div>
                <div className="Post-comment">
                    {this.state.comments}
                </div>
                <div className="Post-add-comment">
                    <form id="comm">
                        <input type="text" placeholder="Comment on this post" size="30" onChange={this.onTextChange}/>
                    </form>
                    <button onClick={this.onComment} disabled={this.state.newComment === null}>Comment</button>
                </div>
        </article>
        );
    }
    
 }
export default Post;