import React from "react";
import "./index.css";
import { Icon } from "antd";

export class VotingButtons extends React.Component {
  
  render() {
    const { handleUpvoteButton, 
      handleDownvoteButton, 
      id, 
      points,
      upvoted_array,
      downvoted_array,
      question_buttons,
      answer_buttons
    } = this.props;

    
    let button_class_UP;
    let button_class_DOWN;

    if (upvoted_array.indexOf(id) != -1) {
      button_class_UP = "VotingButtons--selected";
      button_class_DOWN = "VotingButtons--default";
    } else if (downvoted_array.indexOf(id) != -1) {
      button_class_UP = "VotingButtons--default";
      button_class_DOWN = "VotingButtons--selected";
    }else {
      button_class_UP = "VotingButtons--default";
      button_class_DOWN = "VotingButtons--default";
    }
    
    console.log("UP Button className: "+button_class_UP);
    console.log("DOWN Button className: "+button_class_DOWN);
    console.log("UPVOTED ARRAY VB:"+upvoted_array);
    console.log("DOWNVOTED ARRAY VB:"+downvoted_array);

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
