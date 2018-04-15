// @flow
import React from 'react';
import { Form, Input, Tooltip, Icon, Button, Select, message } from 'antd';
import './index.css';
import { postApiUserRegister } from '../../utils/api';

const FormItem = Form.Item;
const { Option } = Select;

type Props = {
  handleCloseButton: () => {},
  handleLogin: (string) => {},
  form: Object,
};

type State = {
  confirmDirty: boolean,
};

class SignUpForm extends React.Component<Props, State> {
  state = {
    confirmDirty: false,
  };

  onUserRegisterResponse(response) {
    const { handleCloseButton, handleLogin } = this.props;
    if (!response.data.error) {
      message.success('Successfully created an account');
      handleCloseButton();
      handleLogin(response.data.username);
    } else {
      message.error(response.data.error);
    }
  }

  doUserRegisterRequest(username, password, email, isEmployer) {
    postApiUserRegister(username, password, email, isEmployer)
      .then((response) => {
        this.onUserRegisterResponse(response);
      })
      .catch((e) => {
        message.error(e.response.data.error);
      });
  }

  checkPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };
  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.doUserRegisterRequest(
          values.username,
          values.password,
          values.email,
          values.isEmployer,
        );
      }
    });
  };
  handleConfirmBlur = (e) => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  render() {
    const { handleCloseButton } = this.props;
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <Form onSubmit={this.handleSubmit} className="SignUpForm">
        <div
          className="SignUpForm__close-button"
          onClick={() => handleCloseButton()}
          onKeyPress={() => handleCloseButton()}
          role="button"
          tabIndex={0}
        >
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
          {getFieldDecorator('username', {
            rules: [
              {
                required: true,
                message: 'Please input your nickname!',
                whitespace: true,
              },
            ],
          })(<Input />)}
        </FormItem>

        {/* Email */}
        <FormItem {...formItemLayout} label="E-mail">
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(<Input />)}
        </FormItem>

        {/* Password */}
        <FormItem {...formItemLayout} label="Password">
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Please input your password!',
              },
              {
                validator: this.checkConfirm,
              },
            ],
          })(<Input type="password" />)}
        </FormItem>

        {/* Confirm password */}
        <FormItem {...formItemLayout} label="Confirm Password">
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: 'Please confirm your password!',
              },
              {
                validator: this.checkPassword,
              },
            ],
          })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
        </FormItem>
        {/* Account Type */}
        <FormItem {...formItemLayout} label="Are you an employer?">
          {getFieldDecorator('isEmployer', {
            rules: [{ required: true, message: 'Please select your answer.' }],
          })(<Select>
            <Option value={0}>No</Option>
            <Option value={1}>Yes</Option>
             </Select>)}
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
const SignUpFormWindow = Form.create()(SignUpForm);
export default SignUpFormWindow;
