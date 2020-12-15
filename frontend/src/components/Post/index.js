import "./Post.css"
import React, { } from "react";
import axios from 'axios'
import styled from 'styled-components'


let serverName = "http://evpi.nsupdate.info:14200/";
const Button = styled.button`
  background-color: white;
  color: black;
  font-size: 14px;
  font-weight: bold,
  padding: 5px 25x;
  border-radius: 0px;
  margin: 0px 0px;
  cursor: pointer;
  border: none,
`;

class Post extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            name: this.props.name,
            globalUser: this.props.globalUser,
            image: this.props.image,
            userpic: null,
            caption: this.props.caption,
            comments: "",
            postid: this.props.postid,
            userid: this.props.userid,
            newComment: null,
        };
        /* getAll()
            .then(([username, userImage]) => {
                this.setState({name: username});
                this.setState({image:URL.createObjectURL(userImage)})
                console.log("name ",username)
                console.log("Image ", userImage)
            }) */
    }
    componentDidUpdate = () =>{
        //this.commentsRender()
    }
    onTextChange = event =>{
        //console.log("on change", event.target.value)
        this.setState({newComment: event.target.value})
    }
    onComment = () => {
        if(this.state.newComment){
            document.getElementById("comm").reset()
            console.log("Comment", this.state.newComment)
            this.setState({comments: this.state.comments + "\n" + this.state.globalUser +': ' + this.state.newComment})
            this.setState({newComment: null})
            //PUT REQUEST GOES HERE
            const comm = {
                data: this.state.newComment
            }
            axios.post(serverName + 'endpoint', {comm})
                .then(res => {
                    console.log(res)
                })
        }
    }
    commentsRender = () =>{
        return(
            <div className="Post-comment">
                {this.state.comments}
            </div>
        )
    }
    
    render(){
        return(
            <article className="Post" ref="Post">
                <header>
                    <div className="Post-user">
                    <div className="Post-user-avatar">
                        <img src={this.state.userpic} />
                    </div>
                    <div className="Post-user-nickname">
                        <Button>{this.state.name}</Button>
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
                {this.commentsRender()}
                <div className="Post-add-comment">
                    <form id="comm">
                        <input type="text" id="newComm" placeholder="Comment on this post" size="30" onChange={this.onTextChange}/>
                    </form>
                    <button onClick={this.onComment} disabled={this.state.newComment === null}>Comment</button>
                </div>
        </article>
        );
    }
    
 }
export default Post;