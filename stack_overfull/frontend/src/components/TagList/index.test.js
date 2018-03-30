import React from "react";
import { TagList } from "../../components";
import { configure, shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("<TagList />", () => {
  const tags = ["tag1", "tag2", "tag3"];
  it("renders 1 <TagList /> component", () => {
    const component = shallow(<TagList tags={tags}/>);
    expect(component).toHaveLength(1);
  });
});
