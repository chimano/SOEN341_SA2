import React from 'react';
import { QuestionBox } from '../../components';
import { configure, shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('<QuestionBox />', () => {
  let component;
  const dateCreated = '2018-03-03T21:07:58.897193Z';

  beforeEach(() => {
    component = shallow(<QuestionBox dateCreated={dateCreated} />);
  });

  // Checks if the component renders without errors
  it('renders 1 <QuestionBox /> component', () => {
    expect(component).toHaveLength(1);
  });
});
