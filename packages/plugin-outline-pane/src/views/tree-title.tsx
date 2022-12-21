/* eslint-disable max-len */
import { Component, KeyboardEvent, FocusEvent, Fragment } from 'react';
import classNames from 'classnames';
import { createIcon } from '@alilc/lowcode-utils';
import { IPublicModelPluginContext, IPublicApiEvent } from '@alilc/lowcode-types';
import TreeNode from '../controllers/tree-node';
import { IconLock, IconUnlock, IconArrowRight, IconEyeClose, IconEye, IconCond, IconLoop, IconRadioActive, IconRadio, IconSetting } from '../icons';


function emitOutlineEvent(event: IPublicApiEvent, type: string, treeNode: TreeNode, rest?: Record<string, unknown>) {
  const node = treeNode?.node;
  const npm = node?.componentMeta?.npm;
  const selected =
    [npm?.package, npm?.componentName].filter((item) => !!item).join('-') || node?.componentMeta?.componentName || '';
  event.emit(`outlinePane.${type}`, {
    selected,
    ...rest,
  });
}

export default class TreeTitle extends Component<{
  treeNode: TreeNode;
  isModal?: boolean;
  pluginContext: IPublicModelPluginContext;
}> {
  state: {
    editing: boolean;
    title: string;
  } = {
    editing: false,
    title: '',
  };

  private enableEdit = (e) => {
    e.preventDefault();
    this.setState({
      editing: true,
    });
  };

  private cancelEdit() {
    this.setState({
      editing: false,
    });
    this.lastInput = undefined;
  }

  private saveEdit = (e: FocusEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>) => {
    const { treeNode } = this.props;
    const value = (e.target as HTMLInputElement).value || '';
    treeNode.setTitleLabel(value);
    emitOutlineEvent(this.props.pluginContext.event, 'rename', treeNode, { value });
    this.cancelEdit();
  };

  private handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      this.saveEdit(e);
    }
    if (e.keyCode === 27) {
      this.cancelEdit();
    }
  };

  private lastInput?: HTMLInputElement;

  private setCaret = (input: HTMLInputElement | null) => {
    if (!input || this.lastInput === input) {
      return;
    }
    input.focus();
    input.select();
    // 光标定位最后一个
    // input.selectionStart = input.selectionEnd;
  };
  offTitleLabelChanged: (() => void) | undefined;

  componentDidMount() {
    const { treeNode, pluginContext } = this.props;
    const { id } = treeNode;
    const { pluginEvent } = pluginContext;
    this.setState({
      editing: false,
      title: treeNode.titleLabel,
    });
    this.offTitleLabelChanged = pluginEvent.on('tree-node.titleLabelChanged', (payload: any) => {
      const { nodeId } = payload;
      if (nodeId === id) {
        this.setState({
          title: treeNode.titleLabel,
        });
      }
    });
  }

  componentWillUnmount(): void {
    if (this.offTitleLabelChanged) {
      this.offTitleLabelChanged();
    }
  }

  render() {
    const { treeNode, isModal, pluginContext } = this.props;
    const { editing } = this.state;
    const isCNode = !treeNode.isRoot();
    const { node } = treeNode;
    const isNodeParent = node.isParentalNode;
    const isContainer = node.isContainerNode;
    let style: any;
    if (isCNode) {
      const { depth } = treeNode;
      const indent = depth * 12;
      style = {
        paddingLeft: indent + (isModal ? 12 : 0),
        marginLeft: -indent,
      };
    }
    const { filterWorking, matchSelf, keywords } = treeNode.filterReult;
    const Extra = pluginContext.extraTitle;
    const { intlNode, common, config } = pluginContext;
    const Tip = common.editorCabin.Tip;
    const Title = common.editorCabin.Title;
    const shouldShowHideBtn = isCNode && isNodeParent && !isModal;
    const shouldShowLockBtn = config.get('enableCanvasLock', false) && isContainer && isCNode && isNodeParent;
    const shouldEditBtn = isCNode && isNodeParent;
    return (
      <div
        className={classNames('tree-node-title', { editing })}
        style={style}
        data-id={treeNode.id}
        onClick={() => {
          if (isModal) {
            if (node.getVisible()) {
              node.document?.modalNodesManager?.setInvisible(node);
            } else {
              node.document?.modalNodesManager?.setVisible(node);
            }
            return;
          }
          if (node.conditionGroup) {
            node.setConditionalVisible();
          }
        }}
      >
        {isModal && node.getVisible() && (
          <div onClick={() => {
            node.document?.modalNodesManager?.setInvisible(node);
          }}
          >
            <IconRadioActive className="tree-node-modal-radio-active" />
          </div>
        )}
        {isModal && !node.getVisible() && (
          <div onClick={() => {
            node.document?.modalNodesManager?.setVisible(node);
          }}
          >
            <IconRadio className="tree-node-modal-radio" />
          </div>
        )}
        {isCNode && <ExpandBtn treeNode={treeNode} pluginContext={this.props.pluginContext} />}
        <div className="tree-node-icon">{createIcon(treeNode.icon)}</div>
        <div className="tree-node-title-label">
          {editing ? (
            <input
              className="tree-node-title-input"
              defaultValue={this.state.title}
              onBlur={this.saveEdit}
              ref={this.setCaret}
              onKeyUp={this.handleKeyUp}
            />
          ) : (
            <Fragment>
              <Title
                title={this.state.title}
                match={filterWorking && matchSelf}
                keywords={keywords}
              />
              {Extra && <Extra node={treeNode?.node} />}
              {node.slotFor && (
                <a className="tree-node-tag slot">
                  {/* todo: click redirect to prop */}
                  <Tip>{intlNode('Slot for {prop}', { prop: node.slotFor.key })}</Tip>
                </a>
              )}
              {node.hasLoop() && (
                <a className="tree-node-tag loop">
                  {/* todo: click todo something */}
                  <IconLoop />
                  <Tip>{intlNode('Loop')}</Tip>
                </a>
              )}
              {node.hasCondition() && !node.conditionGroup && (
                <a className="tree-node-tag cond">
                  {/* todo: click todo something */}
                  <IconCond />
                  <Tip>{intlNode('Conditional')}</Tip>
                </a>
              )}
            </Fragment>
          )}
        </div>
        {shouldShowHideBtn && <HideBtn treeNode={treeNode} pluginContext={this.props.pluginContext} />}
        {shouldShowLockBtn && <LockBtn treeNode={treeNode} pluginContext={this.props.pluginContext} />}
        {shouldEditBtn && <RenameBtn treeNode={treeNode} pluginContext={this.props.pluginContext} onClick={this.enableEdit} /> }

      </div>
    );
  }
}

class RenameBtn extends Component<{
  treeNode: TreeNode;
  pluginContext: IPublicModelPluginContext;
  onClick: (e: any) => void;
}> {
  render() {
    const { intl, common } = this.props.pluginContext;
    const Tip = common.editorCabin.Tip;
    return (
      <div
        className="tree-node-rename-btn"
        onClick={this.props.onClick}
      >
        <IconSetting />
        <Tip>{intl('Rename')}</Tip>
      </div>
    );
  }
}


class LockBtn extends Component<{
  treeNode: TreeNode;
  pluginContext: IPublicModelPluginContext;
}, {
  locked: boolean;
}> {
  state = {
    locked: false,
  };
  offLockedChanged: () => void;

  componentDidMount(): void {
    const { treeNode, pluginContext } = this.props;
    const { id } = treeNode;
    const { pluginEvent } = pluginContext;

    this.setState({
      locked: treeNode.locked,
    });

    this.offLockedChanged = pluginEvent.on('tree-node.lockedChanged', (payload: any) => {
      const { locked, nodeId } = payload;
      if (nodeId === id) {
        this.setState({ locked });
      }
    });
  }

  componentWillUnmount() {
    if (this.offLockedChanged) {
      this.offLockedChanged();
    }
  }

  render() {
    const { treeNode } = this.props;
    const { intl, common } = this.props.pluginContext;
    const Tip = common.editorCabin.Tip;
    return (
      <div
        className="tree-node-lock-btn"
        onClick={(e) => {
          e.stopPropagation();
          treeNode.setLocked(!this.state.locked);
        }}
      >
        {this.state.locked ? <IconUnlock /> : <IconLock /> }
        <Tip>{this.state.locked ? intl('Unlock') : intl('Lock')}</Tip>
      </div>
    );
  }
}

class HideBtn extends Component<{
  treeNode: TreeNode;
  pluginContext: IPublicModelPluginContext;
}, {
  hidden: boolean;
}> {
  state = {
    hidden: false,
  };
  offHiddenChanged: () => void;
  componentDidMount(): void {
    const { treeNode, pluginContext } = this.props;
    const { pluginEvent } = pluginContext;
    const { id } = treeNode;
    this.setState({
      hidden: treeNode.hidden,
    });
    this.offHiddenChanged = pluginEvent.on('tree-node.hiddenChanged', (payload: any) => {
      const { hidden, nodeId } = payload;
      if (nodeId === id) {
        this.setState({ hidden });
      }
    });
  }
  componentWillUnmount(): void {
    if (this.offHiddenChanged) {
      this.offHiddenChanged();
    }
  }
  render() {
    const { treeNode } = this.props;
    const { intl, common } = this.props.pluginContext;
    const Tip = common.editorCabin.Tip;
    return (
      <div
        className="tree-node-hide-btn"
        onClick={(e) => {
          e.stopPropagation();
          emitOutlineEvent(this.props.pluginContext.event, this.state.hidden ? 'show' : 'hide', treeNode);
          treeNode.setHidden(!this.state.hidden);
        }}
      >
        {this.state.hidden ? <IconEye /> : <IconEyeClose />}
        <Tip>{this.state.hidden ? intl('Show') : intl('Hide')}</Tip>
      </div>
    );
  }
}


class ExpandBtn extends Component<{
  treeNode: TreeNode;
  pluginContext: IPublicModelPluginContext;
}, {
  expanded: boolean;
  expandable: boolean;
}> {
  state = {
    expanded: false,
    expandable: false,
  };

  offExpandedChanged: () => void;

  componentDidMount(): void {
    const { treeNode, pluginContext } = this.props;
    const { id } = treeNode;
    const { pluginEvent } = pluginContext;
    this.setState({
      expanded: treeNode.expanded,
      expandable: treeNode.expandable,
    });
    this.offExpandedChanged = pluginEvent.on('tree-node.expandedChanged', (payload: any) => {
      const { expanded, nodeId } = payload;
      if (nodeId === id) {
        this.setState({ expanded });
      }
    });
  }
  componentWillUnmount(): void {
    if (this.offExpandedChanged) {
      this.offExpandedChanged();
    }
  }

  render() {
    const { treeNode } = this.props;
    if (!this.state.expandable) {
      return <i className="tree-node-expand-placeholder" />;
    }
    return (
      <div
        className="tree-node-expand-btn"
        onClick={(e) => {
          if (this.state.expanded) {
            e.stopPropagation();
          }
          emitOutlineEvent(this.props.pluginContext.event, this.state.expanded ? 'collapse' : 'expand', treeNode);
          treeNode.setExpanded(!this.state.expanded);
        }}
      >
        <IconArrowRight size="small" />
      </div>
    );
  }
}