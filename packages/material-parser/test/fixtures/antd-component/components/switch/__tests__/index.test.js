import React from 'react';
import { mount } from 'enzyme';
import Switch from '..';
import focusTest from '../../../tests/shared/focusTest';
import { resetWarned } from '../../_util/warning';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';

describe('Switch', () => {
  focusTest(Switch);
  mountTest(Switch);
  rtlTest(Switch);

  it('should has click wave effect', async () => {
    const wrapper = mount(<Switch />);
    wrapper.find('.ant-switch').getDOMNode().click();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('warning if set `value`', () => {
    resetWarned();

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mount(<Switch value />);
    expect(errorSpy).toHaveBeenCalledWith(
      'Warning: [antd: Switch] `value` is not a valid prop, do you mean `checked`?',
    );
    errorSpy.mockRestore();
  });
});
