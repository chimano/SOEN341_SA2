import React from 'react';
import "./index.css";

export class VotingButtons extends React.Component{


  render(){

    const{

      handleUpvoteButton,
      handleDownvoteButton,
      a_id,
      a_points

    } = this.props;

    return(
      <table className="votingArea">
          <tbody>
            <tr>
              <td>
                <button className="votes"
                onClick={() => this.handleDownvoteButton(a_id)}
                >
                -
                </button>
              </td>
              <td>
                <div>{a_points} vote(s)</div>
              </td>
              <td>
                <button className="votes"
                onClick={() => this.handleUpvoteButton(a_id)}
                >
                +
                </button>
              </td>
            </tr>
          </tbody>
        </table>
    );
  }
}