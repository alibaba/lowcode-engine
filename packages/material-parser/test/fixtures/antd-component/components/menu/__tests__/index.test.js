import React from 'react';
import { mount } from 'enzyme';
import Menu from '..';
import Icon from '../../icon';
import Layout from '../../layout';
import Tooltip from '../../tooltip';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import { resetWarned } from '../../_util/warning';

const { SubMenu } = Menu;

describe('Menu', () => {
  mountTest(() => (
    <Menu>
      <Menu.Item />
      <Menu.ItemGroup />
      <Menu.SubMenu />
    </Menu>
  ));

  rtlTest(() => (
    <Menu>
      <Menu.Item />
      <Menu.ItemGroup />
      <Menu.SubMenu />
    </Menu>
  ));

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('If has select nested submenu item ,the menu items on the grandfather level should be highlight', () => {
    const wrapper = mount(
      <Menu defaultSelectedKeys={['1-3-2']} mode="vertical">
        <SubMenu key="1" title="submenu1">
          <Menu.Item key="1-1">Option 1</Menu.Item>
          <Menu.Item key="1-2">Option 2</Menu.Item>
          <SubMenu key="1-3" title="submenu1-3">
            <Menu.Item key="1-3-1">Option 3</Menu.Item>
            <Menu.Item key="1-3-2">Option 4</Menu.Item>
          </SubMenu>
        </SubMenu>
        <Menu.Item key="2">menu2</Menu.Item>
      </Menu>,
    );
    expect(wrapper.find('.ant-menu-submenu-selected').length).toBe(1);
  });

  it('should accept defaultOpenKeys in mode horizontal', () => {
    const wrapper = mount(
      <Menu defaultOpenKeys={['1']} mode="horizontal">
        <SubMenu key="1" title="submenu1">
          <Menu.Item key="submenu1">Option 1</Menu.Item>
          <Menu.Item key="submenu2">Option 2</Menu.Item>
        </SubMenu>
        <Menu.Item key="2">menu2</Menu.Item>
      </Menu>,
    );
    expect(
      wrapper
        .find('.ant-menu-sub')
        .at(0)
        .hasClass('ant-menu-hidden'),
    ).not.toBe(true);
  });

  it('should accept defaultOpenKeys in mode inline', () => {
    const wrapper = mount(
      <Menu defaultOpenKeys={['1']} mode="inline">
        <SubMenu key="1" title="submenu1">
          <Menu.Item key="submenu1">Option 1</Menu.Item>
          <Menu.Item key="submenu2">Option 2</Menu.Item>
        </SubMenu>
        <Menu.Item key="2">menu2</Menu.Item>
      </Menu>,
    );
    expect(
      wrapper
        .find('.ant-menu-sub')
        .at(0)
        .hasClass('ant-menu-hidden'),
    ).not.toBe(true);
  });

  it('should accept defaultOpenKeys in mode vertical', () => {
    const wrapper = mount(
      <Menu defaultOpenKeys={['1']} mode="vertical">
        <SubMenu key="1" title="submenu1">
          <Menu.Item key="submenu1">Option 1</Menu.Item>
          <Menu.Item key="submenu2">Option 2</Menu.Item>
        </SubMenu>
        <Menu.Item key="2">menu2</Menu.Item>
      </Menu>,
    );
    expect(
      wrapper
        .find('.ant-menu-sub')
        .at(0)
        .hasClass('ant-menu-hidden'),
    ).not.toBe(true);
  });

  it('horizontal', () => {
    const wrapper = mount(
      <Menu openKeys={['1']} mode="horizontal" openTransitionName="">
        <SubMenu key="1" title="submenu1">
          <Menu.Item key="submenu1">Option 1</Menu.Item>
          <Menu.Item key="submenu2">Option 2</Menu.Item>
        </SubMenu>
        <Menu.Item key="2">menu2</Menu.Item>
      </Menu>,
    );
    expect(
      wrapper
        .find('.ant-menu-sub')
        .hostNodes()
        .at(0)
        .hasClass('ant-menu-hidden'),
    ).not.toBe(true);
    wrapper.setProps({ openKeys: [] });
    wrapper.update();
    expect(
      wrapper
        .find('.ant-menu-sub')
        .hostNodes()
        .at(0)
        .hasClass('ant-menu-hidden'),
    ).toBe(true);
    wrapper.setProps({ openKeys: ['1'] });
    wrapper.update();
    expect(
      wrapper
        .find('.ant-menu-sub')
        .hostNodes()
        .at(0)
        .hasClass('ant-menu-hidden'),
    ).not.toBe(true);
  });

  it('inline', () => {
    const wrapper = mount(
      <Menu openKeys={['1']} mode="inline" openAnimation="">
        <SubMenu key="1" title="submenu1">
          <Menu.Item key="submenu1">Option 1</Menu.Item>
          <Menu.Item key="submenu2">Option 2</Menu.Item>
        </SubMenu>
        <Menu.Item key="2">menu2</Menu.Item>
      </Menu>,
    );
    expect(
      wrapper
        .find('.ant-menu-sub')
        .hostNodes()
        .at(0)
        .hasClass('ant-menu-hidden'),
    ).not.toBe(true);
    wrapper.setProps({ openKeys: [] });
    wrapper.update();
    expect(
      wrapper
        .find('.ant-menu-sub')
        .hostNodes()
        .at(0)
        .hasClass('ant-menu-hidden'),
    ).toBe(true);
    wrapper.setProps({ openKeys: ['1'] });
    wrapper.update();
    expect(
      wrapper
        .find('.ant-menu-sub')
        .hostNodes()
        .at(0)
        .hasClass('ant-menu-hidden'),
    ).not.toBe(true);
  });

  it('vertical', () => {
    const wrapper = mount(
      <Menu openKeys={['1']} mode="vertical" openTransitionName="">
        <SubMenu key="1" title="submenu1">
          <Menu.Item key="submenu1">Option 1</Menu.Item>
          <Menu.Item key="submenu2">Option 2</Menu.Item>
        </SubMenu>
        <Menu.Item key="2">menu2</Menu.Item>
      </Menu>,
    );
    expect(
      wrapper
        .find('.ant-menu-sub')
        .hostNodes()
        .at(0)
        .hasClass('ant-menu-hidden'),
    ).not.toBe(true);
    wrapper.setProps({ openKeys: [] });
    wrapper.update();
    expect(
      wrapper
        .find('.ant-menu-sub')
        .hostNodes()
        .at(0)
        .hasClass('ant-menu-hidden'),
    ).toBe(true);
    wrapper.setProps({ openKeys: ['1'] });
    wrapper.update();
    expect(
      wrapper
        .find('.ant-menu-sub')
        .hostNodes()
        .at(0)
        .hasClass('ant-menu-hidden'),
    ).not.toBe(true);
  });

  // https://github.com/ant-design/ant-design/pulls/4677
  // https://github.com/ant-design/ant-design/issues/4692
  // TypeError: Cannot read property 'indexOf' of undefined
  it('pr #4677 and issue #4692', () => {
    const wrapper = mount(
      <Menu mode="horizontal">
        <SubMenu title="submenu">
          <Menu.Item key="1">menu1</Menu.Item>
          <Menu.Item key="2">menu2</Menu.Item>
        </SubMenu>
      </Menu>,
    );
    wrapper.update();
    // just expect no error emit
  });

  it('should always follow openKeys when mode is switched', () => {
    const wrapper = mount(
      <Menu openKeys={['1']} mode="inline">
        <SubMenu key="1" title="submenu1">
          <Menu.Item key="submenu1">Option 1</Menu.Item>
          <Menu.Item key="submenu2">Option 2</Menu.Item>
        </SubMenu>
        <Menu.Item key="2">menu2</Menu.Item>
      </Menu>,
    );
    expect(
      wrapper
        .find('ul.ant-menu-sub')
        .at(0)
        .hasClass('ant-menu-hidden'),
    ).toBe(false);
    wrapper.setProps({ mode: 'vertical' });
    expect(
      wrapper
        .find('ul.ant-menu-sub')
        .at(0)
        .hasClass('ant-menu-hidden'),
    ).toBe(false);
    wrapper.setProps({ mode: 'inline' });
    expect(
      wrapper
        .find('ul.ant-menu-sub')
        .at(0)
        .hasClass('ant-menu-hidden'),
    ).toBe(false);
  });

  it('should always follow openKeys when inlineCollapsed is switched', () => {
    const wrapper = mount(
      <Menu defaultOpenKeys={['1']} mode="inline">
        <Menu.Item key="menu1">
          <Icon type="inbox" />
          <span>Option</span>
        </Menu.Item>
        <SubMenu key="1" title="submenu1">
          <Menu.Item key="submenu1">Option</Menu.Item>
          <Menu.Item key="submenu2">Option</Menu.Item>
        </SubMenu>
      </Menu>,
    );
    expect(
      wrapper
        .find('ul.ant-menu-sub')
        .at(0)
        .hasClass('ant-menu-inline'),
    ).toBe(true);
    expect(
      wrapper
        .find('ul.ant-menu-sub')
        .at(0)
        .hasClass('ant-menu-hidden'),
    ).toBe(false);

    wrapper.setProps({ inlineCollapsed: true });
    // 动画结束后套样式;
    jest.runAllTimers();
    wrapper.update();
    wrapper.simulate('transitionEnd', { propertyName: 'width' });

    expect(
      wrapper
        .find('ul.ant-menu-root')
        .at(0)
        .hasClass('ant-menu-vertical'),
    ).toBe(true);
    expect(wrapper.find('ul.ant-menu-sub').length).toBe(0);

    wrapper.setProps({ inlineCollapsed: false });
    jest.runAllTimers();
    wrapper.update();

    expect(
      wrapper
        .find('ul.ant-menu-sub')
        .at(0)
        .hasClass('ant-menu-inline'),
    ).toBe(true);
    expect(
      wrapper
        .find('ul.ant-menu-sub')
        .at(0)
        .hasClass('ant-menu-hidden'),
    ).toBe(false);
  });

  it('inlineCollapsed should works well when specify a not existed default openKeys', () => {
    const wrapper = mount(
      <Menu defaultOpenKeys={['not-existed']} mode="inline">
        <Menu.Item key="menu1">
          <Icon type="inbox" />
          <span>Option</span>
        </Menu.Item>
        <SubMenu key="1" title="submenu1">
          <Menu.Item key="submenu1">Option</Menu.Item>
          <Menu.Item key="submenu2">Option</Menu.Item>
        </SubMenu>
      </Menu>,
    );
    expect(wrapper.find('.ant-menu-sub').length).toBe(0);
    wrapper.setProps({ inlineCollapsed: true });
    jest.runAllTimers();
    wrapper.update();
    wrapper.simulate('transitionEnd', { propertyName: 'width' });
    wrapper
      .find('.ant-menu-submenu-title')
      .at(0)
      .simulate('mouseEnter');
    jest.runAllTimers();
    wrapper.update();
    expect(
      wrapper
        .find('.ant-menu-submenu')
        .at(0)
        .hasClass('ant-menu-submenu-vertical'),
    ).toBe(true);
    expect(
      wrapper
        .find('.ant-menu-submenu')
        .at(0)
        .hasClass('ant-menu-submenu-open'),
    ).toBe(true);
    expect(
      wrapper
        .find('ul.ant-menu-sub')
        .at(0)
        .hasClass('ant-menu-vertical'),
    ).toBe(true);
    expect(
      wrapper
        .find('ul.ant-menu-sub')
        .at(0)
        .hasClass('ant-menu-hidden'),
    ).toBe(false);
  });

  it('inlineCollapsed Menu.Item Tooltip can be removed', () => {
    const wrapper = mount(
      <Menu
        defaultOpenKeys={['not-existed']}
        mode="inline"
        inlineCollapsed
        getPopupContainer={node => node.parentNode}
      >
        <Menu.Item key="menu1">item</Menu.Item>
        <Menu.Item key="menu2" title="title">
          item
        </Menu.Item>
        <Menu.Item key="menu3" title={undefined}>
          item
        </Menu.Item>
        <Menu.Item key="menu4" title={null}>
          item
        </Menu.Item>
        <Menu.Item key="menu5" title="">
          item
        </Menu.Item>
        <Menu.Item key="menu6" title={false}>
          item
        </Menu.Item>
      </Menu>,
    );
    expect(
      wrapper
        .find(Menu.Item)
        .at(0)
        .find(Tooltip)
        .props().title,
    ).toBe('item');
    expect(
      wrapper
        .find(Menu.Item)
        .at(1)
        .find(Tooltip)
        .props().title,
    ).toBe('title');
    expect(
      wrapper
        .find(Menu.Item)
        .at(2)
        .find(Tooltip)
        .props().title,
    ).toBe('item');
    expect(
      wrapper
        .find(Menu.Item)
        .at(3)
        .find(Tooltip)
        .props().title,
    ).toBe(null);
    expect(
      wrapper
        .find(Menu.Item)
        .at(4)
        .find(Tooltip)
        .props().title,
    ).toBe('');
    expect(
      wrapper
        .find(Menu.Item)
        .at(4)
        .find(Tooltip)
        .props().title,
    ).toBe('');
  });

  describe('open submenu when click submenu title', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    const toggleMenu = (wrapper, index, event) => {
      wrapper
        .find('.ant-menu-submenu-title')
        .at(index)
        .simulate(event);
      jest.runAllTimers();
      wrapper.update();
    };

    it('inline', () => {
      const wrapper = mount(
        <Menu mode="inline">
          <SubMenu key="1" title="submenu1">
            <Menu.Item key="submenu1">Option 1</Menu.Item>
            <Menu.Item key="submenu2">Option 2</Menu.Item>
          </SubMenu>
          <Menu.Item key="2">menu2</Menu.Item>
        </Menu>,
      );
      expect(wrapper.find('.ant-menu-sub').length).toBe(0);
      toggleMenu(wrapper, 0, 'click');
      expect(wrapper.find('.ant-menu-sub').hostNodes().length).toBe(1);
      expect(
        wrapper
          .find('.ant-menu-sub')
          .hostNodes()
          .at(0)
          .hasClass('ant-menu-hidden'),
      ).not.toBe(true);
      toggleMenu(wrapper, 0, 'click');
      expect(
        wrapper
          .find('.ant-menu-sub')
          .hostNodes()
          .at(0)
          .hasClass('ant-menu-hidden'),
      ).toBe(true);
    });

    it('vertical', () => {
      const wrapper = mount(
        <Menu mode="vertical">
          <SubMenu key="1" title="submenu1">
            <Menu.Item key="submenu1">Option 1</Menu.Item>
            <Menu.Item key="submenu2">Option 2</Menu.Item>
          </SubMenu>
          <Menu.Item key="2">menu2</Menu.Item>
        </Menu>,
      );
      expect(wrapper.find('.ant-menu-sub').length).toBe(0);
      toggleMenu(wrapper, 0, 'mouseenter');
      expect(wrapper.find('.ant-menu-sub').hostNodes().length).toBe(1);
      expect(
        wrapper
          .find('.ant-menu-sub')
          .hostNodes()
          .at(0)
          .hasClass('ant-menu-hidden'),
      ).not.toBe(true);
      toggleMenu(wrapper, 0, 'mouseleave');
      expect(
        wrapper
          .find('.ant-menu-sub')
          .hostNodes()
          .at(0)
          .hasClass('ant-menu-hidden'),
      ).toBe(true);
    });

    it('horizontal', () => {
      jest.useFakeTimers();
      const wrapper = mount(
        <Menu mode="horizontal">
          <SubMenu key="1" title="submenu1">
            <Menu.Item key="submenu1">Option 1</Menu.Item>
            <Menu.Item key="submenu2">Option 2</Menu.Item>
          </SubMenu>
          <Menu.Item key="2">menu2</Menu.Item>
        </Menu>,
      );
      expect(wrapper.find('.ant-menu-sub').length).toBe(0);
      toggleMenu(wrapper, 0, 'mouseenter');
      expect(wrapper.find('.ant-menu-sub').hostNodes().length).toBe(1);
      expect(
        wrapper
          .find('.ant-menu-sub')
          .hostNodes()
          .at(0)
          .hasClass('ant-menu-hidden'),
      ).not.toBe(true);
      toggleMenu(wrapper, 0, 'mouseleave');
      expect(
        wrapper
          .find('.ant-menu-sub')
          .hostNodes()
          .at(0)
          .hasClass('ant-menu-hidden'),
      ).toBe(true);
    });
  });

  it('inline title', () => {
    jest.useFakeTimers();
    const wrapper = mount(
      <Menu mode="inline" inlineCollapsed>
        <Menu.Item key="1" title="bamboo lucky">
          <Icon type="pie-chart" />
          <span>
            Option 1
            <img
              style={{ width: 20 }}
              alt="test"
              src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            />
          </span>
        </Menu.Item>
      </Menu>,
    );

    wrapper.find('.ant-menu-item').simulate('mouseenter');
    jest.runAllTimers();
    wrapper.update();

    const text = wrapper.find('.ant-tooltip-inner').text();
    expect(text).toBe('bamboo lucky');

    jest.useRealTimers();
  });

  it('render correctly when using with Layout.Sider', () => {
    class Demo extends React.Component {
      state = {
        collapsed: false,
      };

      onCollapse = collapsed => this.setState({ collapsed });

      render() {
        const { collapsed } = this.state;
        return (
          <Layout style={{ minHeight: '100vh' }}>
            <Layout.Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
              <div className="logo" />
              <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <SubMenu
                  key="sub1"
                  title={
                    <span>
                      <Icon type="user" />
                      <span>User</span>
                    </span>
                  }
                >
                  <Menu.Item key="3">Tom</Menu.Item>
                  <Menu.Item key="4">Bill</Menu.Item>
                  <Menu.Item key="5">Alex</Menu.Item>
                </SubMenu>
              </Menu>
            </Layout.Sider>
          </Layout>
        );
      }
    }
    const wrapper = mount(<Demo />);
    wrapper.find('.ant-menu-submenu-title').simulate('click');
    wrapper.find('.ant-layout-sider-trigger').simulate('click');
    jest.runAllTimers();
    wrapper.update();
    expect(wrapper.find('.ant-menu-submenu-popup').length).toBe(0);
  });

  it('onMouseEnter should work', () => {
    const onMouseEnter = jest.fn();
    const wrapper = mount(
      <Menu onMouseEnter={onMouseEnter} defaultSelectedKeys={['test1']}>
        <Menu.Item key="test1">Navigation One</Menu.Item>
        <Menu.Item key="test2">Navigation Two</Menu.Item>
      </Menu>,
    );
    wrapper
      .find('Menu')
      .at(1)
      .simulate('mouseenter');
    expect(onMouseEnter).toHaveBeenCalled();
  });

  describe('motion', () => {
    it('get correct animation type when switched from inline', () => {
      const wrapper = mount(<Menu mode="inline" />);
      wrapper.setProps({ mode: 'horizontal' });
      expect(
        wrapper
          .find('InternalMenu')
          .instance()
          .getOpenMotionProps(''),
      ).toEqual({ motion: { motionName: '' } });
    });

    it('warning if use `openAnimation` as object', () => {
      resetWarned();

      const warnSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mount(<Menu openAnimation={{}} />);
      expect(warnSpy).toHaveBeenCalledWith(
        'Warning: [antd: Menu] `openAnimation` do not support object. Please use `motion` instead.',
      );
      warnSpy.mockRestore();
    });

    it('motion object', () => {
      const motion = { test: true };
      const wrapper = mount(<Menu motion={motion} />);
      expect(
        wrapper
          .find('InternalMenu')
          .instance()
          .getOpenMotionProps(''),
      ).toEqual({ motion });
    });

    it('legacy openTransitionName', () => {
      const wrapper = mount(<Menu openTransitionName="legacy" />);
      expect(
        wrapper
          .find('InternalMenu')
          .instance()
          .getOpenMotionProps(''),
      ).toEqual({ openTransitionName: 'legacy' });
    });
  });

  it('MenuItem should not render Tooltip when inlineCollapsed is false', () => {
    const wrapper = mount(
      <Menu defaultSelectedKeys={['mail']} defaultOpenKeys={['mail']} mode="horizontal">
        <Menu.Item key="mail">
          <Icon type="mail" />
          Navigation One
        </Menu.Item>
        <Menu.Item key="app">
          <Icon type="appstore" />
          Navigation Two
        </Menu.Item>
        <Menu.Item key="alipay">
          <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
            Navigation Four - Link
          </a>
        </Menu.Item>
      </Menu>,
    );
    wrapper
      .find('MenuItem')
      .first()
      .simulate('mouseenter');
    jest.runAllTimers();
    wrapper.update();
    expect(wrapper.find('.ant-tooltip-inner').length).toBe(0);
  });

  it('should controlled collapse work', () => {
    const wrapper = mount(
      <Menu mode="inline" inlineCollapsed={false}>
        <Menu.Item key="1">
          <Icon type="pie-chart" />
          <span>Option 1</span>
        </Menu.Item>
      </Menu>,
    );

    expect(wrapper.render()).toMatchSnapshot();

    wrapper.setProps({ inlineCollapsed: true });

    expect(wrapper.render()).toMatchSnapshot();
  });

  it('not title if not collapsed', () => {
    jest.useFakeTimers();
    const wrapper = mount(
      <Menu mode="inline" inlineCollapsed={false}>
        <Menu.Item key="1">
          <Icon type="pie-chart" />
          <span>Option 1</span>
        </Menu.Item>
      </Menu>,
    );

    wrapper.find('.ant-menu-item').simulate('mouseenter');
    jest.runAllTimers();
    wrapper.update();

    expect(wrapper.find('.ant-tooltip-inner').length).toBeFalsy();

    jest.useRealTimers();
  });

  it('props#onOpen and props#onClose do not warn anymore', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const onOpen = jest.fn();
    const onClose = jest.fn();
    mount(
      <Menu defaultOpenKeys={['1']} mode="inline" onOpen={onOpen} onClose={onClose}>
        <SubMenu key="1" title="submenu1">
          <Menu.Item key="submenu1">Option 1</Menu.Item>
          <Menu.Item key="submenu2">Option 2</Menu.Item>
        </SubMenu>
        <Menu.Item key="2">menu2</Menu.Item>
      </Menu>,
    );

    expect(errorSpy.mock.calls.length).toBe(1);
    expect(errorSpy.mock.calls[0][0]).not.toContain(
      '`onOpen` and `onClose` are removed, please use `onOpenChange` instead, see: https://u.ant.design/menu-on-open-change.',
    );
    expect(onOpen).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  // https://github.com/ant-design/ant-design/issues/18825
  // https://github.com/ant-design/ant-design/issues/8587
  it('should keep selectedKeys in state when collapsed to 0px', () => {
    jest.useFakeTimers();
    const wrapper = mount(
      <Menu
        mode="inline"
        inlineCollapsed={false}
        defaultSelectedKeys={['1']}
        collapsedWidth={0}
        openKeys={['3']}
      >
        <Menu.Item key="1">Option 1</Menu.Item>
        <Menu.Item key="2">Option 2</Menu.Item>
        <Menu.SubMenu key="3" title="Option 3">
          <Menu.Item key="4">Option 4</Menu.Item>
        </Menu.SubMenu>
      </Menu>,
    );
    expect(wrapper.find('.ant-menu-item-selected').getDOMNode().textContent).toBe('Option 1');
    wrapper
      .find('.ant-menu-item')
      .at(1)
      .simulate('click');
    expect(wrapper.find('.ant-menu-item-selected').getDOMNode().textContent).toBe('Option 2');
    wrapper.setProps({ inlineCollapsed: true });
    jest.runAllTimers();
    wrapper.update();
    expect(
      wrapper
        .find('Trigger')
        .map(node => node.prop('popupVisible'))
        .findIndex(node => !!node),
    ).toBe(-1);
    wrapper.setProps({ inlineCollapsed: false });
    expect(wrapper.find('.ant-menu-item-selected').getDOMNode().textContent).toBe('Option 2');
    jest.useRealTimers();
  });
});
