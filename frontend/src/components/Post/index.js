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
    return fetch(serverName + 'image/' + parseInt(postId))
        .then(res => res.blob()).then(data => data)
}

function getComments(postid){
    return fetch(serverName +'comments/' + postid)
        .then(res => res.json())
        .then(res => res.data)
}

function getAll(postid, userid){
    return Promise.all([getUserInfo(userid),getPostInfo(postid), getImage(postid), getComments(postid)])
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
            auth: this.props.auth,
            
            profileView: this.props.profileView,
        };
        console.log("haha yes", this.state.profileView)
        axios.get(serverName + 'post/' + this.state.postid)
            .then(res => {
                //console.log("DSLKHJJFL: ",res.data.data.userid)
                getAll(this.state.postid,res.data.data.userid, this.state.postid)
                    .then(([userinfo,postinfo,pic, commentinfo]) => {
                        //console.log("user", userinfo)
                        //console.log("post", postinfo)
                        let tpic = URL.createObjectURL(pic)
                        //let apic = URL.createObjectURL(userinfo.avatar)
                        this.setState({comments: commentinfo})
                        this.setState({userpic:userinfo.avatar})
                        this.setState({name: userinfo.name})
                        this.setState({image:tpic})
                        this.setState({caption:postinfo.description})
                        this.setState({userid:postinfo.userid})
                        this.setState({postid:postinfo.postid})
                        console.log("comment info",commentinfo)
                    })
            })

    }
    componentDidUpdate (prevProps) {
        if(this.props.profileView !== prevProps.profileView){
            this.setState({auth: this.props.profileView})
            //console.log("update auth: ", this.props.auth)
            //console.log("old auth: ", prevProps.auth)
            console.log("Update profileView")
            // this.fetchData(this.props.profileView)
        }
    }
    onTextChange = event =>{
        //console.log("on change", event.target.value)
        this.setState({newComment: event.target.value})
    }
    onComment = () => {
        if(this.state.newComment){
            document.getElementById("comm").reset()
            //console.log("Comment", this.state.newComment)
            let temp = {
                "comment": this.state.newComment,
                "name": this.state.name,
            }
            this.setState({comments: this.state.comments.concat(temp)})
            this.setState({newComment: null})
            //PUT REQUEST GOES HERE
            let form = new FormData()
            form.append(
                'data', this.state.newComment,
            )
            form.append(
                'postid', parseInt(this.state.postid),
            )
            console.log("Comment form", form)
            fetch(serverName + 'comment', {
                method:'post',
                body: form,
                headers: new Headers({
                    'Authorization': 'Bearer ' + this.state.auth
                })
            })
            .then(res => res.json())
            .then(res => {
                console.log("comment return",res)
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
        //console.log("commentinfo: ", this.state.comments)
        if(this.state.comments !== null){
            return(
                <div className="Post-comment">
                    {this.state.comments.map(comment => 
                    (<div className = "Comments">
                        <strong>{comment.name}</strong> {comment.comment}
                    </div>))}
                </div>
            )
        }
        else
            return(
                <div className = "Post-comment"></div>
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
                        <button onClick={this.click} disabled={this.state.profileView}>{this.state.name}</button>
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