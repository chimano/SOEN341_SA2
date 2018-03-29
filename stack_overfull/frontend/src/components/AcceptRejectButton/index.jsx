// @flow
import React from 'react';
import swal from 'sweetalert';
import { Button } from 'antd';
import './index.css';

type Props = {
  handleReject: number => {},
  handleAccept: number => {},
  answerId: number,
};

export default class AcceptRejectButton extends React.Component<Props, {}> {
  reject() {
    const { handleReject, answerId } = this.props;
    swal({
      title: 'Please confirm your decision',
      text: 'Are you sure that you wish to reject this answer?',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal('This answer has been rejected!', {
          icon: 'success',
        });
        handleReject(answerId);
      } else {
        swal('Your changes have been discarded!');
      }
    });
  }

  accept() {
    const { handleAccept, answerId } = this.props;
    swal({
      title: 'Please confirm your decision',
      text: 'Are you sure that you wish to accept this answer?',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal('This answer has been accepted!', {
          icon: 'success',
        });
        handleAccept(answerId);
      } else {
        swal('Your changes have been discarded!');
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
      </div>
    );
  }
}
