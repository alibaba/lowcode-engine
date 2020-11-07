import { globalContext, Editor } from '@ali/lowcode-editor-core';
import { Node } from '@ali/lowcode-designer';

export function liveLifecycleReducer(props: any, node: Node) {
  const editor = globalContext.get(Editor);
  // live 模式下解析 lifeCycles
  if (node.isRoot() && props && props.lifeCycles) {
    if (editor.get('designMode') === 'live') {
      const lifeCycleMap = {
        didMount: 'componentDidMount',
        willUnmount: 'componentWillUnMount',
      };
      const lifeCycles = props.lifeCycles;
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