import { Node } from '@ali/lowcode-designer';
import { compatibleLegaoSchema } from '@ali/lowcode-utils';
import { designerCabin } from '@ali/lowcode-engine';

const { getConvertedExtraKey } = designerCabin;

export const upgradePropsReducer = compatibleLegaoSchema;

export function upgradePageLifeCyclesReducer(props: any, node: Node) {
  const lifeCycleNames = ['didMount', 'willUnmount'];
  if (node.isRoot()) {
    lifeCycleNames.forEach(key => {
      if (props[key]) {
        const lifeCycles = node.props.getPropValue(getConvertedExtraKey('lifeCycles')) || {};
        lifeCycles[key] = props[key];
        node.props.setPropValue(getConvertedExtraKey('lifeCycles'), lifeCycles);
      }
    });
  }
  return props;
}
