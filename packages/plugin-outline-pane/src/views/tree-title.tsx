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
  expanded: boolean;
  hidden: boolean;
  locked: boolean;
  expandable: boolean;
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

  componentDidMount() {
    const { treeNode } = this.props;
    this.setState({
      editing: false,
      title: treeNode.titleLabel,
    });
    treeNode.onTitleLabelChanged = () => {
      this.setState({
        title: treeNode.titleLabel,
      });
    };
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
        {isCNode && <ExpandBtn expandable={this.props.expandable} expanded={this.props.expanded} treeNode={treeNode} pluginContext={this.props.pluginContext} />}
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
        {shouldShowHideBtn && <HideBtn hidden={this.props.hidden} treeNode={treeNode} pluginContext={this.props.pluginContext} />}
        {shouldShowLockBtn && <LockBtn locked={this.props.locked} treeNode={treeNode} pluginContext={this.props.pluginContext} />}
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
  locked: boolean;
}> {
  render() {
    const { treeNode, locked } = this.props;
    const { intl, common } = this.props.pluginContext;
    const Tip = common.editorCabin.Tip;
    return (
      <div
        className="tree-node-lock-btn"
        onClick={(e) => {
          e.stopPropagation();
          treeNode.setLocked(!locked);
        }}
      >
        {locked ? <IconUnlock /> : <IconLock /> }
        <Tip>{locked ? intl('Unlock') : intl('Lock')}</Tip>
      </div>
    );
  }
}

class HideBtn extends Component<{
  treeNode: TreeNode;
  hidden: boolean;
  pluginContext: IPublicModelPluginContext;
}, {
  hidden: boolean;
}> {
  render() {
    const { treeNode, hidden } = this.props;
    const { intl, common } = this.props.pluginContext;
    const Tip = common.editorCabin.Tip;
    return (
      <div
        className="tree-node-hide-btn"
        onClick={(e) => {
          e.stopPropagation();
          emitOutlineEvent(this.props.pluginContext.event, hidden ? 'show' : 'hide', treeNode);
          treeNode.setHidden(!hidden);
        }}
      >
        {hidden ? <IconEye /> : <IconEyeClose />}
        <Tip>{hidden ? intl('Show') : intl('Hide')}</Tip>
      </div>
    );
  }
}


class ExpandBtn extends Component<{
  treeNode: TreeNode;
  pluginContext: IPublicModelPluginContext;
  expanded: boolean;
  expandable: boolean;
}> {

  render() {
    const { treeNode, expanded, expandable } = this.props;
    if (!expandable) {
      return <i className="tree-node-expand-placeholder" />;
    }
    return (
      <div
        className="tree-node-expand-btn"
        onClick={(e) => {
          if (expanded) {
            e.stopPropagation();
          }
          emitOutlineEvent(this.props.pluginContext.event, expanded ? 'collapse' : 'expand', treeNode);
          treeNode.setExpanded(!expanded);
        }}
      >
        <IconArrowRight size="small" />
      </div>
    );
  }
}