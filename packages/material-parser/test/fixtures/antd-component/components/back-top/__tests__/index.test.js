import React from 'react';
import { mount } from 'enzyme';
import { sleep } from '../../../tests/utils';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import BackTop from '..';

describe('BackTop', () => {
  mountTest(BackTop);
  rtlTest(BackTop);

  it('should scroll to top after click it', async () => {
    const wrapper = mount(<BackTop visibilityHeight={-1} />);
    const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation((x, y) => {
      window.scrollY = y;
      window.pageYOffset = y;
      document.documentElement.scrollTop = y;
    });
    window.scrollTo(0, 400);
    expect(document.documentElement.scrollTop).toBe(400);
    // trigger scroll manually
    wrapper.instance().handleScroll();
    await sleep();
    wrapper.find('.ant-back-top').simulate('click');
    await sleep(500);
    expect(document.documentElement.scrollTop).toBe(0);
    scrollToSpy.mockRestore();
  });

  it('support onClick', async () => {
    const onClick = jest.fn();
    const wrapper = mount(<BackTop onClick={onClick} visibilityHeight={-1} />);
    const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation((x, y) => {
      window.scrollY = y;
      window.pageYOffset = y;
    });
    document.dispatchEvent(new Event('scroll'));
    window.scrollTo(0, 400);
    // trigger scroll manually
    wrapper.instance().handleScroll();
    await sleep();
    wrapper.find('.ant-back-top').simulate('click');
    expect(onClick).toHaveBeenCalled();
    scrollToSpy.mockRestore();
  });

  it('should be able to update target', async () => {
    const wrapper = mount(<BackTop />);
    wrapper.instance().handleScroll = jest.fn();
    const container = document.createElement('div');
    wrapper.setProps({ target: () => container });
    expect(wrapper.instance().handleScroll).toHaveBeenLastCalledWith({
      target: container,
    });
    container.dispatchEvent(new Event('scroll'));
    expect(wrapper.instance().handleScroll).toHaveBeenLastCalledWith(
      expect.objectContaining({
        currentTarget: container,
        target: container,
      }),
    );
  });

  it('invalid target', async () => {
    const onClick = jest.fn();
    const wrapper = mount(<BackTop onClick={onClick} target={() => ({ documentElement: {} })} />);
    wrapper.find('.ant-back-top').simulate('click');
    expect(onClick).toHaveBeenCalled();
  });
});
