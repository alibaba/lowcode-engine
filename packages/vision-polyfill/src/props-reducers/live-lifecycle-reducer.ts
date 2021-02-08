import { editor } from '@ali/lowcode-engine';
import { Node } from '@ali/lowcode-designer';

export function liveLifecycleReducer(props: any, node: Node) {
  // 如果不是 vc 体系，不做这个兼容处理
  if (!node.componentMeta.prototype) {
    return props;
  }
  // live 模式下解析 lifeCycles
  if (node.isRoot() && props && props.lifeCycles) {
    if (editor.get('designMode') === 'live') {
      const lifeCycleMap = {
        didMount: 'componentDidMount',
        willUnmount: 'componentWillUnMount',
      };
      const { lifeCycles } = props;
      Object.keys(lifeCycleMap).forEach(key => {
        if (lifeCycles[key]) {
          lifeCycles[lifeCycleMap[key]] = lifeCycles[key];
        }
      });
      return props;
    }
    return {
      ...props,
      lifeCycles: {},
    };
  }
  return props;
}
