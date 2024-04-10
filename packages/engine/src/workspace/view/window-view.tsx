import { PureComponent } from 'react';
import { ResourceView } from './resource-view';
import { engineConfig, observer } from '@alilc/lowcode-editor-core';
import { IEditorWindow } from '../window';
import { BuiltinLoading } from '@alilc/lowcode-designer';
import { DesignerView } from '../inner-plugins/webview';

@observer
export class WindowView extends PureComponent<{
  window: IEditorWindow;
  active: boolean;
}, any> {
  render() {
    const { active } = this.props;
    const { resource, initReady, url } = this.props.window;

    if (!initReady) {
      const Loading = engineConfig.get('loadingComponent', BuiltinLoading);
      return (
        <div className={`workspace-engine-main ${active ? 'active' : ''}`}>
          <Loading />
        </div>
      );
    }

    if (resource.type === 'webview' && url) {
      return <DesignerView url={url} viewName={resource.name} />;
    }

    return (
      <div className={`workspace-engine-main ${active ? 'active' : ''}`}>
        <ResourceView
          resource={resource}
          window={this.props.window}
        />
      </div>
    );
  }
}
