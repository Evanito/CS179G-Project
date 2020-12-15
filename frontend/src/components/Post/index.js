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

function getUserInfo(userId){
    //console.log("USER: " + userId)
    return fetch(serverName + 'user?id=' + userId)
        .then((res) => res.json())
        .then(data => data.data[0])
}

function getPostInfo(postId){
    return axios.get(serverName + 'post/' + postId)
        .then(res => res.data.data)
}

function getImage(postId){
    return fetch(serverName + 'image/' + postId)
        .then(res => res.blob()).then(data => data)
}

function getAll(postid, userid){
    return Promise.all([getUserInfo(userid),getPostInfo(postid), getImage(postid)])
}

class Post extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            name: null,
            globalUser: this.props.globalUser,
            image: null,
            userpic: null,
            caption: null,
            comments: null,
            likes: 0,
            liked: false,
            postid: this.props.postid,
            userid: this.props.userid,
            newComment: null,
            header: this.props.header,
            onClick: this.props.onClick,
        };
        //console.log("sdlfjkhs ", this.state.onClick)
        axios.get(serverName + 'post/' + this.state.postid)
            .then(res => {
                //console.log("DSLKHJJFL: ",res.data.data.userid)
                getAll(this.state.postid,res.data.data.userid)
                    .then(([userinfo,postinfo,pic]) => {
                        //console.log("user", userinfo)
                        console.log("post", postinfo)
                        let tpic = URL.createObjectURL(pic)
                        //let apic = URL.createObjectURL(userinfo.avatar)
                        //console.log("pic", userinfo.avatar)
                        this.setState({userpic:userinfo.avatar})
                        this.setState({name: userinfo.name})
                        this.setState({image:tpic})
                        this.setState({caption:postinfo.description})
                        this.setState({userid:postinfo.userid})
                        this.setState({postid:postinfo.postid})
                        //console.log("Feed test", userinfo)
                    })
            })

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

    onLike = () => {
        if (this.state.liked == true) {
            this.setState({likes: this.state.likes - 1})
            this.setState({liked: false})
        }

        else {
            this.setState({likes: this.state.likes + 1})
            this.setState({liked: true})
        }
    }

    commentsRender = () =>{
        return(
            <div className="Post-comment">
                {this.state.comments}
            </div>
        )
    }
    click = () => {
        console.log("clicked post: ", this.state.userid)
        this.props.onClick(this.state.userid)
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
                        <button onClick={this.click}>{this.state.name}</button>
                    </div>
                    </div>
                </header>
                <div className="Post-image">
                    <div className="Post-image-bg">
                    <img src={this.state.image} />
                    </div>
                </div>

                <div className="Post-likes">
                <button onClick={this.onLike} >Like</button>
                <strong>  {this.state.likes}</strong>
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