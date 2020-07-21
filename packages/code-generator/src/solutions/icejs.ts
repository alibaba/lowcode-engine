import { IProjectBuilder } from '../types';

import { createProjectBuilder } from '../generator/ProjectBuilder';

import esmodule from '../plugins/common/esmodule';
import containerClass from '../plugins/component/react/containerClass';
import containerInitState from '../plugins/component/react/containerInitState';
// import containerInjectUtils from '../plugins/component/react/containerInjectUtils';
import containerLifeCycle from '../plugins/component/react/containerLifeCycle';
import containerMethod from '../plugins/component/react/containerMethod';
import jsx from '../plugins/component/react/jsx';
import reactCommonDeps from '../plugins/component/react/reactCommonDeps';
import css from '../plugins/component/style/css';
import constants from '../plugins/project/constants';
import i18n from '../plugins/project/i18n';
import utils from '../plugins/project/utils';

import icejs from '../plugins/project/framework/icejs';

import { prettier } from '../postprocessor';

export default function createIceJsProjectBuilder(): IProjectBuilder {
  return createProjectBuilder({
    template: icejs.template,
    plugins: {
      components: [
        reactCommonDeps(),
        esmodule({
          fileType: 'jsx',
        }),
        containerClass(),
        // containerInjectUtils(),
        containerInitState(),
        containerLifeCycle(),
        containerMethod(),
        jsx({
          nodeTypeMapping: {
            Div: 'div',
            Component: 'div',
            Page: 'div',
            Block: 'div',
          },
        }),
        css(),
      ],
      pages: [
        reactCommonDeps(),
        esmodule({
          fileType: 'jsx',
        }),
        containerClass(),
        // containerInjectUtils(),
        containerInitState(),
        containerLifeCycle(),
        containerMethod(),
        jsx({
          nodeTypeMapping: {
            Div: 'div',
            Component: 'div',
            Page: 'div',
            Block: 'div',
          },
        }),
        css(),
      ],
      router: [esmodule(), icejs.plugins.router()],
      entry: [icejs.plugins.entry()],
      constants: [constants()],
      utils: [esmodule(), utils()],
      i18n: [i18n()],
      globalStyle: [icejs.plugins.globalStyle()],
      htmlEntry: [icejs.plugins.entryHtml()],
      packageJSON: [icejs.plugins.packageJSON()],
    },
    postProcessors: [prettier()],
  });
}
