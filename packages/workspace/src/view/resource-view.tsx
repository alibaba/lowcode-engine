import { PureComponent } from 'react';
import { EditorView } from './editor-view';
import { observer } from '@alilc/lowcode-editor-core';
import TopArea from '../layouts/top-area';
import { Resource } from '../resource';
import { EditorWindow } from '../window';
import './resource-view.less';

@observer
export class ResourceView extends PureComponent<{
  window: EditorWindow;
  resource: Resource;
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