import { observer } from '@alilc/lowcode-editor-core';
import {
  Workbench,
} from '@alilc/lowcode-editor-skeleton';
import { Component } from 'react';

export * from '../base-context';

@observer
export class EditorView extends Component<any, any> {
  render() {
    const { active } = this.props;
    const editorView = this.props.editorView;
    const skeleton = editorView.innerSkeleton;
    if (!editorView.isInit) {
      return null;
    }

    return (
      <>
        <Workbench
          skeleton={skeleton}
          className={active ? 'active engine-editor-view' : 'engine-editor-view'}
          topAreaItemClassName="engine-actionitem"
        />
      </>
    );
  }
}
