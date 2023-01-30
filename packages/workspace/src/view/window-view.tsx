import { PureComponent } from 'react';
import { ResourceView } from './resource-view';
import { engineConfig, observer } from '@alilc/lowcode-editor-core';
import { EditorWindow } from '../window';
import { BuiltinLoading } from '@alilc/lowcode-designer';

@observer
export class WindowView extends PureComponent<{
  window: EditorWindow;
  active: boolean;
}, any> {
  render() {
    const { active } = this.props;
    const { editorView, resource } = this.props.window;
    if (!editorView) {
      const Loading = engineConfig.get('loadingComponent', BuiltinLoading);
      return (
        <div className={`workspace-engine-main ${active ? 'active' : ''}`}>
          <Loading />
        </div>
      );
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