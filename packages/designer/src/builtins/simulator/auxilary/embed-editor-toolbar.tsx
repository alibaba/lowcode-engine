import { Component } from 'react';
import embedEditor from '../../globals/embed-editor';

export default class EmbedEditorToolbar extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return <div className="embed-editor-toolbar" ref={shell => embedEditor.mount(shell)} />;
  }
}
