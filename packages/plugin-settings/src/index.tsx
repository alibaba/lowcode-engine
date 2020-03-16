import React, { Component } from 'react';
import { Tab, Breadcrumb, Icon } from '@alifd/next';
import { SettingsMain, SettingField, isSettingField } from './main';
import './style.less';
import Title from './title';
import SettingsPane, { registerSetter, createSetterContent, getSetter, createSettingFieldView } from './settings-pane';
import Node from '../../designer/src/designer/document/node/node';
import ArraySetter from './builtin-setters/array-setter';
import ObjectSetter from './builtin-setters/object-setter';
import './register-transducer';

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
          {this.main.componentMeta!.icon || <Icon type="ellipsis" size="small" />}
          <span>
            {this.main.componentMeta!.title} x {this.main.nodes.length}
          </span>
        </div>
      );
    }

    let node: Node | null = this.main.nodes[0]!;
    const items = [];
    let l = 4;
    while (l-- > 0 && node) {
      const props =
        l === 3
          ? {}
          : {
              onMouseOver: hoverNode.bind(null, node, true),
              onMouseOut: hoverNode.bind(null, node, false),
              onClick: selectNode.bind(null, node),
            };
      items.unshift(<Breadcrumb.Item {...props} key={node.id}>{node.title}</Breadcrumb.Item>);
      node = node.parent;
    }

    return (
      <div className="lc-settings-navigator">
        {this.main.componentMeta!.icon || <Icon type="ellipsis" size="small" />}
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

registerSetter('ArraySetter', ArraySetter);
registerSetter('ObjectSetter', ObjectSetter);

export { registerSetter, createSetterContent, getSetter, createSettingFieldView };
