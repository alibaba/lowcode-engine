import { Component } from 'react';
import { observer } from '@ali/recore';
import { getCurrentDocument, screen, progressing } from '../../globals';
import { AutoFit } from '../../document/viewport';
import { AuxiliaryView } from '../auxiliary';
import { PreLoaderView } from '../widgets/pre-loader';
import DocumentContext from '../../document/document-context';
import FocusingArea from '../widgets/focusing-area';
import './canvas.less';

const Canvas = () => (
  <FocusingArea
    className="my-canvas"
    id="canvas"
    onEsc={() => {
      const doc = getCurrentDocument();
      if (doc) {
        doc.selection.clear();
      }
      return false;
    }}
  >
    <Screen />
  </FocusingArea>
);

export default Canvas;

@observer
class Screen extends Component {
  render() {
    const doc = getCurrentDocument();
    // TODO: thinkof multi documents
    return (
      <div ref={elmt => screen.mount(elmt)} className="my-screen">
        {progressing.visible ? <PreLoaderView /> : null}
        <AuxiliaryView />
        {doc ? <DocumentView key={doc.id} doc={doc} /> : null}
      </div>
    );
  }
}

@observer
class DocumentView extends Component<{ doc: DocumentContext }> {
  componentWillUnmount() {
    this.props.doc.sleep();
  }

  render() {
    const { doc } = this.props;
    const viewport = doc.viewport;
    let shellStyle = {};
    let frameStyle = {};
    if (viewport.width !== AutoFit && viewport.height !== AutoFit) {
      const shellWidth = viewport.width * viewport.scale;
      const screenWidth = screen.width;
      const shellLeft = shellWidth < screenWidth ? `calc((100% - ${shellWidth}px) / 2)` : 0;
      shellStyle = {
        width: shellWidth,
        left: shellLeft,
      };
      frameStyle = {
        transform: `scale(${viewport.scale})`,
        height: viewport.height,
        width: viewport.width,
      };
    }

    return (
      <div className="my-doc-shell" style={shellStyle}>
        <iframe className="my-doc-frame" style={frameStyle} ref={frame => doc.mountRuntimeFrame(frame)} />
      </div>
    );
  }
}
