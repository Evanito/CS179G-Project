import "./Post.css"
import React, { Component, useRef } from "react";
import av from '../../Images/avatar.png';
const avatar = av;
//const image = sp;
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
            name: null,
            image: null,
            userid: null,
            caption: null,
        };
        getAll()
            .then(([username, userImage]) => {
                this.setState({name: username});
                this.setState({image:URL.createObjectURL(userImage)})
                console.log("name ",username)
                console.log("Image ", userImage)
            })
    }
    render(){
        return(
            <article className="Post" ref="Post">
                <header>
                    <div className="Post-user">
                    <div className="Post-user-avatar">
                        <img src={avatar} alt={this.state.name} />
                    </div>
                    <div className="Post-user-nickname">
                        <span>{this.state.name}</span>
                    </div>
                    </div>
                </header>
                <div className="Post-image">
                    <div className="Post-image-bg">
                    <img alt={caption} src={this.state.image} />
                    </div>
                </div>
                <div className="Post-caption">
                    <strong>{this.state.name}</strong> {caption}
                </div>
        </article>
        );
    }
    
 }
export default Post;