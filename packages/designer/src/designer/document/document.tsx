import { Component, createContext } from 'react';
import DocumentModel from './document-model';

export const DocumentContext = createContext<DocumentModel>(null as any);

export default class DocumentView extends Component<{ documentModel: DocumentModel }> {
  render() {
    const { documentModel } = this.props;
    return (
      <div className="lc-document">
        <DocumentContext.Provider value={documentModel}>
          {/* 这一层将来做缩放用途 */}
          <div className="lc-simulator-shell">

          </div>
          <DocumentInfoView />
        </DocumentContext.Provider>
      </div>
    )
  }
}

class DocumentInfoView extends Component {
  render() {
    return null;
  }
}
