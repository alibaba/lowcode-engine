import React, { Component } from 'react';
import { Tab, Breadcrumb } from '@alifd/next';
import { Title, observer, Editor, obx, globalContext, engineConfig, makeObservable } from '@alilc/lowcode-editor-core';
import { Node, SettingField, isSettingField, INode } from '@alilc/lowcode-designer';
import classNames from 'classnames';
import { SettingsMain } from './main';
import { SettingsPane } from './settings-pane';
import { StageBox } from '../stage-box';
import { SkeletonContext } from '../../context';
import { intl } from '../../locale';
import { createIcon } from '@alilc/lowcode-utils';

interface ISettingsPrimaryPaneProps {
  engineEditor: Editor;
  config: any;
}

@observer
export class SettingsPrimaryPane extends Component<ISettingsPrimaryPaneProps, { shouldIgnoreRoot: boolean }> {
  state = {
    shouldIgnoreRoot: false,
  };
  private main = new SettingsMain(this.props.engineEditor);

  @obx.ref private _activeKey?: any;

  constructor(props: ISettingsPrimaryPaneProps) {
    super(props);
    makeObservable(this);
  }

  componentDidMount() {
    this.setShouldIgnoreRoot();

    const editor = this.props.engineEditor;

    editor.eventBus.on('designer.selection.change', () => {
      if (!engineConfig.get('stayOnTheSameSettingTab', false)) {
        this._activeKey = null;
      }
    });
  }

  async setShouldIgnoreRoot() {
    const designMode = await globalContext.get('editor').get('designMode');
    this.setState({
      shouldIgnoreRoot: designMode === 'live',
    });
  }

  componentWillUnmount() {
    this.main.purge();
  }

  renderBreadcrumb() {
    const { settings, editor } = this.main;
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
          })}
          <Title title={settings.componentMeta!.title} />
          <span> x {settings.nodes.length}</span>
        </div>
      );
    }

    const designer = editor.get('designer');
    const current = designer?.currentSelection?.getNodes()?.[0];
    let node: INode | null = settings.first;
    const focusNode = node.document?.focusNode;

    const items = [];
    let l = 3;
    while (l-- > 0 && node) {
      const _node = node;
      // dirty code: should remove
      if (shouldIgnoreRoot && node.isRoot()) {
        break;
      }
      if (focusNode && node.contains(focusNode)) {
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
              editor?.eventBus.emit('skeleton.settingsPane.Breadcrumb', {
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
    const editor = this.props.engineEditor;
    if (!settings) {
      // 未选中节点，提示选中 或者 显示根节点设置
      return (
        <div className="lc-settings-main">
          <div className="lc-settings-notice">
            <p>{intl('Please select a node in canvas')}</p>
          </div>
        </div>
      );
    }

    // 当节点被锁定，且未开启锁定后容器可设置属性
    if (settings.isLocked && !engineConfig.get('enableLockedNodeSetting', false)) {
      return (
        <div className="lc-settings-main">
          <div className="lc-settings-notice">
            <p>{intl('Current node is locked')}</p>
          </div>
        </div>
      );
    }
    if (Array.isArray(settings.items) && settings.items.length === 0) {
      return (
        <div className="lc-settings-main">
          <div className="lc-settings-notice">
            <p>{intl('No config found for this type of component')}</p>
          </div>
        </div>
      );
    }

    if (!settings.isSameComponent) {
      // TODO: future support 获取设置项交集编辑
      return (
        <div className="lc-settings-main">
          <div className="lc-settings-notice">
            <p>{intl('Please select same kind of components')}</p>
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
              editor?.eventBus.emit('skeleton.settingsPane.change', {
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

    const className = classNames('lc-settings-main', {
      'lc-settings-hide-tabs':
        items.length === 1 && engineConfig.get('hideSettingsTabsWhenOnlyOneItem', false),
    });
    return (
      <div className={className}>
        { this.renderBreadcrumb() }
        <Tab
          activeKey={activeKey}
          onChange={(tabKey) => {
            this._activeKey = tabKey;
          }}
          navClassName="lc-settings-tabs"
          animation={false}
          excessMode="dropdown"
          contentClassName="lc-settings-tabs-content"
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
