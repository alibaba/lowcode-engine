import React, { PureComponent } from 'react';
import { Editor } from '@ali/lowcode-editor-core';
import { DesignerView, Designer } from '@ali/lowcode-designer';
import { Asset } from '@ali/lowcode-utils';
import './index.scss';

export interface PluginProps {
  editor: Editor;
}

interface DesignerPluginState {
  componentMetadatas?: any[] | null;
  library?: any[] | null;
  extraEnvironment?: any[] | null;
  renderEnv?: string;
  device?: string;
  simulatorUrl: Asset | null;
}

export default class DesignerPlugin extends PureComponent<PluginProps, DesignerPluginState> {
  static displayName: 'LowcodePluginDesigner';

  state: DesignerPluginState = {
    componentMetadatas: null,
    library: null,
    extraEnvironment: null,
    renderEnv: 'default',
    device: 'default',
    simulatorUrl: null,
  };

  private _mounted = true;

  constructor(props: any) {
    super(props);
    this.setupAssets();
  }

  private async setupAssets() {
    const { editor } = this.props;
    try {
      const assets = await editor.onceGot('assets');
      const renderEnv = await editor.get('renderEnv');
      const device = await editor.get('device');
      const simulatorUrl = await editor.get('simulatorUrl');
      if (!this._mounted) {
        return;
      }
      const { components, packages, extraEnvironment } = assets;
      const state = {
        componentMetadatas: components || [],
        library: packages || [],
        extraEnvironment,
        renderEnv,
        device,
        simulatorUrl,
      };
      this.setState(state);
    } catch (e) {
      console.log(e);
    }
  }

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
    const { componentMetadatas, library, extraEnvironment, renderEnv, device, simulatorUrl } = this.state;
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
          renderEnv,
          device,
          simulatorUrl,
        }}
      />
    );
  }
}
