import React from "react";
import { QuestionEdit } from "./index.jsx";
import { configure, shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("<QuestionEdit />", () => {
  it("renders 1 <QuestionEdit /> component", () => {
    const component = shallow(<QuestionEdit />);
    expect(component).toHaveLength(1);
  });
});
