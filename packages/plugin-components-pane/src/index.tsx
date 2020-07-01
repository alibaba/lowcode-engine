import { Component, ReactNode } from 'react';
import ComponentList, { AdditiveType } from "@ali/ve-component-list";
import { PluginProps } from '@ali/lowcode-types';
import { Designer } from '@ali/lowcode-designer';

import './index.scss';

export interface IState {
  metaData: object[];
}

export default class ComponentListPlugin extends Component<PluginProps, IState> {
  static displayName = 'LowcodeComponentListPlugin';

  snippetsMap = new Map();

  constructor(props: any) {
    super(props);
    this.state = {
      metaData: [],
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
    const metaData: object[] = [];
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

    this.setState({
      metaData,
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

    const click = (e: Event) => {
      if (
        (e.target.tagName === 'ICON'
          && e.target.parentNode
          && e.target.parentNode.classList.contains('engine-additive-helper'))
        || e.target.classList.contains('engine-additive-helper')
      ) {
        return;
      }
      const snippetId = getSnippetId(e.target, AdditiveType.Clickable);
      if (!snippetId || !this.snippetsMap.get(snippetId)) {
        return;
      }
    };

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
    const { metaData } = this.state;
    return (
      <div className="lowcode-component-list">
        <ComponentList
          key="component-pane"
          metaData={metaData}
          registerAdditive={(shell: Element | null) => this.registerAdditive(shell)}
          enableSearch
        />
      </div>
    );
  }
}
