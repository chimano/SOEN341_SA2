import React from "react";
import { AcceptRejectButton } from "./index.jsx";
import { configure, shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("<AcceptRejectButton />", () => {
  it("renders 1 <AcceptRejectButton /> component", () => {
    const component = shallow(<AcceptRejectButton />);
    expect(component).toHaveLength(1);
  });
});
