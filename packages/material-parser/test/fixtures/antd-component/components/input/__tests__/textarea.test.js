import React from 'react';
import { mount } from 'enzyme';
// eslint-disable-next-line import/no-unresolved
import Input from '..';
import focusTest from '../../../tests/shared/focusTest';
import calculateNodeHeight, { calculateNodeStyling } from '../calculateNodeHeight';
import { sleep } from '../../../tests/utils';

const { TextArea } = Input;

focusTest(TextArea);

describe('TextArea', () => {
  const originalGetComputedStyle = window.getComputedStyle;
  beforeAll(() => {
    Object.defineProperty(window, 'getComputedStyle', {
      value: node => ({
        getPropertyValue: prop => {
          if (prop === 'box-sizing') {
            return originalGetComputedStyle(node)[prop] || 'border-box';
          }
          return originalGetComputedStyle(node)[prop];
        },
      }),
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'getComputedStyle', {
      value: originalGetComputedStyle,
    });
  });

  it('should auto calculate height according to content length', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const wrapper = mount(
      <TextArea value="" readOnly autoSize={{ minRows: 2, maxRows: 6 }} wrap="off" />,
    );
    const mockFunc = jest.spyOn(wrapper.instance().resizableTextArea, 'resizeTextarea');
    wrapper.setProps({ value: '1111\n2222\n3333' });
    await sleep(0);
    expect(mockFunc).toHaveBeenCalledTimes(1);
    wrapper.setProps({ value: '1111' });
    await sleep(0);
    expect(mockFunc).toHaveBeenCalledTimes(2);
    wrapper.update();
    expect(wrapper.find('textarea').props().style.overflow).toBeFalsy();

    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('should support onPressEnter and onKeyDown', () => {
    const fakeHandleKeyDown = jest.fn();
    const fakeHandlePressEnter = jest.fn();
    const wrapper = mount(
      <TextArea onKeyDown={fakeHandleKeyDown} onPressEnter={fakeHandlePressEnter} />,
    );
    /** keyCode 65 is A */
    wrapper.find('textarea').simulate('keydown', { keyCode: 65 });
    expect(fakeHandleKeyDown).toHaveBeenCalledTimes(1);
    expect(fakeHandlePressEnter).toHaveBeenCalledTimes(0);

    /** keyCode 13 is Enter */
    wrapper.find('textarea').simulate('keydown', { keyCode: 13 });
    expect(fakeHandleKeyDown).toHaveBeenCalledTimes(2);
    expect(fakeHandlePressEnter).toHaveBeenCalledTimes(1);
  });

  it('should support disabled', () => {
    const wrapper = mount(<TextArea disabled />);
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('should support maxLength', () => {
    const wrapper = mount(<TextArea maxLength={10} />);
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('calculateNodeStyling works correctly', () => {
    const wrapper = document.createElement('textarea');
    wrapper.id = 'test';
    wrapper.wrap = 'wrap';
    calculateNodeStyling(wrapper, true);
    const value = calculateNodeStyling(wrapper, true);
    expect(value).toEqual({
      borderSize: 2,
      boxSizing: 'border-box',
      paddingSize: 4,
      sizingStyle:
        'letter-spacing:normal;line-height:normal;padding-top:2px;padding-bottom:2px;font-family:-webkit-small-control;font-weight:;font-size:;font-variant:;text-rendering:auto;text-transform:none;width:;text-indent:0;padding-left:2px;padding-right:2px;border-width:1px;box-sizing:border-box',
    });
  });

  it('boxSizing === "border-box"', () => {
    const wrapper = document.createElement('textarea');
    wrapper.style.boxSizing = 'border-box';
    const { height } = calculateNodeHeight(wrapper);
    expect(height).toBe(2);
  });

  it('boxSizing === "content-box"', () => {
    const wrapper = document.createElement('textarea');
    wrapper.style.boxSizing = 'content-box';
    const { height } = calculateNodeHeight(wrapper);
    expect(height).toBe(-4);
  });

  it('minRows or maxRows is not null', () => {
    const wrapper = document.createElement('textarea');
    expect(calculateNodeHeight(wrapper, 1, 1)).toEqual({
      height: 2,
      maxHeight: 9007199254740991,
      minHeight: 2,
      overflowY: undefined,
    });
    wrapper.style.boxSizing = 'content-box';
    expect(calculateNodeHeight(wrapper, 1, 1)).toEqual({
      height: -4,
      maxHeight: 9007199254740991,
      minHeight: -4,
      overflowY: undefined,
    });
  });

  it('when prop value not in this.props, resizeTextarea should be called', () => {
    const wrapper = mount(<TextArea aria-label="textarea" />);
    const resizeTextarea = jest.spyOn(wrapper.instance().resizableTextArea, 'resizeTextarea');
    wrapper.find('textarea').simulate('change', 'test');
    expect(resizeTextarea).toHaveBeenCalled();
  });

  it('handleKeyDown', () => {
    const onPressEnter = jest.fn();
    const onKeyDown = jest.fn();
    const wrapper = mount(
      <TextArea onPressEnter={onPressEnter} onKeyDown={onKeyDown} aria-label="textarea" />,
    );
    wrapper.instance().handleKeyDown({ keyCode: 13 });
    expect(onPressEnter).toHaveBeenCalled();
    expect(onKeyDown).toHaveBeenCalled();
  });

  it('should trigger onResize', async () => {
    const onResize = jest.fn();
    const wrapper = mount(<TextArea onResize={onResize} autoSize />);
    await sleep(100);
    wrapper
      .find('ResizeObserver')
      .instance()
      .onResize([
        {
          target: {
            getBoundingClientRect() {
              return {};
            },
          },
        },
      ]);

    expect(onResize).toHaveBeenCalledWith(
      expect.objectContaining({
        width: expect.any(Number),
        height: expect.any(Number),
      }),
    );
  });
});

describe('TextArea allowClear', () => {
  it('should change type when click', () => {
    const wrapper = mount(<TextArea allowClear />);
    wrapper.find('textarea').simulate('change', { target: { value: '111' } });
    expect(wrapper.find('textarea').getDOMNode().value).toEqual('111');
    expect(wrapper.render()).toMatchSnapshot();
    wrapper.find('.ant-input-textarea-clear-icon').at(0).simulate('click');
    expect(wrapper.render()).toMatchSnapshot();
    expect(wrapper.find('textarea').getDOMNode().value).toEqual('');
  });

  it('should not show icon if value is undefined, null or empty string', () => {
    const wrappers = [null, undefined, ''].map(val => mount(<TextArea allowClear value={val} />));
    wrappers.forEach(wrapper => {
      expect(wrapper.find('textarea').getDOMNode().value).toEqual('');
      expect(wrapper.find('.ant-input-textarea-clear-icon-hidden').exists()).toBeTruthy();
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  it('should not show icon if defaultValue is undefined, null or empty string', () => {
    const wrappers = [null, undefined, ''].map(val =>
      mount(<TextArea allowClear defaultValue={val} />),
    );
    wrappers.forEach(wrapper => {
      expect(wrapper.find('textarea').getDOMNode().value).toEqual('');
      expect(wrapper.find('.ant-textarea-clear-icon').exists()).toEqual(false);
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  it('should trigger event correctly', () => {
    let argumentEventObject;
    let argumentEventObjectValue;
    const onChange = e => {
      argumentEventObject = e;
      argumentEventObjectValue = e.target.value;
    };
    const wrapper = mount(<TextArea allowClear defaultValue="111" onChange={onChange} />);
    wrapper.find('.ant-input-textarea-clear-icon').at(0).simulate('click');
    expect(argumentEventObject.type).toBe('click');
    expect(argumentEventObjectValue).toBe('');
    expect(wrapper.find('textarea').at(0).getDOMNode().value).toBe('');
  });

  it('should trigger event correctly on controlled mode', () => {
    let argumentEventObject;
    let argumentEventObjectValue;
    const onChange = e => {
      argumentEventObject = e;
      argumentEventObjectValue = e.target.value;
    };
    const wrapper = mount(<TextArea allowClear value="111" onChange={onChange} />);
    wrapper.find('.ant-input-textarea-clear-icon').at(0).simulate('click');
    expect(argumentEventObject.type).toBe('click');
    expect(argumentEventObjectValue).toBe('');
    expect(wrapper.find('textarea').at(0).getDOMNode().value).toBe('111');
  });

  it('should focus textarea after clear', () => {
    const wrapper = mount(<TextArea allowClear defaultValue="111" />, { attachTo: document.body });
    wrapper.find('.ant-input-textarea-clear-icon').at(0).simulate('click');
    expect(document.activeElement).toBe(wrapper.find('textarea').at(0).getDOMNode());
    wrapper.unmount();
  });

  it('should not support allowClear when it is disabled', () => {
    const wrapper = mount(<TextArea allowClear defaultValue="111" disabled />);
    expect(wrapper.find('.ant-input-textarea-clear-icon-hidden').exists()).toBeTruthy();
  });

  it('not block input when `value` is undefined', () => {
    const wrapper = mount(<Input value={undefined} />);
    wrapper.find('input').simulate('change', { target: { value: 'Bamboo' } });
    expect(wrapper.find('input').props().value).toEqual('Bamboo');

    // Controlled
    wrapper.setProps({ value: 'Light' });
    wrapper.find('input').simulate('change', { target: { value: 'Bamboo' } });
    expect(wrapper.find('input').props().value).toEqual('Light');
  });

  describe('click focus', () => {
    it('click outside should also get focus', () => {
      const wrapper = mount(<Input suffix={<span className="test-suffix" />} />);
      const onFocus = jest.spyOn(wrapper.find('input').instance(), 'focus');
      wrapper.find('.test-suffix').simulate('mouseUp');
      expect(onFocus).toHaveBeenCalled();
    });

    it('not get focus if out of component', () => {
      const wrapper = mount(<Input suffix={<span className="test-suffix" />} />);
      const onFocus = jest.spyOn(wrapper.find('input').instance(), 'focus');
      const ele = document.createElement('span');
      document.body.appendChild(ele);
      wrapper.find('.test-suffix').simulate('mouseUp', {
        target: ele,
      });
      expect(onFocus).not.toHaveBeenCalled();
      document.body.removeChild(ele);
    });
  });

  it('scroll to bottom when autoSize', async () => {
    const wrapper = mount(<Input.TextArea autoSize />, { attachTo: document.body });
    wrapper.find('textarea').simulate('focus');
    wrapper.find('textarea').getDOMNode().focus();
    const setSelectionRangeFn = jest.spyOn(
      wrapper.find('textarea').getDOMNode(),
      'setSelectionRange',
    );
    wrapper.find('textarea').simulate('input', { target: { value: '\n1' } });
    await sleep(100);
    expect(setSelectionRangeFn).toHaveBeenCalled();
    wrapper.unmount();
  });
});
