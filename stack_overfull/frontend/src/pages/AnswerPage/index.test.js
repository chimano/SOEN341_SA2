import React from "react";
import { AnswerPage } from "./index.jsx";
import { configure, shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("<AnswerPage />", () => {
  let component;

  beforeEach(() => {
    component = shallow(
      <AnswerPage match={{ params: { id: 1 }, path: "", url: "" }} />
    );
    component.setState({
      q_user: "bob",
      question: {
        question_head: "what time is it?",
        question_text: "I would like to know what is the time in montreal"
      },
      answerLis: [
        {}
      ]
    });
  });

  it("renders 1 <AnswerPage /> component", () => {
    expect(component).toHaveLength(1);
  });
});
