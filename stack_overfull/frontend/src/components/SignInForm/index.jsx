import React from "react";
import { Form, Icon, Input, Button, Checkbox } from "antd";
import "./index.css";
import { postApiUserLogin } from "../../utils/api";

const FormItem = Form.Item;

class SignInForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        this.doUserLoginRequest(values.userName, values.password);
      }
    });
  };

  doUserLoginRequest = (username, password) => {
    postApiUserLogin(username, password)
      .then(response => {
        const { handle_login, handle_close_button } = this.props;
        // console.log(
        //   "Received response from the server",
        //   response.request.responseURL,
        //   response
        // );
        if (response.data.error) {
          alert("Wrong username or password");
        } else {
          handle_login(response.data.username);
          handle_close_button();
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { handle_close_button } = this.props;

    return (
      <Form onSubmit={this.handleSubmit} className="SignInForm">
        <div
          className="SignInForm__close-button"
          onClick={() => handle_close_button()}
        >
          &#10005;
        </div>
        <h3>Sign In</h3>
        <FormItem>
          {getFieldDecorator("userName", {
            rules: [{ required: true, message: "Please input your username!" }]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Username"
              required
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "Please input your Password!" }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="Password"
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("remember", {
            valuePropName: "checked",
            initialValue: true
          })(<Checkbox>Remember me</Checkbox>)}
          <a className="SignInForm__forgot-link" href="">
            Forgot password
          </a>
          <Button
            type="primary"
            htmlType="submit"
            className="SignInForm__submit-button"
          >
            Sign In
          </Button>
          Or <a>register now!</a>
        </FormItem>
      </Form>
    );
  }
}

export const SignInFormWindow = Form.create()(SignInForm);
