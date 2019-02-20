import * as React from 'react';
import { shallow, mount } from 'enzyme';
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

test('should fires onchange with correct values', () => {
  const VALUE = '123';
  const wrapper = mount(
    <CodeInput
      onChange={onChange}
      fields={3}
      name="text"
      value={VALUE}
      type={Types.text}
    />
  );
  wrapper
    .find('input')
    .at(0)
    .simulate('change');

  expect(onChange).toHaveBeenCalledWith(VALUE);
});

test('should correctly handles backspace', () => {
  const VALUE = '123';
  const wrapper = mount(
    <CodeInput
      onChange={onChange}
      fields={3}
      name="text"
      value={VALUE}
      type={Types.text}
    />
  );

  wrapper
    .find('input')
    .at(0)
    .simulate('keydown', { keyCode: 8 });

  expect(
    wrapper
      .find('input')
      .at(0)
      .props().value
  ).toBe('');

  expect(onChange).toHaveBeenCalledWith(VALUE.substr(1));
});
