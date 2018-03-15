import React from "react";
import { Tabs } from "antd";
const TabPane = Tabs.TabPane;

export class FilterTabs extends React.Component {
  render() {
    const { handleTabsChange, questionList, getQuestionList } = this.props;
    return (
      <Tabs defaultActiveKey="1" onChange={key => handleTabsChange(key)}>
        <TabPane tab="All" key="1" />
        <TabPane tab="Not Answered" key="2" />
        <TabPane tab="Not Accepted" key="3" />
      </Tabs>
    );
  }
}
