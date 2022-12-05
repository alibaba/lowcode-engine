import { Component } from 'react';
import { EditorView } from '@alilc/lowcode-editor-view';
import { Context } from './context';
import { observer } from '@alilc/lowcode-editor-core';

@observer
export class EditorWindow extends Component<{
  editorWindow: any;
}, any> {
  constructor(props: any) {
    super(props);
    // if (!props.resource) {
    //   throw new Error('resource is required');
    // }
    this.ctx = new Context(props.editorWindow);
  }

  ctx;

  render() {
    const { resource, editorView } = this.props.editorWindow;
    return (
      <EditorView
        resourceCtx={this.ctx}
        resource={resource}
        key={editorView.name}
        editorView={editorView}
        defaultViewType
      />
    );
  }
}