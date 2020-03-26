import React, { PureComponent } from 'react';
import { Icon, Search, Select } from '@alifd/next';
import MaterialShow from '@ali/iceluna-comp-material-show';
import { PluginProps } from '@ali/lowcode-editor-core/lib/definitions';

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

export default class ComponentListPlugin extends PureComponent<
  PluginProps,
  IState
> {
  static displayName = 'LowcodeComponentListPlugin';

  constructor(props) {
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
    if (editor.assets) {
      this.initComponentList();
    } else {
      editor.once('editor.ready', this.initComponentList);
    }
  }

  transformMaterial = (componentList): any => {
    return componentList.map(category => {
      return {
        name: category.title,
        items: category.children.map(comp => {
          return {
            ...comp,
            name: comp.componentName,
            snippets: comp.snippets.map(snippet => {
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
    const { editor } = this.props;
    const assets = editor.assets || {};
    const list: string[] = [];
    const libs: LibrayInfo[] = [];
    Object.values(assets.packages).forEach((item): void => {
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

    editor.set('dndHelper', {
      handleResourceDragStart: function(ev, tagName, schema) {
        // 物料面板中组件snippet的dragStart回调
        // ev: 原始的domEvent；tagName: 组件的描述文案；schema: snippet的schema
        if (editor.designer) {
          editor.designer.dragon.boost(
            {
              type: 'nodedata',
              data: schema,
            },
            ev.nativeEvent,
          );
        }
      },
    });
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
      .map(cate => {
        return {
          ...cate,
          items: (cate.items || []).filter(item => {
            let libFlag = libs.some(lib => lib == item.library);

            let keyFlag = true;
            if (searchKey) {
              keyFlag =
                `${item.name || ''} ${item.title || ''}`
                  .toLowerCase()
                  .indexOf(searchKey.trim().toLowerCase()) >= 0;
            } else {
              keyFlag = item.is_show === undefined || !!(item.is_show == 1);
            }
            return libFlag && keyFlag;
          }),
        };
      })
      .filter(cate => {
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
          size="small"
          className="search"
          placeholder="请输入关键词"
          onChange={this.searchAction}
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
