import Pane from './views/pane';
import { IconOutline } from './icons/outline';
import { intlNode } from './locale';

export default {
  name: 'outline-pane',
  props: {
    icon: IconOutline,
    description: intlNode('Outline Tree'),
  },
  content: Pane,
};

export { getTreeMaster } from './main';

export { Pane };
