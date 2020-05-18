import React, { PureComponent } from 'react';
import { Icon, Search, Select } from '@alifd/next';
import MaterialShow from '@ali/iceluna-comp-material-show';
import { PluginProps } from '@ali/lowcode-types';
import { Designer } from '@ali/lowcode-designer';

import './index.scss';

export interface LibrayInfo {
  label: string;
  value: string;
}

export interface IState {
  loading: boolean;
  libs: LibrayInfo[];
  searchKey: string;
  currentLib: string;
  componentList: object[];
}

export default class ComponentListPlugin extends PureComponent<PluginProps, IState> {
  static displayName = 'LowcodeComponentListPlugin';

  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      libs: [
        {
          label: '全部',
          value: 'all',
        },
      ],
      searchKey: '',
      currentLib: 'all',
      componentList: [],
    };
  }

  componentDidMount(): void {
    const { editor } = this.props;
    if (editor.get('assets')) {
      this.initComponentList();
    } else {
      editor.once('editor.ready', this.initComponentList);
    }
  }

  transformMaterial = (componentList: any): any => {
    return componentList.map((category: any) => {
      return {
        name: category.title,
        items: category.children.map((comp: any) => {
          return {
            ...comp,
            name: comp.componentName,
            snippets: comp.snippets.map((snippet: any) => {
              return {
                name: snippet.title,
                screenshot: snippet.screenshot,
                code: JSON.stringify(snippet.schema),
              };
            }),
          };
        }),
      };
    });
  };

  initComponentList = (): void => {
    debugger;
    const { editor } = this.props;
    const assets = editor.get('assets') || {};
    const list: string[] = [];
    const libs: LibrayInfo[] = [];
    assets.packages.forEach((item: any): void => {
      list.push(item.library);
      libs.push({
        label: item.title,
        value: item.library,
      });
    });

    if (list.length > 1) {
      libs.unshift({
        label: '全部',
        value: list.join(','),
      });
    }

    const componentList = this.transformMaterial(assets.componentList);

    this.setState({
      libs,
      componentList,
      currentLib: libs[0] && libs[0].value,
    });

    (window as any).__ctx = {
      appHelper: editor,
    };
    (editor as any).dndHelper = {
      handleResourceDragStart: function(ev: any, tagName: any, schema: any) {
        debugger
        const designer = editor.get(Designer);
        if (designer) {
          designer.dragon.boost(
            {
              type: 'nodedata',
              data: schema,
            },
            ev.nativeEvent,
          );
        }
      },
    };
  };

  searchAction = (value: string): void => {
    this.setState({
      searchKey: value,
    });
  };

  filterMaterial = (): any => {
    const { searchKey, currentLib, componentList } = this.state;
    const libs = currentLib.split(',');
    return (componentList || [])
      .map((cate: any) => {
        return {
          ...cate,
          items: (cate.items || []).filter((item: any) => {
            let libFlag = libs.some((lib) => lib == item.library);

            let keyFlag = true;
            if (searchKey) {
              keyFlag =
                `${item.name || ''} ${item.title || ''}`.toLowerCase().indexOf(searchKey.trim().toLowerCase()) >= 0;
            } else {
              keyFlag = item.is_show === undefined || !!(item.is_show == 1);
            }
            return libFlag && keyFlag;
          }),
        };
      })
      .filter((cate) => {
        return cate.items && cate.items.length > 0;
      });
  };

  render(): React.ReactNode {
    const { libs, loading, currentLib } = this.state;
    return (
      <div className="lowcode-component-list">
        <div className="title">
          <Icon type="jihe" size="small" />
          <span>组件库</span>
        </div>
        <Search
          shape="simple"
          size="medium"
          className="search"
          placeholder="请输入关键词"
          onChange={this.searchAction as any}
          onSearch={this.searchAction}
          hasClear
        />
        <Select
          size="small"
          className="select"
          dataSource={libs}
          value={currentLib}
          onChange={(value): void => {
            this.setState({
              currentLib: value,
            });
          }}
        />
        <MaterialShow
          className="components-show"
          loading={loading}
          type="component"
          dataSource={this.filterMaterial()}
        />
      </div>
    );
  }
}
