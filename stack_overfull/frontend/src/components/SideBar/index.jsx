import React from "react";
import "./index.css";
import { Menu, Icon } from "antd";
const SubMenu = Menu.SubMenu;

const categories = [
  {
    value: "arts",
    label: "Arts",
    children: [
      {
        value: "photography",
        label: "Photography"
      },
      {
        value: "architechture",
        label: "Architechture"
      },
      {
        value: "music",
        label: "Music"
      },
      {
        value: "theatre",
        label: "Theatre"
      }
    ]
  },
  {
    value: "administration",
    label: "Administration",
    children: [
      {
        value: "receptionist",
        label: "Receptionist"
      },
      {
        value: "coordinator",
        label: "Coordinator"
      },
      {
        value: "payroll administrator",
        label: "Payroll Administrator"
      }
    ]
  },
  {
    value: "commerce",
    label: "Commerce",
    children: [
      {
        value: "sales Representative",
        label: "Sales Representative"
      },
      {
        value: "accountant",
        label: "Accountant"
      },
      {
        value: "marketing",
        label: "Marketing"
      }
    ]
  },
  {
    value: "engineering",
    label: "Engineering",
    children: [
      {
        value: "computer_science",
        label: "Computer Science"
      },
      {
        value: "software_engineering",
        label: "Software Engineering"
      },
      {
        value: "mechanical_engineering",
        label: "Mechanical Engineering"
      },
      {
        value: "electrical_engineering",
        label: "Electrical Engineering"
      },
      {
        value: "industrial_engineering",
        label: "Industrial Engineering"
      }
    ]
  },
  {
    value: "education",
    label: "Education",
    children: [
      {
        value: "tutor",
        label: "Tutor"
      },
      {
        value: "elementary_school_teacher",
        label: "Elementary School Teacher"
      },
      {
        value: "highschool_teacher",
        label: "Highschool Teacher"
      },
      {
        value: "cegep_teacher",
        label: "Cegep Teacher"
      },
      {
        value: "university_teacher",
        label: "University Teacher"
      }
    ]
  },
  {
    value: "science",
    label: "Science",
    children: [
      {
        value: "biology",
        label: "Biology"
      },
      {
        value: "chemistry",
        label: "Chemistry"
      },
      {
        value: "physics",
        label: "Physics"
      },
      {
        value: "sociology",
        label: "Sociology"
      },
      {
        value: "geoscience",
        label: "Geoscience"
      }
    ]
  }
];

export default class SideBar extends React.Component {
  rootSubmenuKeys = ["0", "1", "2", "3", "4", "5"];
  state = {
    openKeys: ["3"]
  };

  handleClick = e => {
    const { getJobList } = this.props;
    console.log("click ", e);
    getJobList(e.key);
  };

  onOpenChange = openKeys => {
    console.log(openKeys);
    const latestOpenKey = openKeys.find(
      key => this.state.openKeys.indexOf(key) === -1
    );
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : []
      });
    }
  };

  render() {
    let list = [];
    categories.forEach((value, key) => {
      list.push(
        <SubMenu
          key={key}
          title={
            <span>
              <Icon type="setting" />
              <span>{value.label}</span>
            </span>
          }
        >
          {value.children.map((v, key) => (
            <Menu.Item style={{ cursor: "default" }} key={v.value}>
              <span style={{ color: { value: "blue", important: "true" } }}>
                {v.label}
              </span>
            </Menu.Item>
          ))}
        </SubMenu>
      );
    });

    return (
      <div className="SideBar">
        <Menu
          mode="inline"
          openKeys={this.state.openKeys}
          onOpenChange={this.onOpenChange}
          onClick={this.handleClick}
          style={{
            width: 256,
            marginLeft: "-15px",
            border: "solid 1px #ececec"
          }}
          defaultSelectedKeys={["computer_science"]}
          mode="inline"
        >
          {list}
        </Menu>
      </div>
    );
  }
}
