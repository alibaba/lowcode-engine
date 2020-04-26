import { PureComponent } from 'react';
import { PluginProps } from '@ali/lowcode-types';
import OutlinePane from './pane';

export class OutlineBackupPane extends PureComponent<PluginProps> {
  state = {
    outlineInited: false,
  };
  private dispose = this.props.main.onceOutlineVisible(() => {
    this.setState({
      outlineInited: true,
    });
  });
  componentWillUnmount() {
    this.dispose();
  }
  render() {
    if (!this.state.outlineInited) {
      return null;
    }
    return (
      <OutlinePane
        editor={this.props.main.editor}
        config={{
          name: '__IN_SETTINGS__',
        }}
      />
    );
  }
}
