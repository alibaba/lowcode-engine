import { IProjectBuilder } from '../types';

import { createProjectBuilder } from '../generator/ProjectBuilder';

// import esmodule from '../plugins/common/esmodule';
import containerInitState from '../plugins/component/react/containerInitState';
import containerLifeCycle from '../plugins/component/react/containerLifeCycle';
import containerMethod from '../plugins/component/react/containerMethod';
import pageFrame from '../plugins/component/recore/pageFrame';
import pageStyle from '../plugins/component/recore/pageStyle';
import pageVmHeader from '../plugins/component/recore/pageVmHeader';
import pageVmBody from '../plugins/component/recore/pageVmBody';
import pageDataSource from '../plugins/component/recore/pageDataSource';
import template from '../plugins/project/framework/recore/template';

import { prettier } from '../postprocessor';

export default function createRecoreProjectBuilder(): IProjectBuilder {
  return createProjectBuilder({
    template,
    plugins: {
      pages: [
        pageFrame(),
        pageStyle(),
        containerInitState({
          fileType: 'ts',
          implementType: 'insMember',
        }),
        containerLifeCycle({
          fileType: 'ts',
          exportNameMapping: {
            constructor: 'init',
            componentDidMount: 'didMount',
            willUnmount: 'willUnMount',
            componentWillUnmount: 'willUnMount',
          },
          normalizeNameMapping: {
            init: 'constructor',
          },
        }),
        containerMethod({
          fileType: 'ts',
        }),
        pageDataSource(),
        pageVmHeader(),
        pageVmBody(),
      ],
    },
    postProcessors: [prettier()],
  });
}
