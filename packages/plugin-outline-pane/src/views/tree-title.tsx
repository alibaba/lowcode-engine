import { KeyboardEvent, FocusEvent, Fragment, PureComponent } from 'react';
import classNames from 'classnames';
import { createIcon } from '@alilc/lowcode-utils';
import { IPublicApiEvent } from '@alilc/lowcode-types';
import TreeNode from '../controllers/tree-node';
import { IconLock, IconUnlock, IconArrowRight, IconEyeClose, IconEye, IconCond, IconLoop, IconRadioActive, IconRadio, IconSetting, IconDelete } from '../icons';

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

export default class TreeTitle extends PureComponent<{
  treeNode: TreeNode;
  isModal?: boolean;
  expanded: boolean;
  hidden: boolean;
  locked: boolean;
  expandable: boolean;
}> {
  state: {
    editing: boolean;
    title: string;
    condition?: boolean;
    visible?: boolean;
  } = {
    editing: false,
    title: '',
  };

  private lastInput?: HTMLInputElement;

  private enableEdit = (e: MouseEvent) => {
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
    emitOutlineEvent(this.props.treeNode.pluginContext.event, 'rename', treeNode, { value });
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
      condition: treeNode.condition,
      visible: !treeNode.hidden,
    });
    treeNode.onTitleLabelChanged(() => {
      this.setState({
        title: treeNode.titleLabel,
      });
    });
    treeNode.onConditionChanged(() => {
      this.setState({
        condition: treeNode.condition,
      });
    });
    treeNode.onHiddenChanged((hidden: boolean) => {
      this.setState({
        visible: !hidden,
      });
    });
  }
  deleteClick = () => {
    const { treeNode } = this.props;
    const { node } = treeNode;
    treeNode.deleteNode(node);
  };
  render() {
    const { treeNode, isModal } = this.props;
    const { pluginContext } = treeNode;
    const { editing } = this.state;
    const isCNode = !treeNode.isRoot();
    const { node } = treeNode;
    const { componentMeta } = node;
    const availableActions = componentMeta ? componentMeta.availableActions.map((availableAction) => availableAction.name) : [];
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
    const couldHide = availableActions.includes('hide');
    const couldLock = availableActions.includes('lock');
    const couldUnlock = availableActions.includes('unlock');
    const shouldShowHideBtn = isCNode && isNodeParent && !isModal && couldHide;
    const shouldShowLockBtn = config.get('enableCanvasLock', false) && isContainer && isCNode && isNodeParent && ((couldLock && !node.isLocked) || (couldUnlock && node.isLocked));
    const shouldEditBtn = isCNode && isNodeParent;
    const shouldDeleteBtn = isCNode && isNodeParent && node?.canPerformAction('remove');
    return (
      <div
        className={classNames('tree-node-title', { editing })}
        style={style}
        data-id={treeNode.nodeId}
        onClick={() => {
          if (isModal) {
            if (this.state.visible) {
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
        {isModal && this.state.visible && (
          <div onClick={() => {
            node.document?.modalNodesManager?.setInvisible(node);
          }}
          >
            <IconRadioActive className="tree-node-modal-radio-active" />
          </div>
        )}
        {isModal && !this.state.visible && (
          <div onClick={() => {
            node.document?.modalNodesManager?.setVisible(node);
          }}
          >
            <IconRadio className="tree-node-modal-radio" />
          </div>
        )}
        {isCNode && <ExpandBtn expandable={this.props.expandable} expanded={this.props.expanded} treeNode={treeNode} />}
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
              {/* @ts-ignore */}
              <Title
                title={this.state.title}
                match={filterWorking && matchSelf}
                keywords={keywords}
              />
              {Extra && <Extra node={treeNode?.node} />}
              {node.slotFor && (
                <a className="tree-node-tag slot">
                  {/* todo: click redirect to prop */}
                  {/* @ts-ignore */}
                  <Tip>{intlNode('Slot for {prop}', { prop: node.slotFor.key })}</Tip>
                </a>
              )}
              {node.hasLoop() && (
                <a className="tree-node-tag loop">
                  {/* todo: click todo something */}
                  <IconLoop />
                  {/* @ts-ignore */}
                  <Tip>{intlNode('Loop')}</Tip>
                </a>
              )}
              {this.state.condition && (
                <a className="tree-node-tag cond">
                  {/* todo: click todo something */}
                  <IconCond />
                  {/* @ts-ignore */}
                  <Tip>{intlNode('Conditional')}</Tip>
                </a>
              )}
            </Fragment>
          )}
        </div>
        {shouldShowHideBtn && <HideBtn hidden={this.props.hidden} treeNode={treeNode} />}
        {shouldShowLockBtn && <LockBtn locked={this.props.locked} treeNode={treeNode} />}
        {shouldEditBtn && <RenameBtn treeNode={treeNode} onClick={this.enableEdit} />}
        {shouldDeleteBtn && <DeleteBtn treeNode={treeNode} onClick={this.deleteClick} />}
      </div>
    );
  }
}

class DeleteBtn extends PureComponent<{
  treeNode: TreeNode;
  onClick: () => void;
}> {
  render() {
    const { intl, common } = this.props.treeNode.pluginContext;
    const { Tip } = common.editorCabin;
    return (
      <div
        className="tree-node-delete-btn"
        onClick={this.props.onClick}
      >
        <IconDelete />
        {/* @ts-ignore */}
        <Tip>{intl('Delete')}</Tip>
      </div>
    );
  }
}

class RenameBtn extends PureComponent<{
  treeNode: TreeNode;
  onClick: (e: any) => void;
}> {
  render() {
    const { intl, common } = this.props.treeNode.pluginContext;
    const Tip = common.editorCabin.Tip;
    return (
      <div
        className="tree-node-rename-btn"
        onClick={this.props.onClick}
      >
        <IconSetting />
        {/* @ts-ignore */}
        <Tip>{intl('Rename')}</Tip>
      </div>
    );
  }
}

class LockBtn extends PureComponent<{
  treeNode: TreeNode;
  locked: boolean;
}> {
  render() {
    const { treeNode, locked } = this.props;
    const { intl, common } = this.props.treeNode.pluginContext;
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
        {/* @ts-ignore */}
        <Tip>{locked ? intl('Unlock') : intl('Lock')}</Tip>
      </div>
    );
  }
}

class HideBtn extends PureComponent<{
  treeNode: TreeNode;
  hidden: boolean;
}, {
  hidden: boolean;
}> {
  render() {
    const { treeNode, hidden } = this.props;
    const { intl, common } = treeNode.pluginContext;
    const Tip = common.editorCabin.Tip;
    return (
      <div
        className="tree-node-hide-btn"
        onClick={(e) => {
          e.stopPropagation();
          emitOutlineEvent(treeNode.pluginContext.event, hidden ? 'show' : 'hide', treeNode);
          treeNode.setHidden(!hidden);
        }}
      >
        {hidden ? <IconEye /> : <IconEyeClose />}
        {/* @ts-ignore */}
        <Tip>{hidden ? intl('Show') : intl('Hide')}</Tip>
      </div>
    );
  }
}

class ExpandBtn extends PureComponent<{
  treeNode: TreeNode;
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
          emitOutlineEvent(treeNode.pluginContext.event, expanded ? 'collapse' : 'expand', treeNode);
          treeNode.setExpanded(!expanded);
        }}
      >
        <IconArrowRight size="small" />
      </div>
    );
  }
}
