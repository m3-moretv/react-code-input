import * as React from 'react';
import { shallow } from 'enzyme';
import CodeInput, { Types } from './index';

function mockFunctions() {
  const original = require.requireActual('./utils.ts');
  return {
    ...original,
    uuid: jest.fn(() => '1')
  };
}

jest.mock('./utils.ts', () => mockFunctions());

const onChange: jest.Mock = jest.fn();

test('should render code input', () => {
  const wrapper = shallow(
    <CodeInput
      type={Types.text}
      fields={6}
      onChange={onChange}
      value=""
      name="text"
    />
  );
  expect(wrapper).toMatchSnapshot();
});
