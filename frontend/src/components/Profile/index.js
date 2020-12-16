//import "./Timeline.css"
import React, { } from "react";
import axios from 'axios'
import Post from "../Post"
let serverName = "http://evpi.nsupdate.info:14200/";
class Profile extends React.Component {
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
            
            followText: "Follow",
            followed: false,

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
        //console.log("auth: profile", this.props.auth)
        //console.log("profile id ", this.state.userid)
        this.setState({post:[]})
        axios.get(serverName +'userfeed/' + this.state.userid,{
            params:{
                page: this.state.index,
            },
        })
        .then(res => {
            //console.log("Profile ", res)
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
        fetch(serverName+'followed?targetid='+this.state.userid,{
            method:'get',
            headers: new Headers({
                'Authorization': 'Bearer ' + this.state.auth
            })
        })
        .then(res => res.json())
        .then(res =>{
            console.log("follow check", res)
            this.setState({followed: res.followed})
            if(res.followed){
                this.setState({followText: "Unfollow"})
            }
            else{
                this.setState({followText: "Follow"})
            }
        })
    }

    onFollow = () => {
        if (this.state.followed == false) {
            this.setState({followed: true})
            this.setState({followedText: "Unfollow"})
            //console.log("follow auth", this.state.auth)
            
            // this.setState({followed: false})
            fetch(serverName + 'follow?targetid=' + this.state.userid, {
                method:'post',
                headers: new Headers({
                    'Authorization': 'Bearer ' + this.state.auth
                })
            })
            .then(res => res.json())
            .then(res => {
                console.log("follow return",res)
            })
        }

        else {
            // this.setState({followed: true})
            this.setState({followed: false})
            this.setState({followedText: "Follow"})
            fetch(serverName + 'unfollow?targetid=' + this.state.userid, {
                method:'post',
                headers: new Headers({
                    'Authorization': 'Bearer ' + this.state.auth
                })
            })
            .then(res => res.json())
            .then(res => {
                console.log("follow return",res)
            })
        }
    }

    componentDidUpdate(prevProps){
        if(this.props.auth !== prevProps.auth){
            this.setState({auth: this.props.auth})
            //console.log("update auth: ", this.props.auth)
            //console.log("old auth: ", prevProps.auth)
            console.log("Update auth follow",this.props.auth)
        }
    }

    render(){
        return(
            <article>
                <div>
                <button onClick={this.onFollow} >{this.state.followText}</button>
                </div>
                <div className="Post">
                    {this.state.post.map(post => <Post postid={post.postid} globalUser={post.globalUser} profileView={this.state.profileView}onClick={this.props.onClick} auth={this.state.auth}/>)}
                </div>
            </article>
        )
    }
    

}
export default Profile