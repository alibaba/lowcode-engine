import React, { Component } from 'react';
import { Breadcrumb } from '@alifd/next';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import { Title, observer, Editor, obx } from '@ali/lowcode-editor-core';
import { Node, isSettingField, SettingField } from '@ali/lowcode-designer';
import { SettingsMain } from './main';
import { SettingsPane } from './settings-pane';
import { createIcon } from '@ali/lowcode-utils';
import 'react-tabs/style/react-tabs.css';

@observer
export class SettingsPrimaryPane extends Component<{ editor: Editor }> {
  private main = new SettingsMain(this.props.editor);

  @obx.ref private _activeKey?: any;

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    this.main.purge();
  }

  renderBreadcrumb() {
    const { settings } = this.main;
    if (!settings) {
      return null;
    }
    if (settings.isMultiple) {
      return (
        <div className="lc-settings-navigator">
          {createIcon(settings.componentMeta?.icon, { className: 'lc-settings-navigator-icon' })}
          <Title title={settings.componentMeta!.title} />
          <span>x {settings.nodes.length}</span>
        </div>
      );
    }

    let node: Node | null = settings.first;
    const items = [];
    let l = 3;
    while (l-- > 0 && node) {
      const props =
        l === 2
          ? {}
          : {
              onMouseOver: hoverNode.bind(null, node, true),
              onMouseOut: hoverNode.bind(null, node, false),
              onClick: selectNode.bind(null, node),
            };
      items.unshift(
        <Breadcrumb.Item {...props} key={node.id}>
          <Title title={node.title} />
        </Breadcrumb.Item>,
      );
      node = node.parent;
    }

    return (
      <div className="lc-settings-navigator">
        {createIcon(this.main.componentMeta?.icon, { className: 'lc-settings-navigator-icon' })}
        <Breadcrumb className="lc-settings-node-breadcrumb">{items}</Breadcrumb>
      </div>
    );
  }

  render() {
    const { settings } = this.main;
    if (!settings) {
      // 未选中节点，提示选中 或者 显示根节点设置
      return (
        <div className="lc-settings-main">
          <div className="lc-settings-notice">
            <p>请在左侧画布选中节点</p>
          </div>
        </div>
      );
    }

    if (!settings.isSameComponent) {
      // todo: future support 获取设置项交集编辑
      return (
        <div className="lc-settings-main">
          <div className="lc-settings-notice">
            <p>请选中同一类型节点编辑</p>
          </div>
        </div>
      );
    }

    const { items } = settings;
    if (items.length > 5 || items.some((item) => !isSettingField(item) || !item.isGroup)) {
      return (
        <div className="lc-settings-main">
          {this.renderBreadcrumb()}
          <div className="lc-settings-body">
            <SettingsPane target={settings} />
          </div>
        </div>
      );
    }

    let matched = false;
    const tabs = (items as SettingField[]).map((field) => {
      if (this._activeKey === field.name) {
        matched = true;
      }
      return (
        <Tab.Item className="lc-settings-tab-item" title={<Title title={field.title} />} key={field.name}>
          <SettingsPane target={field} key={field.id} />
        </Tab.Item>
      );
    });
    const activeKey = matched ? this._activeKey : (items[0] as SettingField).name;

    return (
      <div className="lc-settings-main">
        <Tabs
          selectedKey={activeKey}
          onSelect={(tabKey) => {
            this._activeKey = tabKey;
          }}
          className="lc-settings-tabs"
        >
          <TabList>
            {
              (items as SettingField[]).map((field) => {
                return <Tab><Title title={field.title} /></Tab>
              })
            }
          </TabList>

          {
            (items as SettingField[]).map((field) => {
              return (
                <TabPanel className="lc-settings-tabs-content">
                  { this.renderBreadcrumb() }
                  <SettingsPane target={field} key={field.id} />
                </TabPanel>
              )
            })
          }
        </Tabs>
        {/* <Tab
          activeKey={activeKey}
          onChange={(tabKey) => {
            this._activeKey = tabKey;
          }}
          navClassName="lc-settings-tabs"
          animation={false}
          excessMode="dropdown"
          contentClassName="lc-settings-tabs-content"
          extra={this.renderBreadcrumb()}
        >
          {tabs}
        </Tab> */}
      </div>
    );
  }
}

function hoverNode(node: Node, flag: boolean) {
  node.hover(flag);
}
function selectNode(node: Node) {
  node.select();
}
