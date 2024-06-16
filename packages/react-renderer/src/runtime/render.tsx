import {
  type IWidget,
  type ICodeScope,
  type NormalizedComponentNode,
  mapValue,
} from '@alilc/lowcode-renderer-core';
import {
  type PlainObject,
  isJSExpression,
  isJSI18nNode,
  isJSFunction,
  isJSSlot,
  type Spec,
} from '@alilc/lowcode-shared';
import { type ComponentType, type ReactInstance, useMemo, createElement } from 'react';
import { useRenderContext } from '../app/context';
import { useReactiveStore } from './hooks/useReactiveStore';
import { useModel } from './context';
import { getComponentByName } from './component';

export type ReactComponent = ComponentType<any>;
export type ReactWidget = IWidget<ReactComponent, ReactInstance>;

interface WidgetRendererProps {
  widget: ReactWidget;
  codeScope: ICodeScope;

  [key: string]: any;
}

export function createElementByWidget(
  widget: IWidget<ReactComponent, ReactInstance>,
  codeScope: ICodeScope,
) {
  const { key, node } = widget;

  if (typeof node === 'string') {
    return node;
  }

  if (isJSExpression(node)) {
    return <Text key={key} expr={node} codeScope={codeScope} />;
  }

  if (isJSI18nNode(node)) {
    return <I18nText key={key} i18n={node} codeScope={codeScope} />;
  }

  const { condition, loop } = widget.node as NormalizedComponentNode;

  // condition为 Falsy 的情况下 不渲染
  if (!condition) return null;
  // loop 为数组且为空的情况下 不渲染
  if (Array.isArray(loop) && loop.length === 0) return null;

  if (isJSExpression(loop)) {
    return <LoopWidgetRenderer key={key} loop={loop} widget={widget} codeScope={codeScope} />;
  }

  return <WidgetComponent key={key} widget={widget} codeScope={codeScope} />;
}

export function WidgetComponent(props: WidgetRendererProps) {
  const { widget, codeScope, ...otherProps } = props;
  const componentNode = widget.node as NormalizedComponentNode;
  const { ref, ...componentProps } = componentNode.props;

  const renderContext = useRenderContext();

  const Component = useMemo(
    () => getComponentByName(componentNode.componentName, renderContext),
    [widget],
  );

  const state = useReactiveStore({
    target: {
      condition: componentNode.condition,
      props: preprocessProps(componentProps, widget, codeScope),
    },
    valueGetter(expr) {
      return widget.model.codeRuntime.resolve(expr, { scope: codeScope });
    },
  });

  const attachRef = (ins: ReactInstance | null) => {
    if (ins) {
      if (ref) widget.model.setComponentRef(ref as string, ins);
    } else {
      if (ref) widget.model.removeComponentRef(ref);
    }
  };

  if (!state.condition) {
    return null;
  }

  return createElement(
    Component,
    {
      ...otherProps,
      ...state.props,
      key: widget.key,
      ref: attachRef,
    },
    widget.children?.map((item) => createElementByWidget(item, codeScope)) ?? [],
  );
}

function preprocessProps(props: PlainObject, widget: ReactWidget, codeScope: ICodeScope) {
  // 先将 jsslot, jsFunction 对象转换
  const finalProps = mapValue(
    props,
    (node) => isJSFunction(node) || isJSSlot(node),
    (node: Spec.JSSlot | Spec.JSFunction) => {
      if (isJSSlot(node)) {
        const slot = node as Spec.JSSlot;

        if (slot.value) {
          const widgets = widget.model.buildWidgets(
            Array.isArray(node.value) ? node.value : [node.value],
          );

          if (slot.params?.length) {
            return (...args: any[]) => {
              const params = slot.params!.reduce((prev, cur, idx) => {
                return (prev[cur] = args[idx]);
              }, {} as PlainObject);

              return widgets.map((n) => createElementByWidget(n, codeScope.createChild(params)));
            };
          } else {
            return widgets.map((n) => createElementByWidget(n, codeScope));
          }
        }
      } else if (isJSFunction(node)) {
        return widget.model.codeRuntime.resolve(node, { scope: codeScope });
      }

      return null;
    },
  );

  if (process.env.NODE_ENV === 'development') {
    // development 模式下 把 widget 的内容作为 prop ，便于排查问题
    finalProps.widget = widget;
  }

  return finalProps;
}

function Text(props: { expr: Spec.JSExpression; codeScope: ICodeScope }) {
  const model = useModel();
  const text: string = useReactiveStore({
    target: props.expr,
    getter: (obj) => {
      return model.codeRuntime.resolve(obj, { scope: props.codeScope });
    },
  });

  return text;
}

Text.displayName = 'Text';

function I18nText(props: { i18n: Spec.JSI18n; codeScope: ICodeScope }) {
  const model = useModel();
  const text: string = useReactiveStore({
    target: props.i18n,
    getter: (obj) => {
      return model.codeRuntime.resolve(obj, { scope: props.codeScope });
    },
  });

  return text;
}

I18nText.displayName = 'I18nText';

function LoopWidgetRenderer({
  loop,
  widget,
  codeScope,

  ...otherProps
}: {
  loop: Spec.JSExpression;
  widget: ReactWidget;
  codeScope: ICodeScope;

  [key: string]: any;
}) {
  const { condition, loopArgs } = widget.node as NormalizedComponentNode;
  const state = useReactiveStore({
    target: {
      loop,
      condition,
    },
    valueGetter(expr) {
      return widget.model.codeRuntime.resolve(expr, { scope: codeScope });
    },
  });

  if (state.condition && Array.isArray(state.loop) && state.loop.length > 0) {
    return state.loop.map((item: any, idx: number) => {
      const childScope = codeScope.createChild({
        [loopArgs[0]]: item,
        [loopArgs[1]]: idx,
      });

      return (
        <WidgetComponent
          {...otherProps}
          key={`loop-${widget.key}-${idx}`}
          widget={widget}
          codeScope={childScope}
        />
      );
    });
  }

  return null;
}
