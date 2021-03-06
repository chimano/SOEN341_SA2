import React from 'react';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

type Props = {
  handleTabsChange: () => {},
};

const ProfileTabs = (props: Props) => {
  const { handleTabsChange } = props;
  return (
    <Tabs
      style={{ paddingTop: '10px' }}
      defaultActiveKey="1"
      onChange={key => handleTabsChange(key)}
    >
      <TabPane tab="Profile Information" key="1" />
      <TabPane tab="Questions Asked" key="2" />
      <TabPane tab="Questions Answered" key="3" />
      <TabPane tab="Upvoted Questions" key="4" />
      <TabPane tab="Downvoted Questions" key="5" />
    </Tabs>
  );
};
export default ProfileTabs;
