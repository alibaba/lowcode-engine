import { Component, ReactNode } from 'react';
import { Tab } from '@alifd/next';
import ComponentList from './components/component-list';
import { AdditiveType } from './components/base';
import { PluginProps } from '@ali/lowcode-types';
import { Designer } from '@ali/lowcode-designer';

import './index.scss';

export interface IState {
  metaData: Record<string, unknown>[];
  bizComponents: Record<string, unknown>[];
}

export default class ComponentListPlugin extends Component<PluginProps, IState> {
  static displayName = 'LowcodeComponentListPlugin';

  snippetsMap = new Map();

  constructor(props: any) {
    super(props);
    this.state = {
      metaData: [],
      bizComponents: [],
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

  transformMetaData(componentList: any): any {
    const metaData: Record<string, unknown>[] = [];
    if (!componentList || !Array.isArray(componentList) || !componentList.length) {
      return metaData;
    }
    componentList.forEach((category: any, categoryId: number) => {
      if (Array.isArray(category?.children)) {
        category.children.forEach((comp: any, compId: number) => {
          metaData.push({
            id: `${categoryId}-${compId}`,
            componentName: comp.componentName,
            title: comp.title,
            category: category.title,
            snippets: comp.snippets.map((snippet: any, snippetId: number) => {
              const item = {
                id: `${categoryId}-${compId}-${snippetId}`,
                description: snippet.title,
                thumbnail: snippet.screenshot,
                schema: snippet.schema,
              };
              this.snippetsMap.set(item.id, item.schema);
              return item;
            }),
          });
        });
      }
    });
    return metaData;
  }

  initComponentList = (): void => {
    const { editor } = this.props;
    const assets = editor.get('assets') || {};
    const metaData = this.transformMetaData(assets.componentList);
    const bizComponents = this.transformMetaData(assets.bizComponentList);

    this.setState({
      metaData,
      bizComponents,
    });
  };

  registerAdditive(shell: Element | null) {
    if (!shell) {
      return;
    }

    function getSnippetId(elem: any, operation = AdditiveType.All) {
      if (!elem || !operation) {
        return null;
      }
      while (shell !== elem) {
        if (elem.classList.contains(operation) || elem.classList.contains(AdditiveType.All)) {
          return elem.dataset.id;
        }
        // tslint:disable-next-line
        elem = elem.parentNode;
      }
      return null;
    }

    const { editor } = this.props;
    const designer = editor.get(Designer);
    if (!designer) {
      return;
    }

    const click = (e: Event) => { console.log(e); };

    shell.addEventListener('click', click);

    designer.dragon.from(shell, (e: Event) => {
      const doc = designer.currentDocument;
      const id = getSnippetId(e.target, AdditiveType.Draggable);

      if (!doc || !id) {
        return false;
      }

      const dragTarget = {
        type: 'nodedata',
        data: this.snippetsMap.get(id),
      };
      return dragTarget;
    });
  }

  render(): ReactNode {
    const { metaData, bizComponents } = this.state;
    return (
      <div className="lowcode-component-list">
        <Tab>
          <Tab.Item title="基础组件" key="base-components">
            <ComponentList
              key="component-pane"
              metaData={metaData}
              registerAdditive={(shell: Element | null) => this.registerAdditive(shell)}
              enableSearch
            />
          </Tab.Item>
          <Tab.Item title="业务组件" key="biz-components">
            <ComponentList
              key="component-pane"
              metaData={bizComponents}
              registerAdditive={(shell: Element | null) => this.registerAdditive(shell)}
              enableSearch
            />
          </Tab.Item>
        </Tab>
      </div>
    );
  }
}
