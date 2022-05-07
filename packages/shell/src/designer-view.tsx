import { Component, ComponentType } from 'react';

import {
  Designer,
  DesignerView as InnerDesignerView,
  LocateEvent,
  DragObject,
  DropLocation,
} from '@alilc/lowcode-designer';

import { engineConfig, globalContext } from '@alilc/lowcode-editor-core';

export interface DesignerViewProps {
  className?: string;
  style?: object;
  dragGhostComponent?: ComponentType<any>;
  onDragstart?: (e: LocateEvent) => void;
  onDrag?: (e: LocateEvent) => void;
  onDragend?: (e: { dragObject: DragObject; copy: boolean }, loc?: DropLocation) => void;
}

export default class DesignerView extends Component<DesignerViewProps> {
  state = {
    utilsMetadata: null,
    componentMetadatas: null,
    library: null,
    extraEnvironment: null,
    renderEnv: 'default',
    device: 'default',
    locale: '',
    designMode: 'live',
    deviceClassName: '',
    simulatorUrl: null,
    requestHandlersMap: null,
  };

  private _mounted = true;

  constructor(props: any) {
    super(props);
    this.setupAssets();
  }

  private async setupAssets() {
    const editor = globalContext.get('editor');
    try {
      const assets = await editor.onceGot('assets');
      const renderEnv = engineConfig.get('renderEnv') || editor.get('renderEnv');
      const device = engineConfig.get('device') || editor.get('device');
      const locale = engineConfig.get('locale') || editor.get('locale');
      const designMode = engineConfig.get('designMode') || editor.get('designMode');
      const deviceClassName = engineConfig.get('deviceClassName') || editor.get('deviceClassName');
      const simulatorUrl = engineConfig.get('simulatorUrl') || editor.get('simulatorUrl');
      // @TODO setupAssets 里设置 requestHandlersMap 不太合适
      const requestHandlersMap = engineConfig.get('requestHandlersMap') || editor.get('requestHandlersMap');
      if (!this._mounted) {
        return;
      }
      const { components, packages, extraEnvironment, utils } = assets;
      const state = {
        componentMetadatas: components || [],
        library: packages || [],
        utilsMetadata: utils || [],
        extraEnvironment,
        renderEnv,
        device,
        designMode,
        deviceClassName,
        simulatorUrl,
        requestHandlersMap,
        locale,
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
    const editor = globalContext.get('editor');
    editor.set('designer', designer);
    editor.emit('designer.ready', designer);
    editor.onGot('schema', (schema) => {
      designer.project.open(schema);
    });
  };

  render(): React.ReactNode {
    const editor = globalContext.get('editor');
    const {
      componentMetadatas,
      utilsMetadata,
      library,
      extraEnvironment,
      renderEnv,
      device,
      designMode,
      deviceClassName,
      simulatorUrl,
      requestHandlersMap,
      locale,
    } = this.state;

    if (!library || !componentMetadatas) {
      // TODO: use a Loading
      return null;
    }

    return (
      <InnerDesignerView
        onMount={this.handleDesignerMount}
        className="lowcode-plugin-designer"
        editor={editor}
        designer={editor.get('designer')}
        componentMetadatas={componentMetadatas}
        simulatorProps={{
          library,
          utilsMetadata,
          extraEnvironment,
          renderEnv,
          device,
          locale,
          designMode,
          deviceClassName,
          simulatorUrl,
          requestHandlersMap,
        }}
        {...this.props}
      />
    );
  }
}