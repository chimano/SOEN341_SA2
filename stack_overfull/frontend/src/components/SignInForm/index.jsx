// @flow
import React from 'react';
import { Form, Icon, Input, Button, message } from 'antd';
import './index.css';
import { postApiUserLogin } from '../../utils/api';

const FormItem = Form.Item;

type Props = {
  form: Object,
  handleLogin: (string) => {},
  handleCloseButton: () => {},
};

type State = {};

class SignInForm extends React.Component<Props, State> {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.doUserLoginRequest(values.userName, values.password);
      }
    });
  };

  doUserLoginRequest = (username, password) => {
    postApiUserLogin(username, password)
      .then((response) => {
        const { handleLogin, handleCloseButton } = this.props;
        if (response.data.error) {
          message.error(response.data.error);
        } else {
          message.success('Successfully signed in');
          handleLogin(response.data.username);
          handleCloseButton();
        }
      })
      .catch((e) => {
        message.error(e.response.data.error);
      });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { handleCloseButton } = this.props;

    return (
      <Form onSubmit={this.handleSubmit} className="SignInForm">
        <div
          className="SignInForm__close-button"
          onClick={() => handleCloseButton()}
          onKeyPress={() => handleCloseButton()}
          role="button"
          tabIndex={0}
        >
          &#10005;
        </div>
        <h3>Sign In</h3>
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(<Input
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Username"
            required
          />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(<Input
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="Password"
          />)}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" className="SignInForm__submit-button">
            Sign In
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const SignInFormWindow = Form.create()(SignInForm);
export default SignInFormWindow;
