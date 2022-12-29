import { PureComponent } from 'react';
import { EditorView } from '../editor-view/view';
import { engineConfig, observer } from '@alilc/lowcode-editor-core';
import { EditorWindow } from './context';
import { BuiltinLoading } from '@alilc/lowcode-designer';

@observer
export class EditorWindowView extends PureComponent<{
  editorWindow: EditorWindow;
  active: boolean;
}, any> {
  render() {
    const { active } = this.props;
    const { editorView, editorViews } = this.props.editorWindow;
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
        {
          Array.from(editorViews.values()).map((editorView: any) => {
            return (
              <EditorView
                key={editorView.name}
                active={editorView.active}
                editorView={editorView}
              />
            );
          })
        }
      </div>
    );
  }
}