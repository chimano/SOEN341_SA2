import React from 'react';
import { Button, Modal, Form, Input, Select, Cascader, Option } from 'antd';
import { postApiJob } from '../../utils/api';

const FormItem = Form.Item;
const { TextArea } = Input;

const categories = [
  {
    value: 'arts',
    label: 'Arts',
    children: [
      {
        value: 'photography',
        label: 'Photography',
      },
      {
        value: 'architechture',
        label: 'Architechture',
      },
      {
        value: 'music',
        label: 'Music',
      },
      {
        value: 'theatre',
        label: 'Theatre',
      },
    ],
  },
  {
    value: 'administration',
    label: 'Administration',
    children: [
      {
        value: 'receptionist',
        label: 'Receptionist',
      },
      {
        value: 'coordinator',
        label: 'Coordinator',
      },
      {
        value: 'payroll administrator',
        label: 'Payroll Administrator',
      },
    ],
  },
  {
    value: 'commerce',
    label: 'Commerce',
    children: [
      {
        value: 'sales Representative',
        label: 'Sales Representative',
      },
      {
        value: 'accountant',
        label: 'Accountant',
      },
      {
        value: 'marketing',
        label: 'Marketing',
      },
    ],
  },
  {
    value: 'engineering',
    label: 'Engineering',
    children: [
      {
        value: 'computer_science',
        label: 'Computer Science',
      },
      {
        value: 'software_engineering',
        label: 'Software Engineering',
      },
      {
        value: 'mechanical_engineering',
        label: 'Mechanical Engineering',
      },
      {
        value: 'electrical_engineering',
        label: 'Electrical Engineering',
      },
      {
        value: 'industrial_engineering',
        label: 'Industrial Engineering',
      },
    ],
  },
  {
    value: 'education',
    label: 'Education',
    children: [
      {
        value: 'tutor',
        label: 'Tutor',
      },
      {
        value: 'elementary_school_teacher',
        label: 'Elementary School Teacher',
      },
      {
        value: 'highschool_teacher',
        label: 'Highschool Teacher',
      },
      {
        value: 'cegep_teacher',
        label: 'Cegep Teacher',
      },
      {
        value: 'university_teacher',
        label: 'University Teacher',
      },
    ],
  },
  {
    value: 'science',
    label: 'Science',
    children: [
      {
        value: 'biology',
        label: 'Biology',
      },
      {
        value: 'chemistry',
        label: 'Chemistry',
      },
      {
        value: 'physics',
        label: 'Physics',
      },
      {
        value: 'sociology',
        label: 'Sociology',
      },
      {
        value: 'geoscience',
        label: 'Geoscience',
      },
    ],
  },
];

const PostJobForm = Form.create()((props) => {
  const {
    visible, onCancel, onCreate, form,
  } = props;
  const { getFieldDecorator } = form;
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };
  return (
    <Modal
      visible={visible}
      title="Create a new job"
      okText="Create"
      onCancel={onCancel}
      onOk={onCreate}
    >
      <Form layout="vertical">
        {/* position of job */}
        <FormItem label="Position">
          {getFieldDecorator('position', {
            rules: [
              {
                required: true,
                message: 'Please input the position of the job!',
              },
            ],
          })(<Input />)}
        </FormItem>

        {/* Select type of job ex: full time */}
        <FormItem {...formItemLayout} label="Select Type" hasFeedback>
          {getFieldDecorator('type', {
            rules: [
              { required: true, message: 'Please select the type of the job!' },
            ],
          })(<Select placeholder="Please select type">
            <Option value="Full-time">Full-time</Option>
            <Option value="Part-time">Part-time</Option>
            <Option value="Internship">Internship</Option>
            <Option value="Contract">Contract</Option>
            <Option value="Temporary">Temporary</Option>
            <Option value="Trainee">Trainee</Option>
          </Select>)}
        </FormItem>

        {/* Select categories */}
        <FormItem {...formItemLayout} label="Category">
          {getFieldDecorator('category', {
            rules: [
              {
                type: 'array',
                required: true,
                message: 'Please select your Job category!',
              },
            ],
          })(<Cascader options={categories} />)}
        </FormItem>

        {/* Company */}
        <FormItem label="Company">
          {getFieldDecorator('company', {
            rules: [
              { required: true, message: 'Please input your company name!' },
            ],
          })(<Input />)}
        </FormItem>

        {/* Location */}
        <FormItem label="Location">
          {getFieldDecorator('location', {
            rules: [{ required: true, message: 'Please input your location!' }],
          })(<Input />)}
        </FormItem>

        {/* Description */}
        <FormItem label="Description">
          {getFieldDecorator('description', {
            rules: [
              { required: true, message: 'Please input the description!' },
            ],
          })(<TextArea rows={4} />)}
        </FormItem>
      </Form>
    </Modal>
  );
});

export default class PostJobButton extends React.Component {
  state = {
    visible: false,
  };
  showModal = () => {
    this.setState({ visible: true });
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };
  handleCreate = () => {
    const { form } = this;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log('Received values of form: ', values);
      this.createJob(values);
      form.resetFields();
      this.setState({ visible: false });
    });
  };
  createJob = (values) => {
    postApiJob(
      values.position,
      values.type,
      values.category[1],
      values.company,
      values.location,
      values.description,
    )
      .then((response) => {
        console.log(response);
      })
      .catch((e) => {
        alert(e.response.data.error);
      });
  };
  saveFormRef = (form) => {
    this.form = form;
  };
  render() {
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          New Job
        </Button>
        <PostJobForm
          ref={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  }
}
