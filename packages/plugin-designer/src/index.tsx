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
  extraEnvironment?: any[] | null;
}

export default class DesignerPlugin extends PureComponent<PluginProps, DesignerPluginState> {
  static displayName: 'LowcodePluginDesigner';

  state: DesignerPluginState = {
    componentMetadatas: null,
    library: null,
    extraEnvironment: null,
  };

  private _mounted = true;

  constructor(props: any) {
    super(props);
    this.setupAssets();
  }

  private async setupAssets() {
    const { editor } = this.props;
    const assets = await editor.onceGot('assets');
    if (!this._mounted) {
      return;
    }
    const { components, packages, extraEnvironment } = assets;
    const state = {
      componentMetadatas: components || [],
      library: packages || [],
      extraEnvironment,
    };
    this.setState(state);
  };

  componentWillUnmount() {
    this._mounted = false;
  }

  private handleDesignerMount = (designer: Designer): void => {
    const { editor } = this.props;
    editor.set(Designer, designer);
    editor.emit('designer.ready', designer);
    editor.onGot('schema', (schema) => {
      designer.project.open(schema);
    });
  };

  render(): React.ReactNode {
    const { editor } = this.props;
    const { componentMetadatas, library, extraEnvironment } = this.state;

    if (!library || !componentMetadatas) {
      // TODO: use a Loading
      return null;
    }

    return (
      <DesignerView
        onMount={this.handleDesignerMount}
        className="lowcode-plugin-designer"
        editor={editor}
        designer={editor.get(Designer)}
        componentMetadatas={componentMetadatas}
        simulatorProps={{
          library,
          extraEnvironment,
        }}
      />
    );
  }
}
