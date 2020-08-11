import { IProjectBuilder } from '../types';

import { createProjectBuilder } from '../generator/ProjectBuilder';

import esModule from '../plugins/common/esmodule';
import containerClass from '../plugins/component/react/containerClass';
import containerInitState from '../plugins/component/react/containerInitState';
import containerInjectUtils from '../plugins/component/react/containerInjectUtils';
import containerLifeCycle from '../plugins/component/react/containerLifeCycle';
import containerMethod from '../plugins/component/react/containerMethod';
import jsx from '../plugins/component/react/jsx';
import reactCommonDeps from '../plugins/component/react/reactCommonDeps';
import css from '../plugins/component/style/css';
import constants from '../plugins/project/constants';
import i18n from '../plugins/project/i18n';
import utils from '../plugins/project/utils';

import raxApp from '../plugins/project/framework/rax';

import { prettier } from '../postprocessor';

export default function createIceJsProjectBuilder(): IProjectBuilder {
  return createProjectBuilder({
    template: raxApp.template,
    plugins: {
      components: [
        reactCommonDeps(),
        esModule({
          fileType: 'jsx',
        }),
        containerClass(),
        containerInjectUtils(),
        containerInitState(),
        containerLifeCycle(),
        containerMethod(),
        jsx(),
        css(),
      ],
      pages: [
        reactCommonDeps(),
        esModule({
          fileType: 'jsx',
        }),
        containerClass(),
        containerInjectUtils(),
        containerInitState(),
        containerLifeCycle(),
        containerMethod(),
        jsx(),
        css(),
      ],
      appConfig: [raxApp.plugins.appConfig()],
      entry: [raxApp.plugins.entry()],
      constants: [constants()],
      utils: [esModule(), utils()],
      i18n: [i18n()],
      globalStyle: [raxApp.plugins.globalStyle()],
      htmlEntry: [raxApp.plugins.entryDocument()],
      packageJSON: [raxApp.plugins.packageJSON()],
    },
    postProcessors: [prettier()],
  });
}
