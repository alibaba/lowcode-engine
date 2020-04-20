import React, { Component, PureComponent } from 'react';
import { Tab, Breadcrumb } from '@alifd/next';
import { Title, createIcon, observer } from '@ali/lowcode-globals';
import { Node } from '@ali/lowcode-designer';
import OutlinePane from '@ali/lowcode-plugin-outline-pane';
import Editor from '@ali/lowcode-editor-core';
import { SettingsMain } from './main';
import SettingsPane from './settings-pane';
import { isSettingField, SettingField } from './setting-field';

@observer
export default class SettingsMainView extends Component<{ editor: Editor }> {
  private main = new SettingsMain(this.props.editor);

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
    if (settings.isMultiNodes) {
      return (
        <div className="lc-settings-navigator">
          {createIcon(settings.componentMeta?.icon, { className: 'lc-settings-navigator-icon'})}
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
      items.unshift(<Breadcrumb.Item {...props} key={node.id}><Title title={node.title} /></Breadcrumb.Item>);
      node = node.parent;
    }

    return (
      <div className="lc-settings-navigator">
        {createIcon(this.main.componentMeta?.icon, { className: 'lc-settings-navigator-icon'})}
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
          <OutlinePaneEntry main={this.main} />
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
          <OutlinePaneEntry main={this.main} />
          <div className="lc-settings-notice">
            <p>请选中同一类型节点编辑</p>
          </div>
        </div>
      );
    }

    const { items } = settings;
    if (items.length > 5 || items.some(item => !isSettingField(item) || !item.isGroup)) {
      return (
        <div className="lc-settings-main">
          <OutlinePaneEntry main={this.main} />
          {this.renderBreadcrumb()}
          <div className="lc-settings-body">
            <SettingsPane target={settings} />
          </div>
        </div>
      );
    }

    return (
      <div className="lc-settings-main">
        <OutlinePaneEntry main={this.main} />
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

class OutlinePaneEntry extends PureComponent<{ main: SettingsMain }> {
  state = {
    outlineInited: false,
  };
  private dispose = this.props.main.onceOutlineVisible(() => {
    this.setState({
      outlineInited: true,
    });
  });
  componentWillUnmount() {
    this.dispose();
  }
  render() {
    if (!this.state.outlineInited) {
      return null;
    }
    return <OutlinePane editor={this.props.main.editor} config={{
      name: '__IN_SETTINGS__'
    }} />;
  }
}

function hoverNode(node: Node, flag: boolean) {
  node.hover(flag);
}
function selectNode(node: Node) {
  node.select();
}
