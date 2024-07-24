import {
  type IWidget,
  type ICodeRuntime,
  type NormalizedComponentNode,
  mapValue,
} from '@alilc/lowcode-renderer-core';
import {
  type StringDictionary,
  specTypes,
  type JSExpression,
  type JSFunction,
  type JSSlot,
  type JSI18n,
} from '@alilc/lowcode-shared';
import {
  type ComponentType,
  type ReactInstance,
  useMemo,
  createElement,
  type ReactNode,
} from 'react';
import { useRendererContext } from '../api/context';
import { useReactiveStore } from './hooks/useReactiveStore';
import { getComponentByName, type ComponentOptions } from './createComponent';

export type ReactComponent = ComponentType<any>;
export type ReactWidget = IWidget<ReactComponent, ReactInstance>;

interface WidgetRendererProps {
  widget: ReactWidget;
  codeRuntime: ICodeRuntime;
  options: ComponentOptions;

  [key: string]: any;
}

export function createElementByWidget(
  widget: ReactWidget,
  codeRuntime: ICodeRuntime,
  options: ComponentOptions,
): ReactNode {
  const getElement = (widget: ReactWidget) => {
    const { key, rawNode } = widget;

    if (typeof rawNode === 'string') {
      return rawNode;
    }

    if (specTypes.isJSExpression(rawNode)) {
      return <Text key={key} expr={rawNode} codeRuntime={codeRuntime} />;
    }

    if (specTypes.isJSI18nNode(rawNode)) {
      return <I18nText key={key} i18n={rawNode} codeRuntime={codeRuntime} />;
    }

    const { condition, loop } = widget.rawNode as NormalizedComponentNode;

    // condition为 Falsy 的情况下 不渲染
    if (!condition) return null;
    // loop 为数组且为空的情况下 不渲染
    if (Array.isArray(loop) && loop.length === 0) return null;

    if (specTypes.isJSExpression(loop)) {
      return (
        <LoopWidgetRenderer
          key={key}
          loop={loop}
          widget={widget}
          codeRuntime={codeRuntime}
          options={options}
        />
      );
    }

    return (
      <WidgetComponent key={key} widget={widget} codeRuntime={codeRuntime} options={options} />
    );
  };

  if (options.beforeElementCreate) {
    widget = options.beforeElementCreate(widget);
  }

  const element = getElement(widget);

  if (options.elementCreated) {
    return options.elementCreated(widget, element);
  }

  return element;
}

export function WidgetComponent(props: WidgetRendererProps) {
  const { widget, codeRuntime, options, ...otherProps } = props;
  const componentNode = widget.rawNode as NormalizedComponentNode;
  const { ref, ...componentProps } = componentNode.props;

  const context = useRendererContext();

  const Component = useMemo(
    () => getComponentByName(componentNode.componentName, context, options),
    [widget],
  );

  // 先将 jsslot, jsFunction 对象转换
  const processedProps = mapValue(
    componentProps,
    (node) => specTypes.isJSFunction(node) || specTypes.isJSSlot(node),
    (node: JSSlot | JSFunction) => {
      if (specTypes.isJSSlot(node)) {
        const slot = node as JSSlot;

        if (slot.value) {
          const widgets = widget.model.buildWidgets(
            Array.isArray(node.value) ? node.value : [node.value],
          );

          if (slot.params?.length) {
            return (...args: any[]) => {
              const params = slot.params!.reduce((prev, cur, idx) => {
                return (prev[cur] = args[idx]);
              }, {} as StringDictionary);

              return widgets.map((n) =>
                createElementByWidget(
                  n,
                  codeRuntime.createChild({ initScopeValue: params }),
                  options,
                ),
              );
            };
          } else {
            return widgets.map((n) => createElementByWidget(n, codeRuntime, options));
          }
        }
      } else if (specTypes.isJSFunction(node)) {
        return widget.model.codeRuntime.resolve(node);
      }

      return null;
    },
  );

  if (process.env.NODE_ENV === 'development') {
    // development 模式下 把 widget 的内容作为 prop ，便于排查问题
    processedProps.widget = widget;
  }

  const state = useReactiveStore({
    target: {
      condition: componentNode.condition,
      props: processedProps,
    },
    valueGetter(expr) {
      return codeRuntime.resolve(expr);
    },
  });

  const attachRef = (ins: ReactInstance | null) => {
    if (ins) {
      if (ref) widget.model.setComponentRef(ref as string, ins);
    } else {
      if (ref) widget.model.removeComponentRef(ref);
    }

    options.componentRefAttached?.(widget, ins);
  };

  if (!state.condition) {
    return null;
  }

  const finalProps = {
    ...otherProps,
    ...state.props,
  };

  return createElement(
    Component,
    {
      ...finalProps,
      id: finalProps.id ? finalProps.id : undefined,
      key: widget.key,
      ref: attachRef,
    },
    widget.children?.map((item) => createElementByWidget(item, codeRuntime, options)) ?? [],
  );
}

function Text(props: { expr: JSExpression; codeRuntime: ICodeRuntime }) {
  const text: string = useReactiveStore({
    target: props.expr,
    getter: (obj) => {
      return props.codeRuntime.resolve(obj);
    },
  });

  return text;
}

Text.displayName = 'Text';

function I18nText(props: { i18n: JSI18n; codeRuntime: ICodeRuntime }) {
  const text: string = useReactiveStore({
    target: props.i18n,
    getter: (obj) => {
      return props.codeRuntime.resolve(obj);
    },
  });

  return text;
}

I18nText.displayName = 'I18nText';

function LoopWidgetRenderer({
  loop,
  widget,
  codeRuntime,
  options,
  ...otherProps
}: {
  loop: JSExpression;
  widget: ReactWidget;
  codeRuntime: ICodeRuntime;
  options: ComponentOptions;
  [key: string]: any;
}) {
  const { condition, loopArgs } = widget.rawNode as NormalizedComponentNode;
  const state = useReactiveStore({
    target: {
      loop,
      condition,
    },
    valueGetter(expr) {
      return codeRuntime.resolve(expr);
    },
  });

  if (state.condition && Array.isArray(state.loop) && state.loop.length > 0) {
    return state.loop.map((item: any, idx: number) => {
      const childRuntime = codeRuntime.createChild({
        initScopeValue: {
          [loopArgs[0]]: item,
          [loopArgs[1]]: idx,
        },
      });

      return (
        <WidgetComponent
          {...otherProps}
          key={`loop-${widget.key}-${idx}`}
          widget={widget}
          codeRuntime={childRuntime}
          options={options}
        />
      );
    });
  }

  return null;
}
