import React from "react";
import { AnswerBox } from "./index.jsx";
import { configure, shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("<AnswerBox />", () => {
  const x = {
    is_accepted: true,
    user_id: { username: "Bob" },
    date_created: "date"
  };
  const component = shallow(<AnswerBox x={x} />);
  it("renders 1 <AnswerBox /> component", () => {
    expect(component).toHaveLength(1);
  });
});
