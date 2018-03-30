// @flow
import React from 'react';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

type Props = {
  handleTabsChange: number => {},
};

const FilterTabs = (props: Props) => {
  const { handleTabsChange } = props;
  return (
    <Tabs
      style={{ paddingTop: '10px' }}
      defaultActiveKey="1"
      onChange={key => handleTabsChange(key)}
    >
      <TabPane tab="All" key="1" />
      <TabPane tab="Not Answered" key="2" />
      <TabPane tab="Not Accepted" key="3" />
    </Tabs>
  );
};
export default FilterTabs;
