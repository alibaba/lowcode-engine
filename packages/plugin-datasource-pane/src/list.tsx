import React, { PureComponent, ReactElement, FC } from 'react';
import { Button, Search, VirtualList, Tag, Balloon, Table } from '@alifd/next';
import { DataSourceConfig } from '@ali/lowcode-types';
import _isPlainObject from 'lodash/isPlainObject';
import _isNumber from 'lodash/isNumber';
import _isBoolean from 'lodash/isBoolean';
import _isNil from 'lodash/isNil';
import _tap from 'lodash/tap';
import { DataSourceType } from './types';

const { Column: TableCol } = Table;

export interface DataSourceListProps {
  dataSourceTypes: DataSourceType[];
  dataSource: DataSourceConfig[];
  onEditDataSource?: (dataSourceId: string) => void;
  onDuplicateDataSource?: (dataSourceId: string) => void;
  onRemoveDataSource?: (dataSourceId: string) => void;
}

export interface DataSourceListState {
  filteredType: string;
  keyword: string;
}

type TableRow = {
  label: string;
  value: any;
};

export default class DataSourceList extends PureComponent<DataSourceListProps, DataSourceListState> {
  state = {
    filteredType: '',
    keyword: '',
  };

  handleSearchFilterChange = (filteredType: any) => {
    this.setState({ filteredType });
  };

  handleSearch = (keyword: any) => {
    this.setState({ keyword });
  };

  handleEditDataSource = (id: any) => {
    this.props.onEditDataSource?.(id);
  };

  handleDuplicateDataSource = (id: any) => {
    this.props.onDuplicateDataSource?.(id);
  };

  handleRemoveDataSource = (id: any) => {
    this.props.onRemoveDataSource?.(id);
  };

  deriveListDataSource = () => {
    const { filteredType, keyword } = this.state;
    const { dataSource } = this.props;

    return (
      dataSource
        ?.filter((item) => (filteredType ? item.type === filteredType : true))
        ?.filter((item) => (keyword ? item.id.indexOf(keyword) !== -1 : true))
        ?.map((item) => (
          <li key={item.id}>
            <div className="datasource-item">
              <div className="datasource-item-title">
                <div className="datasource-item-id" title={item.id}>
                  {item.id}
                </div>
                <Balloon
                  trigger={<Button size="small">详情</Button>}
                  align="b"
                  alignEdge
                  triggerType="hover"
                  style={{ width: 300 }}
                >
                  <Table
                    dataSource={_tap(
                      Object.keys(item.options || {}).reduce<TableRow[]>((acc, cur) => {
                        // @todo 这里的 ts 处理得不好
                        if (_isPlainObject(item.options[cur])) {
                          Object.keys(item?.options?.[cur] || {}).forEach((curInOption) => {
                            acc.push({
                              label: `${cur}.${curInOption}`,
                              value: (item?.options?.[cur] as any)?.[curInOption],
                            });
                          });
                        } else if (!_isNil(item.options[cur])) {
                          // @todo 排除 null
                          acc.push({
                            label: cur,
                            value: item.options[cur],
                          });
                        }
                        return acc;
                      }, []),
                      console.log,
                    )}
                  >
                    <TableCol title="" dataIndex="label" />
                    <TableCol
                      title=""
                      dataIndex="value"
                      cell={(val: any) => (
                        <div>
                          <Tag>
                            {_isBoolean(val)
                              ? 'bool'
                              : _isNumber(val)
                                ? 'number'
                                : _isPlainObject(val)
                                  ? 'obj'
                                  : 'string'}
                          </Tag>
                          {val.toString()}
                        </div>
                      )}
                    />
                  </Table>
                </Balloon>
                <Button size="small" onClick={this.handleEditDataSource.bind(this, item.id)}>
                  编辑
                </Button>
                <Button size="small" onClick={this.handleDuplicateDataSource.bind(this, item.id)}>
                  复制
                </Button>
                <Button size="small" onClick={this.handleRemoveDataSource.bind(this, item.id)}>
                  删除
                </Button>
              </div>
              <div className="datasource-item-desc">
                <Tag size="small">{item.type}</Tag>
                <Tag size="small">{item.isInit ? '自动' : '手动'}</Tag>
              </div>
            </div>
          </li>
        )) || []
    );
  };

  render() {
    const { dataSourceTypes } = this.props;

    return (
      <div className="lowcode-plugin-datasource-pane-list">
        <Search
          hasClear
          onSearch={this.handleSearch}
          filterProps={{}}
          defaultFilterValue={dataSourceTypes?.[0]?.type}
          filter={dataSourceTypes.map((type) => ({
            label: type?.type,
            value: type?.type,
          }))}
          onFilterChange={this.handleSearchFilterChange}
        />
        <div className="datasource-list">
          <VirtualList>{this.deriveListDataSource()}</VirtualList>
        </div>
      </div>
    );
  }
}
