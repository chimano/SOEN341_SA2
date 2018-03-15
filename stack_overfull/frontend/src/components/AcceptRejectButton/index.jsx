import React from "react";
import swal from "sweetalert";
import "./index.css";
import { Button } from "antd";

export class AcceptRejectButton extends React.Component {
  reject() {
    const { handleReject, a_id } = this.props;
    swal({
      title: "Please confirm your decision",
      text: "Are you sure that you wish to reject this answer?",
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        swal("This answer has been rejected!", {
          icon: "success"
        });
        handleReject(a_id);
      } else {
        swal("Your changes have been discarded!");
      }
    });
  }

  accept() {
    const { handleAccept, a_id } = this.props;
    swal({
      title: "Please confirm your decision",
      text: "Are you sure that you wish to accept this answer?",
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        swal("This answer has been accepted!", {
          icon: "success"
        });
        handleAccept(a_id);
      } else {
        swal("Your changes have been discarded!");
      }
    });
  }

  render() {
    return (
      <div className="AcceptRejectButton">
        <Button onClick={() => this.reject()} type="primary">
          Reject
        </Button>
        <div>&nbsp;</div>
        <Button onClick={() => this.accept()} type="primary">
          Accept
        </Button>
        {/* <button className="button" onClick={() => this.reject()}>
          Reject
        </button>
        <button className="button" onClick={() => this.accept()}>
          Accept
        </button> */}
      </div>
    );
  }
}
