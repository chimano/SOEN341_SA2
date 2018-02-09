import swal from 'sweetalert';


class AcceptRejectButton extends React.Component  {
  handleReject() {
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

  handleAccept() {
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
    } else {
      swal("Your changes have been discarded!");
    }
  });
  }
 
render() {
  return (
    <div className='app'>
      <p><h1>This is the answer to your question!</h1></p>
      <h3>Do you wish to accept or reject the above answer?</h3>
        <button
        onClick={() => this.handleAccept()}
      >
        Accept
      </button>
      <button
        onClick={() => this.handleReject()}
      >
        Reject
      </button>      
      </div>
  );
}
}


