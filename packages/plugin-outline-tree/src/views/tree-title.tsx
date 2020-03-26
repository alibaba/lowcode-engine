import { Component, KeyboardEvent, FocusEvent, Fragment } from 'react';
import classNames from 'classnames';
import { observer, createIcon, Title, EmbedTip } from '../../../globals';
import { IconArrowRight } from '../icons/arrow-right';
import { IconEyeClose } from '../icons/eye-close';
import { IconLock } from '../icons/lock';
import { IconUnlock } from '../icons/unlock';
import { intl } from '../locale';
import TreeNode from '../tree-node';
import { IconEye } from '../icons/eye';
import { IconCond } from '../icons/cond';
import { IconLoop } from '../icons/loop';
import { IconSlot } from '../icons/slot';

@observer
export default class TreeTitle extends Component<{
  treeNode: TreeNode;
}> {
  state = {
    editing: false,
  };

  private enableEdit = () => {
    this.setState({
      editing: true,
    });
  };

  private cancelEdit() {
    this.setState({
      editing: false,
    });
  }

  private saveEdit = (e: FocusEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>) => {
    const { treeNode } = this.props;
    treeNode.setTitleLabel((e.target as HTMLInputElement).value || '');
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

  componentDidUpdate() {
    // TODO:
    /*
    const { current } = this.inputRef;
    if (current) {
      current.select();
    }
    */
  }

  render() {
    const { treeNode } = this.props;
    const { editing } = this.state;
    const isCNode = !treeNode.isRoot();
    const { node } = treeNode;
    const isNodeParent = node.isNodeParent;
    let style: any;
    if (isCNode) {
      const depth = treeNode.depth;
      const indent = depth * 12;
      style = {
        paddingLeft: indent,
        marginLeft: -indent,
      };
    }

    return (
      <div
        className={classNames('tree-node-title', {
          editing,
        })}
        style={style}
        data-id={treeNode.id}
        onClick={node.conditionGroup ? () => node.setConditionalVisible() : undefined}
      >
        {isCNode && <ExpandBtn treeNode={treeNode} />}
        <div className="tree-node-icon">{createIcon(treeNode.icon)}</div>
        <div className="tree-node-title-label" onDoubleClick={isNodeParent ? this.enableEdit : undefined}>
          {editing ? (
            <input
              className="tree-node-title-input"
              defaultValue={treeNode.titleLabel}
              onBlur={this.saveEdit}
              onKeyUp={this.handleKeyUp}
            />
          ) : (
            <Fragment>
              <Title title={treeNode.title} />
              {node.slotFor && (<a className="tree-node-tag slot">
                {/* todo: click redirect to prop */}
                <IconSlot />
                <EmbedTip>{intl('Slot for {prop}', { prop: node.slotFor.key })}</EmbedTip>
              </a>)}
              {node.hasLoop() && (
                <a className="tree-node-tag loop">
                  {/* todo: click todo something */}
                  <IconLoop />
                  <EmbedTip>{intl('Loop')}</EmbedTip>
                </a>
              )}
              {node.hasCondition() && !node.conditionGroup && (
                <a className="tree-node-tag cond">
                  {/* todo: click todo something */}
                  <IconCond />
                  <EmbedTip>{intl('Conditional')}</EmbedTip>
                </a>
              )}
            </Fragment>
          )}
        </div>
        {isCNode && isNodeParent && <HideBtn treeNode={treeNode} />}
        {isCNode && isNodeParent && <LockBtn treeNode={treeNode} />}
      </div>
    );
  }
}

@observer
class LockBtn extends Component<{
  treeNode: TreeNode;
}> {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { treeNode } = this.props;
    return (
      <div
        className="tree-node-lock-btn"
        onClick={e => {
          e.stopPropagation();
          treeNode.setLocked(!treeNode.locked);
        }}
      >
        {treeNode.locked ? <IconLock /> : <IconUnlock />}
        <EmbedTip>{treeNode.locked ? intl('Unlock') : intl('Lock')}</EmbedTip>
      </div>
    );
  }
}

@observer
class HideBtn extends Component<{
  treeNode: TreeNode;
}> {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { treeNode } = this.props;
    return (
      <div
        className="tree-node-hide-btn"
        onClick={e => {
          e.stopPropagation();
          treeNode.setHidden(!treeNode.hidden);
        }}
      >
        {treeNode.hidden ? <IconEyeClose /> : <IconEye />}
        <EmbedTip>{treeNode.hidden ? intl('Show') : intl('Hide')}</EmbedTip>
      </div>
    );
  }
}

@observer
class ExpandBtn extends Component<{
  treeNode: TreeNode;
}> {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { treeNode } = this.props;
    if (!treeNode.expandable) {
      return <i className="tree-node-expand-placeholder" />;
    }
    return (
      <div
        className="tree-node-expand-btn"
        onClick={e => {
          if (treeNode.expanded) {
            e.stopPropagation();
          }
          treeNode.setExpanded(!treeNode.expanded);
        }}
      >
        <IconArrowRight size="small" />
        <EmbedTip>{treeNode.expanded ? intl('Collapse') : intl('Expand')}</EmbedTip>
      </div>
    );
  }
}
