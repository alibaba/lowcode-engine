import React, { PureComponent } from 'react';
import { Editor } from '@ali/lowcode-editor-core';
import { DesignerView, Designer } from '@ali/lowcode-designer';
import './index.scss';

export interface PluginProps {
  editor: Editor;
}

interface DesignerPluginState {
  componentMetadatas?: any[] | null;
  library?: any[] | null;
}

export default class DesignerPlugin extends PureComponent<PluginProps, DesignerPluginState> {
  static displayName: 'LowcodePluginDesigner';

  state: DesignerPluginState = {
    componentMetadatas: null,
    library: null,
  };

  private _lifeState = 0;

  constructor(props: any) {
    super(props);
    const { editor } = this.props;
    const assets = editor.get('assets');

    if (assets) {
      this.setupAssets(assets);
    } else {
      editor.once('assets.loaded', this.setupAssets);
    }
    this._lifeState = 1;
  }

  setupAssets = (assets: any) => {
    if (this._lifeState < 0) {
      return;
    }
    const { components, packages } = assets;
    const state = {
      componentMetadatas: components ? Object.values(components) : [],
      library: packages ? Object.values(packages) : [],
    };
    if (this._lifeState === 0) {
      this.state = state;
    } else {
      this.setState(state);
    }
  };

  componentWillUnmount() {
    this._lifeState = -1;
  }

  handleDesignerMount = (designer: Designer): void => {
    const { editor } = this.props;
    editor.set(Designer, designer);
    editor.emit('designer.ready', designer);
    const schema = editor.get('schema');
    if (schema) {
      designer.project.open(schema);
    }
    editor.on('schema.loaded', (schema) => {
      designer.project.open(schema);
    });
  };

  render(): React.ReactNode {
    const { editor } = this.props;
    const { componentMetadatas, library } = this.state;

    if (!library || !componentMetadatas) {
      // TODO: use a Loading
      return null;
    }

    return (
      <DesignerView
        onMount={this.handleDesignerMount}
        className="lowcode-plugin-designer"
        eventPipe={editor}
        designer={editor.get(Designer)}
        componentMetadatas={componentMetadatas}
        simulatorProps={{
          library,
        }}
      />
    );
  }
}
