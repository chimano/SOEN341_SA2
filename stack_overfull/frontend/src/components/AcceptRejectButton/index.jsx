import React from 'react';
import swal from 'sweetalert';
import "./index.css";

export class AcceptRejectButton extends React.Component {
  Reject() {
    const {handleReject, a_id} = this.props;
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
          handleReject(a_id);
        } else {
          swal("Your changes have been discarded!");
        }
      });
  }

  Accept() {
    const {handleAccept, a_id} = this.props;
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
          handleAccept(a_id);
        } else {
          swal("Your changes have been discarded!");
        }
      });
  }

  render() {
    return (
      <div className='app'>
        <button
          onClick={() => this.Reject()}
        >
          Reject
      </button>
        <button
          onClick={() => this.Accept()}
        >
          Accept
      </button>
      </div>
    );
  }
}


