import { TransformedComponentMetadata as Metadata } from '@alilc/lowcode-types';

export function legacyIssues(metadata: Metadata): Metadata {
  const { devMode } = metadata;
  return {
    ...metadata,
    devMode: devMode?.replace(/(low|pro)code/, '$1Code') as Metadata['devMode'],
  };
}

export function componentDefaults(metadata: Metadata): Metadata {
  const { configure, componentName } = metadata;
  const { component = {} } = configure;
  if (!component.nestingRule) {
    let m;
    // uri match xx.Group set subcontrolling: true, childWhiteList
    // eslint-disable-next-line no-cond-assign
    if ((m = /^(.+)\.Group$/.exec(componentName))) {
      // component.subControlling = true;
      component.nestingRule = {
        childWhitelist: [`${m[1]}`],
      };
      // eslint-disable-next-line no-cond-assign
    } else if ((m = /^(.+)\.Node$/.exec(componentName))) {
      // uri match xx.Node set selfControlled: false, parentWhiteList
      // component.selfControlled = false;
      component.nestingRule = {
        parentWhitelist: [`${m[1]}`, componentName],
      };
      // eslint-disable-next-line no-cond-assign
    } else if ((m = /^(.+)\.(Item|Node|Option)$/.exec(componentName))) {
      // uri match .Item .Node .Option set parentWhiteList
      component.nestingRule = {
        parentWhitelist: [`${m[1]}`],
      };
    }
  }
  // if (component.isModal == null && /Dialog/.test(componentName)) {
  //   component.isModal = true;
  // }
  return {
    ...metadata,
    configure: {
      ...configure,
      component,
    },
  };
}
