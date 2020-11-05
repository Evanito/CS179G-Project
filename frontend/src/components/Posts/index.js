import "./Post.css"

import React, { Component } from "react";
class Post extends Component {
    constructor(props){
        super(props);
    }
    render() {
        const image = this.props.image;
        const avatar = this.props.avatar;
        const name = this.props.name;
        const caption = this.props.caption;

        return(
            <article className="Post" ref="Post">
            <header>
                <div className="Post-user">
                <div className="Post-user-avatar">
                    <img src={avatar} alt={name} />
                </div>
                <div className="Post-user-nickname">
                    <span>{name}</span>
                </div>
                </div>
            </header>
            <div className="Post-image">
                <div className="Post-image-bg">
                <img alt={caption} src={image} />
                </div>
            </div>
            <div className="Post-caption">
                <strong>{name}</strong> {caption}
            </div>
            </article>
            )
        }
}
export default Post;