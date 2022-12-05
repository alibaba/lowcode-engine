import { skeletonSymbol } from '@alilc/lowcode-shell';
import { observer } from '@alilc/lowcode-editor-core';
import {
  Workbench,
} from '@alilc/lowcode-editor-skeleton';
import { Component } from 'react';
import { Context } from './context';

export * from '../base-context';

@observer
export class EditorView extends Component<any, any> {
  // 因为 document 数据在不同视图下使用的是同一份，所以这里通过 constructor 传入
  constructor(props: any) {
    super(props);
    // this.ctx = new Context(props.editorView);
  }

  // ctx: Context;

  render() {
    const { active } = this.props;
    const editorView = this.props.editorView;
    const skeleton = editorView.skeleton;
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
