
import ResultFile from '../../../../../../../../model/ResultFile';
import { IResultFile } from '../../../../../../../../types';

export default function getFile(): [string[], IResultFile] {
  const file = new ResultFile(
    'components',
    'ts',
    `
/**
 * 乐高组件
 */ 
import Div from '@ali/vc-div/build/view';
import Text from '@ali/vc-text/build/view';
import Slot from '@ali/vc-slot/build/view';
import Deep from '@ali/vc-deep/build/view';
import Page from '@ali/vc-page/build/view';
import Block from '@ali/vc-block/build/view';

const components = [Div, Text, Slot, Deep, Page, Block];
const componentsMap = {
};

const processComponents = (deps) => {
  deps.forEach((dep) => {
    if (Array.isArray(dep)) {
      processComponents(dep);
    } else {
      componentsMap[dep.displayName] = dep;
    }
  });
};

processComponents(components);

export default componentsMap;

    `,
  );

  return [['src', 'config'], file];
}
