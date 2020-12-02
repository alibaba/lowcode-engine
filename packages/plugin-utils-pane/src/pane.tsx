/**
 * 面板，先通过 Dialog 呈现
 */
import { UtilItem, UtilsMap } from '@ali/lowcode-types';
import { Button, Dialog, MenuButton, Message, Tab } from '@alifd/next';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import React, { PureComponent } from 'react';

import { UtilList } from './list';
import { UtilsForm } from './utils-form';

const { Item: TabItem } = Tab;
const { Item: MenuButtonItem } = MenuButton;

enum PaneTabKey {
  List = 'list',
  Create = 'create',
  Edit = 'edit',
}

export type UtilTypeInfo = {
  type: UtilItem['type'];
  label: string;
};

export interface UtilsPaneProps {
  initialUtils?: UtilsMap | null;
  schema?: UtilsMap | null;
  utilTypes: UtilTypeInfo[];
  onSchemaChange?: (schema: UtilsMap) => void;
}

export interface TabItem {
  key: PaneTabKey;
  title: string;
  closeable: boolean;
  data?: Partial<UtilItem>;
}

interface State {
  utilItems: UtilsMap;
  tabItems: TabItem[];
  activeTabKey: PaneTabKey;
}

export class UtilsPane extends PureComponent<UtilsPaneProps, State> {
  state: State = {
    utilItems: this.props.schema || this.props.initialUtils || [],
    tabItems: [
      {
        key: PaneTabKey.List,
        title: '工具类扩展列表',
        closeable: false,
      },
    ],
    activeTabKey: PaneTabKey.List,
  };

  private notifyItemsChanged = () => {
    this.setState({}, () => {
      if (this.props.onSchemaChange) {
        this.props.onSchemaChange(this.state.utilItems);
      }
    });
  };

  private handleCreateItem = (newItem: UtilItem) => {
    const doSaveNewItem = () => {
      this.closeTab(PaneTabKey.Create);

      this.setState(({ utilItems }) => ({
        utilItems: [{ ...newItem }, ...utilItems.filter((x) => x.name !== newItem.name)],
      }));

      this.notifyItemsChanged();
    };

    if (this.state.utilItems.some((util) => util.name === newItem.name)) {
      Dialog.confirm({
        content: `工具类扩展 "${newItem.name}" 已存在，如果导入会替换已存在的扩展，是否继续？`,
        onOk: () => {
          doSaveNewItem();
        },
      });
      return;
    }

    doSaveNewItem();
  };

  private handleUpdateItem = (changedItem: UtilItem) => {
    this.closeTab(PaneTabKey.Edit);
    this.setState(({ utilItems }) => ({
      utilItems: utilItems.map((x) => [x.name === changedItem.name ? changedItem : x][0]),
    }));
    this.notifyItemsChanged();
  };

  private handleRemoveItem = (toBeRemovedUtilName: string) => {
    const doRemove = () => {
      this.setState(
        ({ utilItems }) => ({
          utilItems: utilItems.filter((item) => item.name !== toBeRemovedUtilName),
        }),
        () => {
          this.notifyItemsChanged();
        },
      );
    };

    Dialog.confirm({
      content: '确定要删除吗？',
      onOk: () => {
        doRemove();
      },
    });
  };

  private handleDuplicateItem = (utilName: string) => {
    const targetUtil = this.state.utilItems.find((item) => item.name === utilName);
    if (!targetUtil) {
      return;
    }

    this.openCreateItemTab({
      ...cloneDeep(targetUtil),
      name: `${targetUtil.name}Copy`,
    });
  };

  private handleEditItem = (utilName: string) => {
    const targetUtil = this.state.utilItems.find((item) => item.name === utilName);
    if (!targetUtil) {
      return;
    }

    this.openEditItemTab(cloneDeep(targetUtil));
  };

  private handleTabChange = (activeTabKey: string | number) => {
    if (isValidTabKey(activeTabKey)) {
      this.setState({ activeTabKey });
    }
  };

  private openCreateItemTab = (initialItem: Partial<UtilItem>) => {
    const { tabItems } = this.state;

    if (!tabItems.find((item) => item.key === PaneTabKey.Create)) {
      this.setState(({ tabItems: latestTabItems }) => ({
        tabItems: latestTabItems.concat({
          key: PaneTabKey.Create,
          title: '添加工具类扩展',
          closeable: true,
          data: {
            ...initialItem,
          },
        }),
      }));
      this.setState({ activeTabKey: PaneTabKey.Create });
    } else {
      Message.notice('当前已经有一个添加工具类扩展的标签页了');
    }
  };

  private handleCreateItemBtnClick = (utilType: string) => {
    this.openCreateItemTab({
      type: utilType as UtilItem['type'],
    });
  };

  private handleCreateItemMenuBtnClick = (utilType: string) => {
    this.openCreateItemTab({
      type: utilType as UtilItem['type'],
    });
  };

  private openEditItemTab = (utilItem: UtilItem) => {
    const { tabItems } = this.state;

    if (!tabItems.find((item) => item.key === PaneTabKey.Edit)) {
      this.setState(({ tabItems: latestTabItems }) => ({
        tabItems: latestTabItems.concat({
          key: PaneTabKey.Edit,
          title: '修改工具类扩展',
          closeable: true,
          data: {
            ...utilItem,
          },
        }),
      }));
    }

    this.setState({ activeTabKey: PaneTabKey.Edit });
  };

  private closeTab = (tabKey: any) => {
    this.setState(
      ({ tabItems }) => ({
        tabItems: tabItems.filter((item) => item.key !== tabKey),
      }),
      () => {
        this.setState(({ tabItems }) => ({
          activeTabKey: get(tabItems, '[0].key'),
        }));
      },
    );
  };

  renderTabExtraContent = () => {
    const { utilTypes } = this.props;

    if (isArray(utilTypes)) {
      if (utilTypes.length > 1) {
        return [
          <MenuButton label="添加" onItemClick={this.handleCreateItemMenuBtnClick}>
            {utilTypes.map((type) => (
              <MenuButtonItem key={type.type}>{type.label}</MenuButtonItem>
            ))}
          </MenuButton>,
        ];
      } else if (utilTypes.length === 1) {
        return [
          <Button onClick={this.handleCreateItemBtnClick.bind(this, utilTypes[0].type)}>
            添加
          </Button>,
        ];
      } else {
        return [];
      }
    }

    return [];
  };

  // 更通用的处理
  private renderTabItemContent = (
    tabItemKey: PaneTabKey,
    data: Partial<UtilItem> | undefined | null,
  ) => {
    const { utilItems } = this.state;
    const { utilTypes = [] } = this.props;

    if (tabItemKey === PaneTabKey.List) {
      if (utilItems.length <= 0) {
        return (
          <Message type="help" title="暂无工具类扩展">
            您可以点击右上角的【添加】按钮来添加一个。
          </Message>
        );
      }

      return (
        <UtilList
          utilTypes={utilTypes}
          utilItems={utilItems}
          onEditUtil={this.handleEditItem}
          onDuplicateUtil={this.handleDuplicateItem}
          onRemoveUtil={this.handleRemoveItem}
        />
      );
    } else if (tabItemKey === PaneTabKey.Edit) {
      return (
        <UtilsForm
          item={data}
          onComplete={this.handleUpdateItem}
          onCancel={this.closeTab.bind(this, PaneTabKey.Edit)}
        />
      );
    } else if (tabItemKey === PaneTabKey.Create) {
      return (
        <UtilsForm
          item={data}
          onComplete={this.handleCreateItem}
          onCancel={this.closeTab.bind(this, tabItemKey)}
        />
      );
    } else {
      console.warn('Unknown tab type: ', tabItemKey);
      return null;
    }
  };

  render() {
    const { activeTabKey, tabItems } = this.state;

    return (
      <div className="lowcode-plugin-utils-pane">
        <Tab
          activeKey={activeTabKey}
          extra={this.renderTabExtraContent()}
          onChange={this.handleTabChange}
          onClose={this.closeTab}
        >
          {tabItems.map((item: TabItem) => (
            <TabItem {...item}>{this.renderTabItemContent(item.key, item.data)}</TabItem>
          ))}
        </Tab>
      </div>
    );
  }
}

function isValidTabKey(tabKey: unknown): tabKey is PaneTabKey {
  return typeof tabKey === 'string' && (Object.values(PaneTabKey) as string[]).includes(tabKey);
}
