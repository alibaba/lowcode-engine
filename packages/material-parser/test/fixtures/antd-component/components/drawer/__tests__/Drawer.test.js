import React from 'react';
import { render, mount } from 'enzyme';
import Drawer from '..';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';

describe('Drawer', () => {
  mountTest(Drawer);
  rtlTest(Drawer);

  it('render correctly', () => {
    const wrapper = render(
      <Drawer visible width={400} getContainer={false}>
        Here is content of Drawer
      </Drawer>,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('render top drawer', () => {
    const wrapper = render(
      <Drawer visible height={400} placement="top" getContainer={false}>
        Here is content of Drawer
      </Drawer>,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('have a title', () => {
    const wrapper = render(
      <Drawer visible title="Test Title" getContainer={false}>
        Here is content of Drawer
      </Drawer>,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('closable is false', () => {
    const wrapper = render(
      <Drawer visible closable={false} getContainer={false}>
        Here is content of Drawer
      </Drawer>,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('destroyOnClose is true', () => {
    const wrapper = render(
      <Drawer destroyOnClose visible={false} getContainer={false}>
        Here is content of Drawer
      </Drawer>,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('className is test_drawer', () => {
    const wrapper = render(
      <Drawer destroyOnClose visible={false} className="test_drawer" getContainer={false}>
        Here is content of Drawer
      </Drawer>,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('style/drawerStyle/headerStyle/bodyStyle should work', () => {
    const style = {
      backgroundColor: '#08c',
    };
    const wrapper = render(
      <Drawer
        visible
        style={style}
        drawerStyle={style}
        headerStyle={style}
        bodyStyle={style}
        getContainer={false}
      >
        Here is content of Drawer
      </Drawer>,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('have a footer', () => {
    const wrapper = render(
      <Drawer visible footer="Test Footer" getContainer={false}>
        Here is content of Drawer
      </Drawer>,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('forceRender works', () => {
    const wrapper = mount(
      <Drawer>
        <button type="button" className="forceRender">should not be rendered</button>
      </Drawer>,
    );
    expect(wrapper.find('button.forceRender').length).toBe(0);
    const wrapper2 = mount(
      <Drawer forceRender>
        <button type="button" className="forceRender">should be rendered</button>
      </Drawer>,
    );
    expect(wrapper2.find('button.forceRender').length).toBe(1);
  })
});
