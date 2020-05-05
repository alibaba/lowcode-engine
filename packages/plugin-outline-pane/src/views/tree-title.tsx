import { Component, KeyboardEvent, FocusEvent, Fragment } from 'react';
import classNames from 'classnames';
import { observer, Title, Tip } from '@ali/lowcode-editor-core';
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
import { createIcon } from '@ali/lowcode-utils';

@observer
export default class TreeTitle extends Component<{
  treeNode: TreeNode;
}> {
  state: {
    editing: boolean;
  } = {
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
    this.lastInput = undefined;
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

  render() {
    const { treeNode } = this.props;
    const { editing } = this.state;
    const isCNode = !treeNode.isRoot();
    const { node } = treeNode;
    const isNodeParent = node.isParental();
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
              ref={this.setCaret}
              onKeyUp={this.handleKeyUp}
            />
          ) : (
            <Fragment>
              <Title title={treeNode.title} />
              {node.slotFor && (
                <a className="tree-node-tag slot">
                  {/* todo: click redirect to prop */}
                  <IconSlot />
                  <Tip>{intl('Slot for {prop}', { prop: node.slotFor.key })}</Tip>
                </a>
              )}
              {node.hasLoop() && (
                <a className="tree-node-tag loop">
                  {/* todo: click todo something */}
                  <IconLoop />
                  <Tip>{intl('Loop')}</Tip>
                </a>
              )}
              {node.hasCondition() && !node.conditionGroup && (
                <a className="tree-node-tag cond">
                  {/* todo: click todo something */}
                  <IconCond />
                  <Tip>{intl('Conditional')}</Tip>
                </a>
              )}
            </Fragment>
          )}
        </div>
        {isCNode && isNodeParent && <HideBtn treeNode={treeNode} />}
        {/*isCNode && isNodeParent && <LockBtn treeNode={treeNode} />*/}
      </div>
    );
  }
}

@observer
class LockBtn extends Component<{ treeNode: TreeNode }> {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { treeNode } = this.props;
    return (
      <div
        className="tree-node-lock-btn"
        onClick={(e) => {
          e.stopPropagation();
          treeNode.setLocked(!treeNode.locked);
        }}
      >
        {treeNode.locked ? <IconLock /> : <IconUnlock />}
        <Tip>{treeNode.locked ? intl('Unlock') : intl('Lock')}</Tip>
      </div>
    );
  }
}

@observer
class HideBtn extends Component<{ treeNode: TreeNode }> {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { treeNode } = this.props;
    return (
      <div
        className="tree-node-hide-btn"
        onClick={(e) => {
          e.stopPropagation();
          treeNode.setHidden(!treeNode.hidden);
        }}
      >
        {treeNode.hidden ? <IconEyeClose /> : <IconEye />}
        <Tip>{treeNode.hidden ? intl('Show') : intl('Hide')}</Tip>
      </div>
    );
  }
}

@observer
class ExpandBtn extends Component<{ treeNode: TreeNode }> {
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
        onClick={(e) => {
          if (treeNode.expanded) {
            e.stopPropagation();
          }
          treeNode.setExpanded(!treeNode.expanded);
        }}
      >
        <IconArrowRight size="small" />
      </div>
    );
  }
}

/*
interface Point {
  clientX: number;
  clientY: number;
}

function setCaret(point: Point) {
  debugger;
  const range = getRangeFromPoint(point);
  if (range) {
    selectRange(range);
    setTimeout(() => selectRange(range), 1);
  }
}

function getRangeFromPoint(point: Point): Range | undefined {
  const x = point.clientX;
  const y = point.clientY;
  let range;
  let pos: CaretPosition | null = null;
  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(x, y);
  } else if ((pos = document.caretPositionFromPoint(x, y))) {
    range = document.createRange();
    range.setStart(pos.offsetNode, pos.offset);
    range.collapse(true);

  }
  return range;
}

function selectRange(range: Range) {
  const selection = document.getSelection();
  if (selection) {
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

function setCaretAfter(elem) {
  const range = document.createRange();
  const node = elem.lastChild;
  if (!node) return;
  range.setStartAfter(node);
  range.setEndAfter(node);
  selectRange(range);
}
*/
