import React from 'react';
import swal from 'sweetalert';
import "./index.css";

export class AcceptRejectButton extends React.Component {
  Reject() {
    swal({
      title: "Please confirm your decision",
      text: "Are you sure that you wish to reject this answer?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          swal("This answer has been rejected!", {
            icon: "success",
          });
        } else {
          swal("Your changes have been discarded!");
        }
      });
  }

  Accept() {
    swal({
      title: "Please confirm your decision",
      text: "Are you sure that you wish to accept this answer?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          swal("This answer has been accepted!", {
            icon: "success",
          });
          handleAccept
        } else {
          swal("Your changes have been discarded!");
        }
      });
  }

  render() {
    return (
      <div className='app'>
        <button
          onClick={() => this.handleReject()}
        >
          Reject
      </button>
        <button
          onClick={() => this.handleAccept()}
        >
          Accept
      </button>
      </div>
    );
  }
}


