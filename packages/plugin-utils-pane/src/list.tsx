import { UtilItem } from '@ali/lowcode-types';
import { Balloon, Button, Search, Table, Tag, VirtualList } from '@alifd/next';
import tap from 'lodash/tap';
import React, { PureComponent } from 'react';

import type { UtilTypeInfo } from './pane';

const { Column: TableCol } = Table;

export interface UtilsListProps {
  utilTypes: UtilTypeInfo[];
  utilItems: UtilItem[] | null | undefined;
  onEditUtil?: (utilName: string) => void;
  onDuplicateUtil?: (utilName: string) => void;
  onRemoveUtil?: (utilName: string) => void;
}

interface State {
  filteredType: string;
  keyword: string;
}

type TableRow = {
  label: string;
  value: any;
};

export class UtilList extends PureComponent<UtilsListProps, State> {
  state = {
    filteredType: '',
    keyword: '',
  };

  private handleSearchFilterChange = (filteredType: any) => {
    this.setState({ filteredType });
  };

  private handleSearch = (keyword: any) => {
    this.setState({ keyword });
  };

  private handleEditUtilItem = (id: any) => {
    if (this.props.onEditUtil) {
      this.props.onEditUtil(id);
    }
  };

  private handleDuplicateUtilItem = (id: any) => {
    if (this.props.onDuplicateUtil) {
      this.props.onDuplicateUtil(id);
    }
  };

  private handleRemoveDataSource = (id: any) => {
    if (this.props.onRemoveUtil) {
      this.props.onRemoveUtil(id);
    }
  };

  private renderVirtualUtilsList = () => {
    const { filteredType, keyword } = this.state;
    const utilsMap = this.props.utilItems || [];
    const { utilTypes } = this.props;

    return (
      utilsMap
        .filter((item) => !filteredType || item.type === filteredType)
        .filter((item) => !keyword || item.name.indexOf(keyword) >= 0)
        .map((item) => (
          <li key={item.name}>
            <div className="utils-item">
              <div className="utils-item-title">
                <div className="utils-item-name-wrap" title={item.name}>
                  <span className="utils-item-name">{item.name}</span>

                  {(item.type === 'npm' || item.type === 'tnpm') && (
                    <span className="utils-item-from">
                      {' '}
                      <span className="utils-item-import-from">源自</span>{' '}
                      <span className="utils-item-package-name">
                        &quot;{item.content?.package}
                        {item.content?.main ? `/${item.content?.main}` : ''}&quot;
                      </span>
                      <span className="utils-item-export-name">
                        {item.content?.exportName && item.content?.exportName !== item.name
                          ? `中的 ${item.content?.exportName}${
                              item.content?.subName ? `.${item.content?.subName}` : ''
                          }`
                          : ''}
                      </span>
                    </span>
                  )}
                </div>
                {!!utilTypes.some((t) => t.type === item.type) &&
                  this.renderItemDetailBalloon(item)}
                {!!utilTypes.some((t) => t.type === item.type) && (
                  <Button size="small" onClick={this.handleEditUtilItem.bind(this, item.name)}>
                    编辑
                  </Button>
                )}
                {!!utilTypes.some((t) => t.type === item.type) && (
                  <Button size="small" onClick={this.handleDuplicateUtilItem.bind(this, item.name)}>
                    复制
                  </Button>
                )}
                <Button size="small" onClick={this.handleRemoveDataSource.bind(this, item.name)}>
                  删除
                </Button>
              </div>
              <div className="utils-item-desc">
                <Tag size="small">{item.type}</Tag>
                {(item.type === 'npm' || item.type === 'tnpm') && item.content?.destructuring && (
                  <Tag size="small">解构</Tag>
                )}
              </div>
            </div>
          </li>
        )) || []
    );
  };

  private renderItemDetailBalloon(item: UtilItem): React.ReactNode {
    return (
      <Balloon
        trigger={<Button size="small">详情</Button>}
        align="b"
        alignEdge
        triggerType="hover"
        style={{ width: 300 }}
      >
        {item.type === 'function' ? (
          <div className="utils-item-detail-func-expr">
            <pre>
              <code>{item.content?.value || ''}</code>
            </pre>
          </div>
        ) : (
          <Table
            dataSource={tap(
              Object.entries({
                type: item.type,
                ...item.content,
              }).map<TableRow>(([key, value]) => ({
                label: key,
                value: `${value}`,
              })),
              console.log,
            )}
          >
            <TableCol title="" dataIndex="label" />
            <TableCol
              title=""
              dataIndex="value"
              cell={(val: any) => <div>{typeof val === 'string' ? `"${val}"` : `${val}`}</div>}
            />
          </Table>
        )}
      </Balloon>
    );
  }

  render() {
    const { utilTypes } = this.props;
    const { filteredType } = this.state;

    return (
      <div className="lowcode-plugin-utils-pane-list">
        <Search
          hasClear
          onSearch={this.handleSearch}
          filterProps={{}}
          defaultFilterValue={filteredType}
          filter={[
            {
              label: '全部',
              value: '',
            },
            ...(utilTypes || []).map((utilType) => ({
              label: utilType.label,
              value: utilType.type,
            })),
          ]}
          onFilterChange={this.handleSearchFilterChange}
        />
        <div className="utils-list">
          <VirtualList>{this.renderVirtualUtilsList()}</VirtualList>
        </div>
      </div>
    );
  }
}
