import { Component } from 'react';
import { observer } from '@ali/lowcode-editor-core';
import { Designer } from '../designer';
import { DocumentView } from '../document';
import { intl } from '../locale';
import './project.less';

@observer
export class ProjectView extends Component<{ designer: Designer }> {
  render() {
    const { designer } = this.props;
    // TODO: support splitview
    const opens = designer.project.documents.filter((doc) => doc.opened);
    return (
      <div className="lc-project">
        {opens.length > 0 ? (
          opens.map((doc) => <DocumentView key={doc.id} document={doc} />)
        ) : (
          <div className="lc-project-empty">{intl('No opened document')}</div>
        )}
      </div>
    );
  }
}
