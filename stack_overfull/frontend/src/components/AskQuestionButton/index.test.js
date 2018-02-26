import React from "react";
import { AskQuestionButton } from "./index.jsx";
import { configure, shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("<AskQuestionButton />", () => {
  it("renders 1 <AskQuestionButton /> component", () => {
    const component = shallow(<AskQuestionButton />);
    expect(component).toHaveLength(1);
  });
});
