import logger from '@ali/vu-logger';
import { Node, PropsReducerContext, designerCabin, engineConfig } from '@ali/lowcode-engine';
import { hasOwnProperty } from '@ali/lowcode-utils';
const { TransformStage } = designerCabin;

export function filterReducer(props: any, node: Node, ctx: PropsReducerContext): any {
  // 老的 vision 逻辑是 render 阶段不走 filter 逻辑
  if (ctx.stage === TransformStage.Render && !engineConfig.get('visionSettings.enableFilterReducerInRenderStage', false)) {
    return props;
  }
  const filters = node.componentMeta.getMetadata().experimental?.filters;
  if (filters && filters.length) {
    const newProps = { ...props };
    filters.forEach((item) => {
      // FIXME! item.name could be 'xxx.xxx'
      if (!hasOwnProperty(newProps, item.name)) {
        return;
      }
      try {
        if (item.filter(node.settingEntry.getProp(item.name), props[item.name]) === false) {
          delete newProps[item.name];
        }
      } catch (e) {
        console.warn(e);
        logger.trace(e);
      }
    });
    return newProps;
  }
  return props;
}
