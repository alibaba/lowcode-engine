import { observer } from '@ali/recore';
import React, { Component, KeyboardEvent } from 'react';
import classNames from 'classnames';
import ElementNode from '../../../../document/node/element-node';
import { isElementNode } from '../../../../document/node';
import { TreeNodeProps } from './tree-node';
import TreeNodeIconView from './tree-node-icon-view';
import CollapsedIcon from '../icons/caret-right.svg';
import EyeCloseIcon from 'my-icons/eye-close.svg';

interface IState {
  editing: boolean;
}

@observer
export default class TreeNodeTitle extends Component<TreeNodeProps, IState> {

  private inputRef = React.createRef<HTMLInputElement>();

  constructor(props: TreeNodeProps) {
    super(props);
    this.state = {
      editing: false,
    };
  }

  toggleIgnored() {
    const treeNode = this.props.treeNode;
    const node = treeNode.node as ElementNode;
    if (treeNode.ignored) {
      node.getDirective('x-ignore').remove();
    } else {
      node.getDirective('x-ignore').value = true;
    }
  }

  toggleExpanded() {
    const treeNode = this.props.treeNode;
    const { expanded } = treeNode;
    treeNode.expanded = !expanded;
  }

  renderExpandIcon() {
    const node = this.props.treeNode;

    if (!node.expandable) {
      return null;
    }

    return (
      <div
        className="tree-node-collapsed-icon"
        onClick={e => {
          e.stopPropagation();
          this.toggleExpanded();
        }}
      >
        <CollapsedIcon />
      </div>
    );
  }

  setTitle(xtitle: string = '') {
    const { treeNode } = this.props;
    const node = treeNode.node as ElementNode;
    const title = node.getProp('x-title');
    if (xtitle && xtitle !== node.tagName) {
      title.code = `"${xtitle}"`;
    } else {
      title.remove();
    }
  }

  enableEdit = () => {
    this.setState({
      editing: true,
    });
  }

  cancelEdit() {
    this.setState({
      editing: false,
    });
  }

  saveEdit = () => {
    const { current } = this.inputRef;

    if (current) {
      this.setTitle(current.value);
    }

    this.cancelEdit();
  }

  handleKeyUp(e: KeyboardEvent<HTMLInputElement>) {
    if (e.keyCode === 13) {
      this.saveEdit();
    }
    if (e.keyCode === 27) {
      this.cancelEdit();
    }
  }

  componentDidUpdate() {
    const { current } = this.inputRef;
    if (current) {
      current.select();
    }
  }

  render() {
    const { treeNode } = this.props;
    const { editing } = this.state;
    const { title } = treeNode;
    const depth = treeNode.depth;
    const indent = depth * 12;

    const titleClassName = classNames('tree-node-title');
    const titleTextClassName = classNames('tree-node-title-text', {
      'x-if-text': treeNode.hasXIf(),
      'x-for-text': treeNode.hasXFor(),
    });
    const xForValue = treeNode.xForValue;

    return (
      <div
        className={titleClassName}
        ref={ref => treeNode.mount(ref)}
        style={{ paddingLeft: indent, marginLeft: -indent }}
      >
        {this.renderExpandIcon()}
        <div className="tree-node-icon">
          <TreeNodeIconView tagName={treeNode.node.tagName} />
        </div>
        <div className="tree-node-title-inner" onDoubleClick={this.enableEdit}>
          {
            editing ?
              <input
                className="tree-node-title-input"
                defaultValue={title.label}
                onBlur={this.saveEdit}
                onKeyUp={e => {this.handleKeyUp(e)}}
                ref={this.inputRef}
              />
              :
              <div className={titleTextClassName}>
                {title.label}
                {xForValue && (
                  <span className="info">
                    (x <b>{xForValue.length}</b>)
                  </span>
                )}
                {treeNode.hasXIf() && (
                  <span className="info">
                    <b>{treeNode.flowHidden ? '' : '(visible)'}</b>
                  </span>
                )}
              </div>
          }

        </div>
        <div className="tree-node-ignored-icon">
          {isElementNode(treeNode.node) && !editing && (
            <EyeCloseIcon
              onClick={(e: MouseEvent) => {
                e.stopPropagation();
                this.toggleIgnored();
              }}
            />
          )}
        </div>
      </div>
    );
  }
}
