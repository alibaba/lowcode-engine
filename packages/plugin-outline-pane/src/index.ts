import Pane from './views/pane';
import { IconOutline } from './icons/outline';
import { intl } from './locale';

export default {
  name: 'outline-pane',
  props: {
    icon: IconOutline,
    description: intl('Outline Tree'),
  },
  content: Pane,
};

export { getTreeMaster } from './main';

export { Pane };
