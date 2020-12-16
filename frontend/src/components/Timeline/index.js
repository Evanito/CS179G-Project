import "./Timeline.css"
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
        if(this.state.auth !== null){
            this.fetchData()
        }
    }
    fetchData(){
        //get list of all post ids
        //console.log("auth fetch: ", this.state.auth)
        this.setState({post:[]})
        fetch(serverName +'timeline',{
            method: 'get',
            headers: new Headers({
                'Authorization': 'Bearer ' + this.state.auth
              })
        })
        .then(res => res.json())
        .then(res => {
            //console.log("timeline return: ", res)
            this.setState({requests: res.data.map(Number)})
            //iterate through all post ids to get relevant data
            //need the following
            //username, caption, userid, postid,and image
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
    //ADD THIS BACK IN WHEN AUTH IS READY
    componentDidUpdate(prevProps){
        if(this.props.auth !== prevProps.auth){
            this.setState({auth: this.props.auth})
            //console.log("update auth: ", this.props.auth)
            //console.log("old auth: ", prevProps.auth)
            console.log("Update auth timeline")
            if(this.props.auth !== null){
                this.fetchData()
            }
        }
        if(this.props.loggedUserid !== prevProps.loggedUserid){
            console.log("Update user timeline")
            this.setState({loggedUserid:this.props.loggedUserid})
            this.fetchData()
        }
    }

    render(){
        return(
            <div className="Post">
                {this.state.post.map(post => <Post postid={post.postid} globalUser={post.globalUser} onClick={this.props.onClick} auth={this.state.auth}/>)}
            </div>
        )
    }
    

}
export default Timeline