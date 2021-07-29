import React, { Component } from 'react';
import { Tab, Breadcrumb } from '@alifd/next';
import { Title, observer, Editor, obx, globalContext } from '@ali/lowcode-editor-core';
import { Node, isSettingField, SettingField, Designer } from '@ali/lowcode-designer';
import { SettingsMain } from './main';
import { SettingsPane } from './settings-pane';
import { StageBox } from '../stage-box';
import { SkeletonContext } from '../../context';
import { createIcon } from '@ali/lowcode-utils';
@observer
export class SettingsPrimaryPane extends Component<{ editor: Editor; config: any }, { shouldIgnoreRoot: boolean }> {
  state = {
    shouldIgnoreRoot: false,
  };
  private main = new SettingsMain(this.props.editor);

  @obx.ref private _activeKey?: any;

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    this.setShouldIgnoreRoot();

    this.props.editor.on('designer.selection.change', () => {
      this._activeKey = null;
    });
  }

  async setShouldIgnoreRoot() {
    const designMode = await this.props.editor.get('designMode');
    this.setState({
      shouldIgnoreRoot: designMode === 'live',
    });
  }

  componentWillUnmount() {
    this.main.purge();
  }

  renderBreadcrumb() {
    const { settings } = this.main;
    const { config } = this.props;
    // const shouldIgnoreRoot = config.props?.ignoreRoot;
    const { shouldIgnoreRoot } = this.state;
    if (!settings) {
      return null;
    }
    if (settings.isMultiple) {
      return (
        <div className="lc-settings-navigator">
          {createIcon(settings.componentMeta?.icon, {
            className: 'lc-settings-navigator-icon',
            class: 'lc-settings-navigator-icon',
          })}
          <Title title={settings.componentMeta!.title} />
          <span> x {settings.nodes.length}</span>
        </div>
      );
    }

    const editor = globalContext.get(Editor);
    const designer = editor.get(Designer);
    const current = designer?.currentSelection?.getNodes()?.[0];
    let node: Node | null = settings.first;
    const focusNode = node.document.focusNode;

    const items = [];
    let l = 3;
    while (l-- > 0 && node) {
      const _node = node;
      // dirty code: should remove
      if (shouldIgnoreRoot && node.isRoot()) {
        break;
      }
      if (node.contains(focusNode)) {
        l = 0;
      }
      const props =
        l === 2
          ? {}
          : {
            onMouseOver: hoverNode.bind(null, _node, true),
            onMouseOut: hoverNode.bind(null, _node, false),
            onClick: () => {
              if (!_node) {
                return;
              }
              selectNode.call(null, _node);
              const getName = (node: any) => {
                const npm = node?.componentMeta?.npm;
                return [npm?.package, npm?.componentName].filter((item) => !!item).join('-') ||
                  node?.componentMeta?.componentName ||
                  '';
              };
              const selected = getName(current);
              const target = getName(_node);
              editor?.emit('skeleton.settingsPane.Breadcrumb', {
                selected,
                target,
              });
            },
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
        {createIcon(this.main.componentMeta?.icon, {
          className: 'lc-settings-navigator-icon',
          class: 'lc-settings-navigator-icon',
        })}
        <Breadcrumb className="lc-settings-node-breadcrumb">{items}</Breadcrumb>
      </div>
    );
  }

  render() {
    const { settings } = this.main;
    const editor = globalContext.get(Editor);
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

    if (Array.isArray(settings.items) && settings.items.length === 0) {
      return (
        <div className="lc-settings-main">
          <div className="lc-settings-notice">
            <p>该组件暂无配置</p>
          </div>
        </div>
      );
    }

    if (!settings.isSameComponent) {
      // TODO: future support 获取设置项交集编辑
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
            <SkeletonContext.Consumer>
              {(skeleton) => {
                if (skeleton) {
                  return (
                    <StageBox skeleton={skeleton} target={settings} key={settings.id}>
                      <SettingsPane target={settings} usePopup={false} />
                    </StageBox>
                  );
                }
                return null;
              }}
            </SkeletonContext.Consumer>
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
        <Tab.Item
          className="lc-settings-tab-item"
          title={<Title title={field.title} />}
          key={field.name}
          onClick={
            () => {
              editor?.emit('skeleton.settingsPane.change', {
                name: field.name,
                title: field.title,
              });
            }
          }
        >
          <SkeletonContext.Consumer>
            {(skeleton) => {
              if (skeleton) {
                return (
                  <StageBox skeleton={skeleton} target={field} key={field.id}>
                    <SettingsPane target={field} key={field.id} usePopup={false} />
                  </StageBox>
                );
              }
              return null;
            }}
          </SkeletonContext.Consumer>
        </Tab.Item>
      );
    });
    const activeKey = matched ? this._activeKey : (items[0] as SettingField).name;

    return (
      <div className="lc-settings-main">
        <Tab
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
        </Tab>
      </div>
    );
  }
}

function hoverNode(node: Node, flag: boolean) {
  node.hover(flag);
}
function selectNode(node: Node) {
  node?.select();
}
