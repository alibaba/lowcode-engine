import { PureComponent } from 'react';
import { EditorView } from './editor-view';
import { observer } from '@alilc/lowcode-editor-core';
import { IResource } from '../resource';
import { IEditorWindow } from '../window';
import './resource-view.less';
import { TopArea } from '@alilc/lowcode-editor-skeleton';

@observer
export class ResourceView extends PureComponent<{
  window: IEditorWindow;
  resource: IResource;
}, any> {
  render() {
    const { skeleton } = this.props.resource;
    const { editorViews } = this.props.window;
    return (
      <div className="workspace-resource-view">
        <TopArea area={skeleton.topArea} itemClassName="engine-actionitem" />
        <div className="workspace-editor-body">
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
      </div>
    );
  }
}