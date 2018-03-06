import React from "react";
import "./index.css";
import { Menu, Icon } from "antd";
const SubMenu = Menu.SubMenu;

export class SideBar extends React.Component {
  handleClick = e => {
    const { handleCategory } = this.props;
    console.log("click ", e);

    handleCategory(e.key);
  };

  render() {
    return (
      <Menu
        onClick={this.handleClick}
        style={{ width: 256, marginLeft: "-25px" }}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
      >
        <Menu.Item disabled style={{ cursor: "default" }}>
          <span style={{ color: { value: "blue", important: "true" } }}>
            CATEGORY
          </span>
        </Menu.Item>
        <SubMenu
          key="sub1"
          title={
            <span>
              <Icon type="setting" />
              <span>Arts</span>
            </span>
          }
        />
        <SubMenu
          key="sub2"
          title={
            <span>
              <Icon type="setting" />
              <span>Administration</span>
            </span>
          }
        />
        <SubMenu
          key="sub3"
          title={
            <span>
              <Icon type="setting" />
              <span>Commerce</span>
            </span>
          }
        />
        <SubMenu
          key="sub4"
          title={
            <span>
              <Icon type="setting" />
              <span>Computer Science</span>
            </span>
          }
        />
        <SubMenu
          key="sub5"
          title={
            <span>
              <Icon type="setting" />
              <span>Education</span>
            </span>
          }
        />
        <SubMenu
          key="sub6"
          title={
            <span>
              <Icon type="setting" />
              <span>Engineering</span>
            </span>
          }
        >
          <Menu.Item key="1">Aerospace Engineering</Menu.Item>
          <Menu.Item key="2">Building Engineering</Menu.Item>
          <Menu.Item key="3">Civil Engineering</Menu.Item>
          <Menu.Item key="4">Computer Engineering</Menu.Item>
          <Menu.Item key="5">Industrial Engineering</Menu.Item>
          <Menu.Item key="6">Mechanical Engineering</Menu.Item>
          <Menu.Item key="7">Software Engineering</Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub7"
          title={
            <span>
              <Icon type="setting" />
              <span>Fine Arts</span>
            </span>
          }
        />
        <SubMenu
          key="sub8"
          title={
            <span>
              <Icon type="setting" />
              <span>Science</span>
            </span>
          }
        >
          <Menu.Item key="8">Physics</Menu.Item>
          <Menu.Item key="9">Psychology</Menu.Item>
          <Menu.Item key="10">Statistics</Menu.Item>
        </SubMenu>
      </Menu>
    );
  }
}
