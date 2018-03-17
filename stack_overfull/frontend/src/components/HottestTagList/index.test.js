import React from "react";
import { HottestTagList } from "./index.jsx";
import { configure, shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("<HottestTagList />", () => {
  const hotTags = ["tag1", "tag2", "tag3"];
  it("renders 1 <HottestTagList /> component", () => {
    const component = shallow(<HottestTagList hotTags={hotTags}/>);
    expect(component).toHaveLength(1);
  });
});
