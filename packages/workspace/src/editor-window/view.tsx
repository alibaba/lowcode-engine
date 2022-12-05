import { Component } from 'react';
import { EditorView } from '../editor-view/view';
import { observer } from '@alilc/lowcode-editor-core';
import { EditorWindow } from './context';

@observer
export class EditorWindowView extends Component<{
  editorWindow: EditorWindow;
}, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const { resource, editorView, editorViews } = this.props.editorWindow;
    // const editorViews = Array.from(editorViews.values())
    if (!editorView) {
      return null;
    }
    return (
      <div className="workspace-engine-main">
        {/* <EditorView
          resource={resource}
          key={editorView.name}
          active={editorView.active}
          editorView={editorView}
          defaultViewType
        /> */}
        {
          Array.from(editorViews.values()).map((editorView: any) => {
            return (
              <EditorView
                resource={resource}
                key={editorView.name}
                active={editorView.active}
                editorView={editorView}
                defaultViewType
              />
            );
          })
        }
      </div>
    );
  }
}