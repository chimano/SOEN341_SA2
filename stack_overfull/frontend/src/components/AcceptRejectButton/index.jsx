// @flow
import React from 'react';
import swal from 'sweetalert';
import { Button } from 'antd';
import './index.css';

type Props = {
  handleReject: number => {},
  handleAccept: number => {},
  answerId: number,
  accepted: boolean,
  rejected: boolean,
};

export default class AcceptRejectButton extends React.Component<Props, {}> {
  reject() {
    const { handleReject, answerId, rejected } = this.props;
    const textEnding = rejected ? "undo this answer's rejection?" : 'reject this answer?';
    const responseEnding = rejected ? 'is no longer rejected' : 'has been rejected!';
    swal({
      title: 'Please confirm your decision',
      text: `Are you sure that you wish to ${textEnding}`,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal(`This answer ${responseEnding}`, {
          icon: 'success',
        });
        handleReject(answerId);
      } else {
        swal('Your changes have been discarded!');
      }
    });
  }

  accept() {
    const { handleAccept, answerId, accepted } = this.props;
    const textEnding = accepted ? "undo this answer's acceptance?" : 'accept this answer?';
    const responseEnding = accepted ? 'is no longer accepted' : 'has been accepted!';
    swal({
      title: 'Please confirm your decision',
      text: `Are you sure that you wish to ${textEnding}`,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal(`This answer ${responseEnding}`, {
          icon: 'success',
        });
        handleAccept(answerId);
      } else {
        swal('Your changes have been discarded!');
      }
    });
  }

  render() {
    const { accepted, rejected } = this.props;
    return (
      <div className="AcceptRejectButton">
        <Button onClick={() => this.reject()} type="primary">
          {rejected ? <b>Undo Reject</b> : <b>Reject</b>}
        </Button>
        <div>&nbsp;</div>
        <Button onClick={() => this.accept()} type="primary">
          {accepted ? <b>Undo Accept</b> : <b>Accept</b>}
        </Button>
      </div>
    );
  }
}
