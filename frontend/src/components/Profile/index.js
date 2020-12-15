//import "./Timeline.css"
import React, { } from "react";
import axios from 'axios'
import Post from "../Post"
let serverName = "http://evpi.nsupdate.info:14200/";
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
            header: this.props.header,
            auth: this.props.auth,
            //onClick: this.props.onClick,
            /* name: null,
            capt: null,
            userid: null,
            image: null,
            postid: null */
            //this will contain ready to be mapped post components
        }
        console.log("Constructor")
        this.fetchData()
    }
    fetchData(){
        //get list of all post ids
        //console.log("auth: ", this.state.auth)
        console.log("profile id ", this.state.userid)
        this.setState({post:[]})
        axios.get(serverName +'userfeed/' + this.state.userid,{
            params:{
                page: this.state.index,
            },
        })
        .then(res => {
            console.log("Profile ", res)
            this.setState({requests: res.data.data.map(Number)})
            //iterate through all post ids to get relevant data
            //need the following
            //username, caption, userid, postid,and image
            console.log("postid: ", this.state.requests)
            for(let i = 0; i < this.state.requests.length; i++){
                let temp = {
                    postid: this.state.requests[i],
                    globalUser: this.state.globalUser,
                }
                let updateFeed = this.state.post.concat(temp)
                this.setState({post:updateFeed})        
            }
        })

    }
    render(){
        return(
            <div className="Post">
                {this.state.post.map(post => <Post postid={post.postid} globalUser={post.globalUser} onClick={this.props.onClick}/>)}
            </div>
        )
    }
    

}
export default Timeline