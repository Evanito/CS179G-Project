//import "./Timeline.css"
import React, { } from "react";
import axios from 'axios'
import Post from "../Post"
let serverName = "http://evpi.nsupdate.info:14200/";
class Explore extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            userid: this.props.userid,
            loggedUserid: this.props.loggedUserid,
            globalUser: this.props.globalUser, 
            index: this.props.index,

            // Profile info added by Matt.
            name: null,
            globalUser: this.props.globalUser,
            profileView: this.props.profileView,
            image: null,
            userpic: null,
            
            follows: 0,
            followed: true,

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
        console.log("Constructor explore")
        this.fetchData()
    }
    fetchData(){
        //get list of all post ids
        //console.log("auth: ", this.state.auth)
        //console.log("profile id ", this.state.userid)
        this.setState({post:[]})
        axios.get(serverName +'explore',{
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
            //console.log("postid: ", this.state.requests)
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

    onFollow = () => {
        if (this.state.followed == true) {
            this.setState({follows: this.state.follows + 1})
            this.setState({followed: false})
        }

        else {
            this.setState({follows: this.state.follows - 1})
            this.setState({followed: true})
        }
    }

    componentDidUpdate (prevProps) {
        if(this.props.auth !== prevProps.auth){
            this.setState({auth: this.props.auth})
            //console.log("update auth: ", this.props.auth)
            //console.log("old auth: ", prevProps.auth)
            //console.log("Update auth explore")
        }
    }

    render(){
        return(
            <article>
                <div>
                </div>
                <div className="Post">
                    {this.state.post.map(post => <Post postid={post.postid} globalUser={post.globalUser} profileView={this.state.profileView}onClick={this.props.onClick} auth={this.state.auth}/>)}
                </div>
            </article>
        )
    }
    

}
export default Explore