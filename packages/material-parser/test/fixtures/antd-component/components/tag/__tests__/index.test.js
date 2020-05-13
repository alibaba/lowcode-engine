import React from 'react';
import { mount } from 'enzyme';
import Tag from '..';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';

describe('Tag', () => {
  mountTest(Tag);
  mountTest(Tag.CheckableTag);
  rtlTest(Tag);
  rtlTest(Tag.CheckableTag);

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should be closable', () => {
    const onClose = jest.fn();
    const wrapper = mount(<Tag closable onClose={onClose} />);
    expect(wrapper.find('.anticon-close').length).toBe(1);
    expect(wrapper.find('.ant-tag:not(.ant-tag-hidden)').length).toBe(1);
    wrapper.find('.anticon-close').simulate('click');
    expect(onClose).toHaveBeenCalled();
    jest.runAllTimers();
    wrapper.update();
    expect(wrapper.find('.ant-tag:not(.ant-tag-hidden)').length).toBe(0);
  });

  it('should not be closed when prevent default', () => {
    const onClose = e => {
      e.preventDefault();
    };
    const wrapper = mount(<Tag closable onClose={onClose} />);
    expect(wrapper.find('.anticon-close').length).toBe(1);
    expect(wrapper.find('.ant-tag:not(.ant-tag-hidden)').length).toBe(1);
    wrapper.find('.anticon-close').simulate('click');
    jest.runAllTimers();
    expect(wrapper.find('.ant-tag:not(.ant-tag-hidden)').length).toBe(1);
  });

  // https://github.com/ant-design/ant-design/issues/20344
  it('should not trigger onClick when click close icon', () => {
    const onClose = jest.fn();
    const onClick = jest.fn();
    const wrapper = mount(<Tag closable onClose={onClose} onClick={onClick} />);
    wrapper.find('.anticon-close').simulate('click');
    expect(onClose).toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();
  });

  describe('visibility', () => {
    it('can be controlled by visible with visible as initial value', () => {
      const wrapper = mount(<Tag visible />);
      expect(wrapper.render()).toMatchSnapshot();
      wrapper.setProps({ visible: false });
      jest.runAllTimers();
      expect(wrapper.render()).toMatchSnapshot();
      wrapper.setProps({ visible: true });
      jest.runAllTimers();
      expect(wrapper.render()).toMatchSnapshot();
    });

    it('can be controlled by visible with hidden as initial value', () => {
      const wrapper = mount(<Tag visible={false} />);
      expect(wrapper.render()).toMatchSnapshot();
      wrapper.setProps({ visible: true });
      jest.runAllTimers();
      expect(wrapper.render()).toMatchSnapshot();
      wrapper.setProps({ visible: false });
      jest.runAllTimers();
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  it('props#afterClose do not warn anymore', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const afterClose = jest.fn();
    const wrapper = mount(<Tag closable afterClose={afterClose} />);

    expect(errorSpy.mock.calls.length).toBe(1);
    expect(errorSpy.mock.calls[0][0].includes('React does not recognize')).toBeTruthy();

    wrapper.find('.anticon-close').simulate('click');
    expect(afterClose).not.toHaveBeenCalled();
  });

  describe('CheckableTag', () => {
    it('support onChange', () => {
      const onChange = jest.fn();
      const wrapper = mount(<Tag.CheckableTag onChange={onChange} />);
      wrapper.find('.ant-tag').simulate('click');
      expect(onChange).toHaveBeenCalledWith(true);
    });
  });
});
