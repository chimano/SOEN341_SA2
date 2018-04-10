import React from 'react';
import { JobBox } from '../../components';
import { configure, shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('<JobBox />', () => {
  let component;
  const description = 'Hello this is a job.';
  const id = '4';
  const company = 'Apple';
  const position = 'Front-End Developer';
  const type = 'Internship';
  const location = 'Montreal';
  const category = 'software_engineering';
  const dateCreated = '2018-03-03T21:07:58.897193Z';

  beforeEach(() => {
    component = shallow(<JobBox
      jobDescription={description}
      jobId={id}
      jobCompany={company}
      jobPosition={position}
      jobType={type}
      jobLocation={location}
      jobCategory={category}
      dateCreated={dateCreated}
    />);
  });

  // Checks if the component renders without errors
  it('renders 1 <JobBox /> component', () => {
    expect(component).toHaveLength(1);
  });
});
