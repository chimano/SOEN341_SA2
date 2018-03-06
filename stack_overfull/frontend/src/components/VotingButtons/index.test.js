import React from "react";
import { VotingButtons } from "./index.jsx";
import { configure, shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("<VotingButtons />", () => {
  const points = 10;
  it("renders 1 <VotingButtons /> component", () => {
    const component = shallow(<VotingButtons points={points}/>);
    expect(component).toHaveLength(1);
  });
});
