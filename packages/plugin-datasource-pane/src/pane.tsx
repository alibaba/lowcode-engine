/**
 * 面板，先通过 Dialog 呈现
 */
import React, { PureComponent } from 'react';
import { DataSource, DataSourceConfig } from '@ali/lowcode-types';
import { Tab, Button, MenuButton, Message, Dialog } from '@alifd/next';
import _cloneDeep from 'lodash/cloneDeep';
import _uniqueId from 'lodash/uniqueId';
import _startsWith from 'lodash/startsWith';
import _isArray from 'lodash/isArray';
import _get from 'lodash/get';
import List from './list';
// import { DataSourceImportButton, DataSourceImportPluginCode } from './import';
import { DataSourceForm } from './datasource-form';
import { DataSourcePaneImportPlugin, DataSourceType } from './types';

const { Item: TabItem } = Tab;
const { Item: MenuButtonItem } = MenuButton;

const TAB_ITEM_LIST = 'list';
const TAB_ITEM_IMPORT = 'import';
const TAB_ITEM_CREATE = 'create';
const TAB_ITEM_EDIT = 'edit';

export interface DataSourcePaneProps {
  dataSourceTypes?: DataSourceType[];
  importPlugins?: DataSourcePaneImportPlugin[];
  defaultSchema?: DataSource;
  onSchemaChange?: (schema: DataSource) => void;
}

export interface TabItemProps {
  key: string;
  title: string;
  closeable: boolean;
  data: any;
}

export interface TabItem {
  tabItemProps: TabItemProps;
}

export interface DataSourcePaneState {
  dataSourceList: DataSourceConfig[];
  tabItems: TabItem[];
  activeTabKey: string;
}

export class DataSourcePane extends PureComponent<DataSourcePaneProps, DataSourcePaneState> {
  state = {
    dataSourceList: [...(this.props.defaultSchema?.list || [])],
    tabItems: [
      {
        tabItemProps: {
          key: TAB_ITEM_LIST,
          title: '数据源列表',
          closeable: false,
        },
      },
    ],
    activeTabKey: TAB_ITEM_LIST,
  };

  constructor(props) {
    super(props);
    // this.handleDataSourceListChange = this.handleDataSourceListChange.bind(this);
    // this.handleImportDataSourceList = this.handleImportDataSourceList.bind(this);
    // this.handleCreateDataSource = this.handleCreateDataSource.bind(this);
    // this.handleUpdateDataSource = this.handleUpdateDataSource.bind(this);
    // this.handleRemoveDataSource = this.handleRemoveDataSource.bind(this);
    // this.handleDuplicateDataSource = this.handleDuplicateDataSource.bind(this);
    // this.handleEditDataSource = this.handleEditDataSource.bind(this);
    // this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleDataSourceListChange = (dataSourceList?: DataSourceConfig[]) => {
    if (dataSourceList) {
      this.setState({ dataSourceList });
    }
    this.props.onSchemaChange?.({
      list: this.state.dataSourceList,
    });
  };

  handleImportDataSourceList = (toImport: DataSourceConfig[]) => {
    const importDataSourceList = () => {
      this.closeTab(TAB_ITEM_IMPORT);
      this.setState(
        ({ dataSourceList }) => ({
          dataSourceList: dataSourceList.concat(toImport),
        }),
        () => {
          this.handleDataSourceListChange();
        },
      );
    };
    if (!_isArray(toImport) || toImport.length === 0) {
      Message.error('没有找到可导入的数据源');
      return;
    }
    const repeatedDataSourceList = toImport.filter(
      item => !!this.state.dataSourceList.find(
        dataSource => dataSource.id === item.id
      )
    );
    if (repeatedDataSourceList.length > 0) {
      Dialog.confirm({
        content: `数据源（${repeatedDataSourceList.map(item => item.id).join('，')}）已存在，如果导入会替换原数据源，是否继续？`,
        onOk: () => {
          importDataSourceList();
        }
      });
      return;
    }
    importDataSourceList();
  };

  handleCreateDataSource = (toCreate: DataSourceConfig) => {
    const create = () => {
      this.closeTab(TAB_ITEM_CREATE);
      this.setState(
        ({ dataSourceList }) => ({
          dataSourceList: dataSourceList.concat([
            {
              ...toCreate,
            },
          ]),
        }),
        () => {
          this.handleDataSourceListChange();
        },
      );
    };
    if (this.state.dataSourceList.find(
      dataSource => dataSource.id === toCreate.id
    )) {
      Dialog.confirm({
        content: `数据源（${toCreate.id}）已存在，如果导入会替换原数据源，是否继续？`,
        onOk: () => {
          create();
        }
      });
      return;
    }
    create();
  };

  handleUpdateDataSource = (toUpdate: DataSourceConfig) => {
    this.closeTab(TAB_ITEM_EDIT);
    this.setState(
      ({ dataSourceList }) => {
        const nextDataSourceList = [...dataSourceList];
        const dataSourceUpdate = nextDataSourceList.find((dataSource) => dataSource.id === toUpdate.id);
        if (dataSourceUpdate) {
          Object.assign(dataSourceUpdate, toUpdate);
        }
        return {
          dataSourceList: nextDataSourceList,
        };
      },
      () => {
        this.handleDataSourceListChange();
      },
    );
  };

  handleRemoveDataSource = (dataSourceId: string) => {
    const remove = () => {
      this.setState(
        ({ dataSourceList }) => ({
          dataSourceList: dataSourceList.filter((item) => item.id !== dataSourceId),
        }),
        () => {
          this.handleDataSourceListChange();
        },
      );
    };
    Dialog.confirm({
      content: `确定要删除吗？`,
      onOk: () => {
        remove();
      }
    });
  };

  handleDuplicateDataSource = (dataSourceId: string) => {
    const target = this.state.dataSourceList.find((item) => item.id === dataSourceId);
    const cloned = _cloneDeep(target);

    this.openCreateDataSourceTab({
      ...cloned,
      id: _uniqueId(`${cloned.id}_`),
    });
  };

  handleEditDataSource = (dataSourceId: string) => {
    const target = this.state.dataSourceList.find((item) => item.id === dataSourceId);
    const cloned = _cloneDeep(target);

    this.openEditDataSourceTab({
      ...cloned,
    });
  };

  // @todo 没有识别出类型
  handleTabChange = (activeTabKey: any) => {
    this.setState({ activeTabKey });
  };

  openCreateDataSourceTab = (dataSourceTypeName: string) => {
    const { tabItems } = this.state;
    const { dataSourceTypes } = this.props;

    if (!tabItems.find((item) => item.tabItemProps.key === TAB_ITEM_CREATE)) {
      this.setState(({ tabItems }) => ({
        tabItems: tabItems.concat({
          tabItemProps: {
            key: TAB_ITEM_CREATE,
            title: `添加数据源`,
            closeable: true,
            data: {
              dataSourceType: dataSourceTypes?.find(
                type => type.type === dataSourceTypeName
              ),
            },
          },
        }),
      }));
      this.setState({ activeTabKey: TAB_ITEM_CREATE });
    } else {
      Message.notice('当前已有一个新建数据源的 TAB 被大家');
    }
  };

  openEditDataSourceTab = (dataSource: DataSourceConfig) => {
    const { tabItems } = this.state;
    const { dataSourceTypes } = this.props;

    if (!tabItems.find((item) => item.tabItemProps.key === TAB_ITEM_EDIT)) {
      this.setState(({ tabItems }) => ({
        tabItems: tabItems.concat({
          tabItemProps: {
            key: TAB_ITEM_EDIT,
            title: '修改数据源',
            closeable: true,
            data: {
              dataSource,
              dataSourceType: dataSourceTypes?.find(
                type => type.type === dataSource.type
              ),
            },
          },
        }),
      }));
    }
    this.setState({ activeTabKey: TAB_ITEM_EDIT });
  };

  openImportDataSourceTab = (selectedImportPluginName) => {
    const { tabItems } = this.state;
    const { importPlugins } = this.props;

    if (!tabItems.find((item) => item.tabItemProps.key === `${TAB_ITEM_IMPORT}_${selectedImportPluginName}`)) {
      this.setState(({ tabItems }) => ({
        tabItems: tabItems.concat({
          tabItemProps: {
            key: TAB_ITEM_IMPORT,
            title: `导入数据源-${selectedImportPluginName}`,
            closeable: true,
            content: _get(
              importPlugins?.find((plugin) => selectedImportPluginName === plugin.name),
              'component',
            ),
          },
        }),
      }));
      this.setState({ activeTabKey: TAB_ITEM_IMPORT });
    } else {
      Message.notice('当前已有一个导入数据源的 TAB');
    }
  };

  closeTab = (tabKey: any) => {
    this.setState(
      ({ tabItems }) => ({
        tabItems: tabItems.filter((item) => item.tabItemProps.key !== tabKey),
      }),
      () => {
        this.setState(({ tabItems }) => ({
          activeTabKey: _get(tabItems, '[0].tabItemProps.key')
        }));
      },
    );
  };

  renderTabExtraContent = () => {
    const { importPlugins, dataSourceTypes } = this.props;

    // @todo onSelect 不行？
    return [
      _isArray(dataSourceTypes) && dataSourceTypes.length > 1 ? (
        <MenuButton label="新建" onItemClick={this.openCreateDataSourceTab}>
          {dataSourceTypes.map((type) => (
            <MenuButtonItem key={type.type}>{type.type}</MenuButtonItem>
          ))}
        </MenuButton>
      ) : _isArray(dataSourceTypes) && dataSourceTypes.length === 1 ? (
        <Button onClick={this.openCreateDataSourceTab.bind(this, dataSourceTypes[0].type)}>新建</Button>
      ) : null,
      _isArray(importPlugins) && importPlugins.length > 1 ? (
        <MenuButton label="导入" onItemClick={this.openImportDataSourceTab}>
          {importPlugins.map((plugin) => (
            <MenuButtonItem key={plugin.name}>{plugin.name}</MenuButtonItem>
          ))}
        </MenuButton>
      ) : _isArray(importPlugins) && importPlugins.length === 1 ? (
        <Button onClick={this.openImportDataSourceTab.bind(this, importPlugins[0].name)}>导入</Button>
      ) : null,
    ];
  };

  // 更通用的处理
  renderTabItemContentByKey = (tabItemKey: any, data: any) => {
    const { dataSourceList, tabItems } = this.state;
    const { dataSourceTypes } = this.props;

    if (tabItemKey === TAB_ITEM_LIST) {
      return (
        <List
          dataSourceTypes={dataSourceTypes}
          dataSource={dataSourceList}
          onEditDataSource={this.handleEditDataSource}
          onDuplicateDataSource={this.handleDuplicateDataSource}
          onRemoveDataSource={this.handleRemoveDataSource}
        />
      );
    } else if (tabItemKey === TAB_ITEM_EDIT) {
      const dataSourceType = dataSourceTypes.find((type) => type.type === data?.dataSource.type);
      return (
        <DataSourceForm
          dataSourceType={dataSourceType}
          dataSource={data?.dataSource}
          onComplete={this.handleUpdateDataSource}
          onCancel={this.closeTab.bind(this, TAB_ITEM_EDIT)}
        />
      );
    } else if (tabItemKey === TAB_ITEM_CREATE) {
      const tabItemData = tabItems.find((tabItem) => tabItem.tabItemProps.key === tabItemKey);
      return (
        <DataSourceForm
          dataSourceType={data?.dataSourceType}
          onComplete={this.handleCreateDataSource}
          onCancel={this.closeTab.bind(this, tabItemKey)}
        />
      );
    } else if (tabItemKey === TAB_ITEM_IMPORT) {
      const tabItemData = tabItems.find((tabItem) => tabItem.tabItemProps.key === tabItemKey);
      if (tabItemData) {
        const Content = tabItemData.tabItemProps.content;
        return <Content dataSourceTypes={dataSourceTypes} onCancel={this.closeTab.bind(this, tabItemKey)} onImport={this.handleImportDataSourceList} />;
      }
    }
    return null;
  };

  render() {
    const { dataSourceList, activeTabKey, tabItems } = this.state;
    const { importPlugins, dataSourceTypes } = this.props;

    return (
      <div className="lowcode-plugin-datasource-pane">
        <Tab
          activeKey={activeTabKey}
          extra={this.renderTabExtraContent()}
          onChange={this.handleTabChange}
          onClose={this.closeTab}
        >
          {tabItems.map((item) => (
            <TabItem {...item.tabItemProps}>
              {this.renderTabItemContentByKey(item.tabItemProps.key, item.tabItemProps.data)}
            </TabItem>
          ))}
        </Tab>
      </div>
    );
  }
}
