import { PureComponent } from 'react';
import { globalContext } from '@alilc/lowcode-editor-core';
import { PluginProps } from '@alilc/lowcode-types';
import { OutlinePane } from './pane';

export const Backup = Symbol.for('backup-outline');

export class OutlineBackupPane extends PureComponent<any> {
  render() {
    return (
      <OutlinePane
        editor={this.props.engineEditor}
        engineEditor={this.props.engineEditor}
        config={{
          name: Backup,
        }}
      />
    );
  }
}
