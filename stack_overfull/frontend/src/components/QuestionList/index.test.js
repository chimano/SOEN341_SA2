import React from "react";
import { QuestionList } from "./index.jsx";
import { configure, shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("<QuestionList />", () => {
  const questionList = [];
  const component = shallow(<QuestionList questionList={questionList} />);
  it("renders 1 <QuestionList /> component", () => {
    expect(component).toHaveLength(1);
  });
});
