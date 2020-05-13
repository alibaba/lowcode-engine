import { PureComponent } from 'react';
import { PluginProps } from '@ali/lowcode-types';
import { OutlinePane } from './pane';

export const Backup = Symbol.for('backup-outline');

export class OutlineBackupPane extends PureComponent<PluginProps> {
  render() {
    return (
      <OutlinePane
        editor={this.props.editor}
        config={{
          name: Backup,
        }}
      />
    );
  }
}
