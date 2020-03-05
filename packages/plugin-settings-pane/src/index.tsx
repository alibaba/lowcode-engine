import React, { Component } from 'react';
import { Tab, Breadcrumb, Icon } from '@alifd/next';
import { SettingsMain, SettingField, isSettingField } from './main';
import './style.less';
import Title from './title';
import SettingsTab, { registerSetter, createSetterContent, getSetter, createSettingFieldView } from './settings-tab';

export default class SettingsPane extends Component {
  private main: SettingsMain;

  constructor(props: any) {
    super(props);
    this.main = new SettingsMain(props.editor);
    this.main.onNodesChange(() => {
      this.forceUpdate();
    });
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    this.main.purge();
  }

  renderBreadcrumb() {
    if (this.main.isMulti) {
      return (
        <div className="lc-settings-navigator">
          {this.main.componentType ? this.main.componentType.icon : <Icon type="ellipsis" />}
          <span>多个节点</span>
        </div>
      );
    }

    return (
      <div className="lc-settings-navigator">
        {this.main.componentType ? this.main.componentType.icon : <Icon type="ellipsis" />}
        <Breadcrumb>
          <Breadcrumb.Item>页面</Breadcrumb.Item>
          <Breadcrumb.Item>容器</Breadcrumb.Item>
          <Breadcrumb.Item>输入框</Breadcrumb.Item>
        </Breadcrumb>
      </div>
    );
  }

  render() {
    if (this.main.isNone) {
      // 未选中节点，提示选中 或者 显示根节点设置
      return <div className="lc-settings-pane">请选中节点</div>;
    }

    if (!this.main.isSame) {
      // todo: future support 获取设置项交集编辑
      return <div className="lc-settings-pane">选中同一类型节点编辑</div>;
    }

    const { items } = this.main;
    if (items.length > 5 || items.some(item => !isSettingField(item) || !item.isGroup)) {
      return (
        <div className="lc-settings-pane">
          {this.renderBreadcrumb()}
          <div className="lc-settings-body">
            <SettingsTab target={this.main} />
          </div>
        </div>
      );
    }

    return (
      <div className="lc-settings-pane">
        <Tab
          navClassName="lc-settings-tabs"
          animation={false}
          contentClassName="lc-settings-tabs-content"
          extra={this.renderBreadcrumb()}
        >
          {(items as SettingField[]).map(field => (
            <Tab.Item className="lc-settings-tab-item" title={<Title title={field.title} />} key={field.name}>
              <SettingsTab target={field} />
            </Tab.Item>
          ))}
        </Tab>
      </div>
    );
  }
}

export { registerSetter, createSetterContent, getSetter, createSettingFieldView };
