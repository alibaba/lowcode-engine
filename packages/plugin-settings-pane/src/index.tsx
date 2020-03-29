import React, { Component } from 'react';
import { Tab, Breadcrumb } from '@alifd/next';
import { Title, createIcon } from '@ali/lowcode-globals';
import { Node } from '@ali/lowcode-designer';
import { SettingsMain, SettingField, isSettingField } from './main';
import SettingsPane, { createSettingFieldView } from './settings-pane';
import './transducers/register';
import './setters/register';
import './style.less';

export default class SettingsMainView extends Component {
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
          {createIcon(this.main.componentMeta?.icon)}
          <Title title={this.main.componentMeta!.title} />
          <span>x {this.main.nodes.length}</span>
        </div>
      );
    }

    let node: Node | null = this.main.nodes[0]!;
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
      items.unshift(<Breadcrumb.Item {...props} key={node.id}><Title title={node.title} /></Breadcrumb.Item>);
      node = node.parent;
    }

    return (
      <div className="lc-settings-navigator">
        {createIcon(this.main.componentMeta?.icon)}
        <Breadcrumb className="lc-settings-node-breadcrumb">{items}</Breadcrumb>
      </div>
    );
  }

  render() {
    if (this.main.isNone) {
      // 未选中节点，提示选中 或者 显示根节点设置
      return (
        <div className="lc-settings-main">
          <div className="lc-settings-notice">
            <p>请在左侧画布选中节点</p>
          </div>
        </div>
      );
    }

    if (!this.main.isSame) {
      // todo: future support 获取设置项交集编辑
      return (
        <div className="lc-settings-main">
          <div className="lc-settings-notice">
            <p>请选中同一类型节点编辑</p>
          </div>
        </div>
      );
    }

    const { items } = this.main;
    if (items.length > 5 || items.some(item => !isSettingField(item) || !item.isGroup)) {
      return (
        <div className="lc-settings-main">
          {this.renderBreadcrumb()}
          <div className="lc-settings-body">
            <SettingsPane target={this.main} />
          </div>
        </div>
      );
    }

    return (
      <div className="lc-settings-main">
        <Tab
          navClassName="lc-settings-tabs"
          animation={false}
          excessMode="dropdown"
          contentClassName="lc-settings-tabs-content"
          extra={this.renderBreadcrumb()}
        >
          {(items as SettingField[]).map(field => (
            <Tab.Item className="lc-settings-tab-item" title={<Title title={field.title} />} key={field.name}>
              <SettingsPane target={field} key={field.id} />
            </Tab.Item>
          ))}
        </Tab>
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

export { createSettingFieldView };
