import React from "react";
import { QuestionBox } from "./index.jsx";
import { configure, shallow, mount, render } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("<QuestionBox />", () => {
  let component;
  const date_created = "2018-03-03T21:07:58.897193Z"

  beforeEach(() => {
    component = shallow(<QuestionBox date_created={date_created}/>);
  });

  //Checks if the component renders without errors
  it("renders 1 <QuestionBox /> component", () => {
    expect(component).toHaveLength(1);
  });
});
