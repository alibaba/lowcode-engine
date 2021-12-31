import { PureComponent } from 'react';
import { globalContext } from '@ali/lowcode-editor-core';
import { PluginProps } from '@ali/lowcode-types';
import { OutlinePane } from './pane';

export const Backup = Symbol.for('backup-outline');

export class OutlineBackupPane extends PureComponent<PluginProps> {
  render() {
    return (
      <OutlinePane
        editor={globalContext.get('editor')}
        config={{
          name: Backup,
        }}
      />
    );
  }
}
