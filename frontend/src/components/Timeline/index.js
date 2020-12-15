import "./Timeline.css"
import React, { } from "react";
import axios from 'axios'
import Post from "../Post"
let serverName = "http://evpi.nsupdate.info:14200/";

function getUserInfo(userId){
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

class Timeline extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            userid: this.props.userid,
            loggedUserid: this.props.loggedUserid,
            globalUser: this.props.globalUser, 
            index: this.props.index,
            requests: [], //list of all postid to fetch from the server
            post: [],
            /* name: null,
            capt: null,
            userid: null,
            image: null,
            postid: null */
            //this will contain ready to be mapped post components
        }
        //get list of all post ids
        axios.get(serverName +'timeline/' + this.state.loggedUserid,{
            params:{
                page: this.state.index,
            }
        })
        .then(res => {
            this.setState({requests: res.data.data.map(Number)})
            //iterate through all post ids to get relevant data
            //need the following
            //username, caption, userid, postid,and image
            for(let i = 0; i < this.state.requests.length; i++){
                //get post info
                axios.get(serverName + 'post/' + this.state.requests[i])
                    .then(res => {
                        //console.log("testste",this.state.requests[i])
                        let userid = res.data.data.userid
                        
                        getAll(this.state.requests[i],userid)
                            .then(([userinfo,postinfo,pic]) => {
                                //console.log("user", userinfo)
                                //console.log("post", postinfo)
                                let tpic = URL.createObjectURL(pic)
                                console.log("pic", tpic)
                                let temp = {
                                    name: userinfo.name,
                                    capt: postinfo.description,
                                    userid: postinfo.userid,
                                    image: tpic,
                                    postid: this.state.requests[i]
                                }
                                console.log("Feed test", temp)
                                let updateFeed = this.state.post.concat(temp)
                                this.setState({post:updateFeed})
                            })
                    })
                }
            })
    }
    componentDidMount(){
    }

    render(){
        return(
            <div className="Post">
                {this.state.post.map(post => <Post name={post.name} image={post.image} caption={post.capt} postid={post.postid} globalUser={this.state.globalUser}/>)}
            </div>
        )
    }
    

}
export default Timeline