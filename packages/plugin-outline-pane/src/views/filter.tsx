import React, { PureComponent } from 'react';
import './style.less';
import { IconFilter } from '../icons/filter';
import { Search, Checkbox, Balloon, Divider } from '@alifd/next';
import TreeNode from '../controllers/tree-node';
import { Tree } from '../controllers/tree';
import { matchTreeNode, FILTER_OPTIONS } from './filter-tree';

export default class Filter extends PureComponent<{
  tree: Tree;
}, {
  keywords: string;
  filterOps: string[];
}> {
  state = {
    keywords: '',
    filterOps: [],
  };

  handleSearchChange = (val: string) => {
    this.setState({
      keywords: val.trim(),
    }, this.filterTree);
  };

  handleOptionChange = (val: string[]) => {
    this.setState({
      filterOps: val,
    }, this.filterTree);
  };

  handleCheckAll = () => {
    const { filterOps } = this.state;
    const final = filterOps.length === FILTER_OPTIONS.length
      ? [] : FILTER_OPTIONS.map((op) => op.value);

    this.handleOptionChange(final);
  };

  filterTree() {
    const { tree } = this.props;
    const { keywords, filterOps } = this.state;

    matchTreeNode(tree.root as TreeNode, keywords, filterOps);
  }

  render() {
    const { keywords, filterOps } = this.state;
    const indeterminate = filterOps.length > 0 && filterOps.length < FILTER_OPTIONS.length;
    const checkAll = filterOps.length === FILTER_OPTIONS.length;

    return (
      <div className="lc-outline-filter">
        <Search
          hasClear
          shape="simple"
          placeholder={this.props.tree.pluginContext.intl('Filter Node')}
          className="lc-outline-filter-search-input"
          value={keywords}
          onChange={this.handleSearchChange}
        />
        <Balloon
          v2
          align="br"
          closable={false}
          triggerType="hover"
          trigger={(
            <div className="lc-outline-filter-icon">
              <IconFilter />
            </div>
          )}
        >
          <Checkbox
            checked={checkAll}
            indeterminate={indeterminate}
            onChange={this.handleCheckAll}
          >
            {this.props.tree.pluginContext.intlNode('Check All')}
          </Checkbox>
          <Divider />
          <Checkbox.Group
            value={filterOps}
            direction="ver"
            onChange={this.handleOptionChange}
          >
            {FILTER_OPTIONS.map((op) => (
              <Checkbox
                id={op.value}
                value={op.value}
                key={op.value}
              >
                {this.props.tree.pluginContext.intlNode(op.label)}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Balloon>
      </div>
    );
  }
}
