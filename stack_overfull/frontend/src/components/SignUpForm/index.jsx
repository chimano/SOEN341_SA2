import React from "react";
import "./index.css";
import { Form, Input, Tooltip, Icon, Checkbox, Button } from "antd";
import { postApiUserRegister } from "../../utils/api";

const FormItem = Form.Item;

class SignUpForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: []
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        this.doUserRegisterRequest(values.username, values.password, values.email);
      }
    });
  };
  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!");
    } else {
      callback();
    }
  };
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  doUserRegisterRequest(username, password, email) {
    postApiUserRegister(username, password, email).then(response => {
      this.onUserRegisterResponse(response);
    });
  }

  onUserRegisterResponse(response) {
    const { handle_close_button, handle_login } = this.props;
    console.log(
      "Received response from the server",
      response.request.responseURL,
      response
    );
    console.log("Received user info", response.data);
    if (!response.data.error) {
      handle_close_button();
      handle_login(response.data.username);
    } else {
      alert(response.data.error);
    }
  }

  render() {
    const { handle_close_button } = this.props;
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };

    return (
      <Form onSubmit={this.handleSubmit} className="SignUpForm">
        <div className="SignUpForm__close-button" onClick={() => handle_close_button()}>
          &#10005;
        </div>

        <h3>Register</h3>

        {/* Username */}
        <FormItem
          {...formItemLayout}
          label={
            <span>
              Username&nbsp;
              <Tooltip title="What do you want others to call you?">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator("username", {
            rules: [
              {
                required: true,
                message: "Please input your nickname!",
                whitespace: true
              }
            ]
          })(<Input />)}
        </FormItem>

        {/* Email */}
        <FormItem {...formItemLayout} label="E-mail">
          {getFieldDecorator("email", {
            rules: [
              {
                type: "email",
                message: "The input is not valid E-mail!"
              },
              {
                required: true,
                message: "Please input your E-mail!"
              }
            ]
          })(<Input />)}
        </FormItem>

        {/* Password */}
        <FormItem {...formItemLayout} label="Password">
          {getFieldDecorator("password", {
            rules: [
              {
                required: true,
                message: "Please input your password!"
              },
              {
                validator: this.checkConfirm
              }
            ]
          })(<Input type="password" />)}
        </FormItem>

        {/* Confirm password */}
        <FormItem {...formItemLayout} label="Confirm Password">
          {getFieldDecorator("confirm", {
            rules: [
              {
                required: true,
                message: "Please confirm your password!"
              },
              {
                validator: this.checkPassword
              }
            ]
          })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          {getFieldDecorator("agreement", {
            valuePropName: "checked"
          })(
            <Checkbox>
              I have read the <a href="">agreement</a>
            </Checkbox>
          )}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" className="SignUpForm__submit-button">
            Register
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export const SignUpFormWindow = Form.create()(SignUpForm);
