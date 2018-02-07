import React from 'react';
import {Form, Icon, Input, Button, Checkbox} from 'antd';
import './index.css';

const FormItem = Form.Item;

class SignInForm extends React.Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this
      .props
      .form
      .validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
  }

  render() {

    const {getFieldDecorator} = this.props.form;
    const handle_close_button = this.props.handle_close_button;

    return (

      <Form onSubmit={this.handleSubmit} className="login-form">
        <div className="close-button" onClick={() => handle_close_button()}>&#10005;</div>
        <span>Sign In</span>
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [
              {
                required: true,
                message: 'Please input your username!'
              }
            ]
          })(
            <Input
              prefix={< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)' }}/>}
              placeholder="Username"
              required/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Please input your Password!'
              }
            ]
          })(
            <Input
              prefix={< Icon type = "lock" style = {{ color: 'rgba(0,0,0,.25)' }}/>}
              type="password"
              placeholder="Password"/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true
          })(
            <Checkbox>Remember me</Checkbox>
          )}
          <a className="login-form-forgot" href="">Forgot password</a>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Sign In
          </Button>
          Or
          <a>register now!</a>
        </FormItem>
      </Form>
    );
  }
}

export const SignInFormWindow = Form.create()(SignInForm);