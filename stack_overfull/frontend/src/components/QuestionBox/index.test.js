import React from "react";
import { QuestionBox } from "./index.jsx";
import { configure, shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("<QuestionBox />", () => {
  it("renders 1 <QuestionBox /> component", () => {
    const component = shallow(<QuestionBox />);
    expect(component).toHaveLength(1);
  });
});
