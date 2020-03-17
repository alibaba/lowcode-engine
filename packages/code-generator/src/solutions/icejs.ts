import { IProjectBuilder } from '@/types';

import { createProjectBuilder } from '@/generator/ProjectBuilder';

import esmodule from '@/plugins/common/esmodule';
import containerClass from '@/plugins/component/react/containerClass';
import containerInitState from '@/plugins/component/react/containerInitState';
import containerInjectUtils from '@/plugins/component/react/containerInjectUtils';
import containerLifeCycle from '@/plugins/component/react/containerLifeCycle';
import containerMethod from '@/plugins/component/react/containerMethod';
import jsx from '@/plugins/component/react/jsx';
import reactCommonDeps from '@/plugins/component/react/reactCommonDeps';
import css from '@/plugins/component/style/css';
import constants from '@/plugins/project/constants';
import iceJsEntry from '@/plugins/project/framework/icejs/plugins/entry';
import iceJsEntryHtml from '@/plugins/project/framework/icejs/plugins/entryHtml';
import iceJsGlobalStyle from '@/plugins/project/framework/icejs/plugins/globalStyle';
import iceJsPackageJSON from '@/plugins/project/framework/icejs/plugins/packageJSON';
import iceJsRouter from '@/plugins/project/framework/icejs/plugins/router';
import template from '@/plugins/project/framework/icejs/template';
import i18n from '@/plugins/project/i18n';
import utils from '@/plugins/project/utils';

export default function createIceJsProjectBuilder(): IProjectBuilder {
  return createProjectBuilder({
    template,
    plugins: {
      components: [
        reactCommonDeps,
        esmodule,
        containerClass,
        containerInjectUtils,
        containerInitState,
        containerLifeCycle,
        containerMethod,
        jsx,
        css,
      ],
      pages: [
        reactCommonDeps,
        esmodule,
        containerClass,
        containerInjectUtils,
        containerInitState,
        containerLifeCycle,
        containerMethod,
        jsx,
        css,
      ],
      router: [esmodule, iceJsRouter],
      entry: [iceJsEntry],
      constants: [constants],
      utils: [esmodule, utils],
      i18n: [i18n],
      globalStyle: [iceJsGlobalStyle],
      htmlEntry: [iceJsEntryHtml],
      packageJSON: [iceJsPackageJSON],
    },
  });
}
