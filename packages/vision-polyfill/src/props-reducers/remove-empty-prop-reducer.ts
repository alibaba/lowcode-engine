import {
  cloneDeep,
} from '@ali/lowcode-utils';
import { Node } from '@ali/lowcode-designer';

// 清除空的 props value
export function removeEmptyPropsReducer(props: any, node: Node) {
  if (node.isRoot() && props.dataSource && Array.isArray(props.dataSource.online)) {
    const online = cloneDeep(props.dataSource.online);
    online.forEach((item: any) => {
      const newParam: any = {};
      if (Array.isArray(item?.options?.params)) {
        item.options.params.forEach((element: any) => {
          if (element.name) {
            newParam[element.name] = element.value;
          }
        });
        item.options.params = newParam;
      }
    });
    props.dataSource.list = online;
  }
  return props;
}
