import React from "react";
import "./index.css";
import { Icon } from "antd";

export class VotingButtons extends React.Component {
  render() {
    const { handleUpvoteButton, 
      handleDownvoteButton, 
      id, 
      points,
      upvoted,
      downvoted
    } = this.props;

   //console.log("upvoted button: "+upvoted);
    //console.log("downvoted button: "+downvoted);

    let button_class_UP;
    let button_class_DOWN;
    if(upvoted){
      button_class_UP = "VotingButtons--selected";
      button_class_DOWN = "VotingButtons--default";
      console.log("upvoted button: "+upvoted);
    } else if(downvoted){
      button_class_UP = "VotingButtons--default";
      button_class_DOWN = "VotingButtons--selected";
      console.log("downvoted button: "+downvoted);
    } else{
      button_class_UP = "VotingButtons--default";
      button_class_DOWN = "VotingButtons--default";
      console.log("buttons: user has not voted/is not logged in");
    }

    console.log("UP Button className: "+button_class_UP);
    console.log("DOWN Button className: "+button_class_DOWN);

    return (
      <div className="VotingButtons">
        <button 
          className={"VotingButtons__button "+button_class_UP+" button"} 
          onClick={() => handleUpvoteButton(id)}>
            <Icon type="caret-up" />
        </button>
        <div className="VotingButtons__votes">
          <div className="VotingButtons__votes__text">&nbsp;{points}</div>
        </div>
        <button 
          className={"VotingButtons__button "+button_class_DOWN+" button"} 
          onClick={() => handleDownvoteButton(id)}>
          <Icon type="caret-down" />
        </button>
      </div>
    );
  }
}
