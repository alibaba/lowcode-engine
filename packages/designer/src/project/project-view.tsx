import { Component } from 'react';
import { observer } from '@ali/lowcode-globals';
import { Designer } from '../designer';
import { DocumentView } from '../document';
import './project.less';

@observer
export class ProjectView extends Component<{ designer: Designer }> {
  render() {
    const { designer } = this.props;
    // TODO: support splitview
    return (
      <div className="lc-project">
        {designer.project.documents.map(doc => {
          if (!doc.opened) {
            return null;
          }
          return <DocumentView key={doc.id} document={doc} />;
        })}
      </div>
    );
  }
}
