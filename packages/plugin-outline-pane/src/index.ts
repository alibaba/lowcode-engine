import { OutlinePane } from './views/pane';
import { OutlineBackupPane } from './views/backup-pane';
import { IconOutline } from './icons/outline';
import { intlNode } from './locale';
import { getTreeMaster } from './tree-master';

export default {
  name: 'outline-pane',
  props: {
    icon: IconOutline,
    description: intlNode('Outline Tree'),
  },
  content: OutlinePane,
};

export { OutlinePane, OutlineBackupPane, getTreeMaster };
