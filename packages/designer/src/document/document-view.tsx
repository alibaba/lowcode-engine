import { Component } from 'react';
import classNames from 'classnames';
import { observer } from '@ali/lowcode-editor-core';
import { DocumentModel } from './document-model';
import { BuiltinSimulatorHostView } from '../builtin-simulator';

@observer
export class DocumentView extends Component<{ document: DocumentModel }> {
  render() {
    const { document } = this.props;
    const { simulatorProps } = document;
    const Simulator = document.designer.simulatorComponent || BuiltinSimulatorHostView;
    return (
      <div
        className={classNames('lc-document', {
          'lc-document-hidden': document.suspensed,
        })}
      >
        {/* 这一层将来做缩放用途 */}
        <div className="lc-simulator-shell">
          <Simulator {...simulatorProps} />
        </div>
        <DocumentInfoView document={document} />
      </div>
    );
  }
}

class DocumentInfoView extends Component<{ document: DocumentModel }> {
  render() {
    return null;
  }
}
