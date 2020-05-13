import React from 'react';
import { mount } from 'enzyme';
import Result from '..';
import Button from '../../button';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';

describe('Result', () => {
  mountTest(Result);
  rtlTest(Result);

  it('🙂  successPercent should decide the progress status when it exists', () => {
    const wrapper = mount(
      <Result
        status="success"
        title="Successfully Purchased Cloud Server ECS!"
        subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
        extra={[
          <Button type="primary" key="console">
            Go Console
          </Button>,
          <Button key="buy">Buy Again</Button>,
        ]}
      />,
    );
    expect(wrapper.find('.anticon-check-circle')).toHaveLength(1);
  });

  it('🙂  different status, different class', () => {
    const wrapper = mount(<Result status="warning" />);
    expect(wrapper.find('.ant-result-warning')).toHaveLength(1);

    wrapper.setProps({
      status: 'error',
    });

    expect(wrapper.find('.ant-result-error')).toHaveLength(1);

    wrapper.setProps({
      status: '500',
    });

    expect(wrapper.find('.ant-result-500')).toHaveLength(1);
  });

  it('🙂  When status = 404, the icon is an image', () => {
    const wrapper = mount(<Result status="404" />);
    expect(wrapper.find('.ant-result-404 .ant-result-image')).toHaveLength(1);
  });

  it('🙂  When extra is undefined, the extra dom is undefined', () => {
    const wrapper = mount(<Result status="404" />);
    expect(wrapper.find('.ant-result-extra')).toHaveLength(0);
  });

  it('🙂  result should support className', () => {
    const wrapper = mount(<Result status="404" title="404" className="my-result" />);
    expect(wrapper.find('.ant-result.my-result')).toHaveLength(1);
  });

  it('should warning when pass a string as icon props', () => {
    const warnSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mount(<Result title="404" icon="ab" />);
    expect(warnSpy).not.toHaveBeenCalled();
    mount(<Result title="404" icon="smile" />);
    expect(warnSpy).toHaveBeenCalledWith(
      `Warning: [antd: Result] \`icon\` is using ReactNode instead of string naming in v4. Please check \`smile\` at https://ant.design/components/icon`,
    );
    warnSpy.mockRestore();
  });
});
