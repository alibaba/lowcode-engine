import { observer } from '@ali/recore';
import { Component } from 'react';
import { getCurrentDocument } from '../../globals';
import './auxiliary.less';
import { EdgingView } from './gliding';
import { InsertionView } from './insertion';
import { SelectingView } from './selecting';
import EmbedEditorToolbar from './embed-editor-toolbar';

@observer
export class AuxiliaryView extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const doc = getCurrentDocument();
    if (!doc || !doc.ready) {
      return null;
    }
    const { scrollX, scrollY, scale } = doc.viewport;
    return (
      <div className="my-auxiliary" style={{ transform: `translate(${-scrollX * scale}px,${-scrollY * scale}px)` }}>
        <EmbedEditorToolbar />
        <EdgingView />
        <InsertionView />
        <SelectingView />
      </div>
    );
  }
}
