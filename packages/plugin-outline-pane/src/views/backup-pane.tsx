import { PureComponent } from 'react';
import { globalContext } from '@alilc/lowcode-editor-core';
import { PluginProps } from '@alilc/lowcode-types';
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
