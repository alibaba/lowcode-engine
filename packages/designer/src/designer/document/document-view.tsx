import { Component } from 'react';
import DocumentModel from './document-model';
import { observer } from '@recore/obx-react';
import classNames from 'classnames';

@observer
export default class DocumentView extends Component<{ document: DocumentModel }> {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { document } = this.props;
    const simulatorProps = document.simulatorProps;
    const Simulator = document.designer.simulatorComponent;
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
