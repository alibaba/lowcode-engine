import {
  createComponentFunction,
  isLowCodeComponentSchema,
  createCodeRuntime,
  TextWidget,
  ComponentWidget,
  isJSExpression,
  processValue,
  isJSFunction,
  isJSSlot,
  someValue,
  type CreateComponentBaseOptions,
  type CodeRuntime,
} from '@alilc/lowcode-renderer-core';
import { isPlainObject } from 'lodash-es';
import { forwardRef, useRef, useEffect, createElement, useMemo } from 'react';
import { signal, watch } from './signals';
import { appendExternalStyle } from './utils/element';
import { reactive } from './utils/reactive';

import type {
  PlainObject,
  InstanceStateApi,
  LowCodeComponent as LowCodeComponentSchema,
  IntlApi,
  JSSlot,
  JSFunction,
  I18nNode,
} from '@alilc/lowcode-shared';
import type {
  ComponentType,
  ReactInstance,
  CSSProperties,
  ForwardedRef,
  ReactElement,
} from 'react';

export type ReactComponentLifeCycle =
  | 'constructor'
  | 'render'
  | 'componentDidMount'
  | 'componentDidUpdate'
  | 'componentWillUnmount'
  | 'componentDidCatch';

export interface ComponentOptions<C = ComponentType<any>>
  extends CreateComponentBaseOptions<ReactComponentLifeCycle> {
  componentsRecord: Record<string, C | LowCodeComponentSchema>;
  intl: IntlApi;
  displayName?: string;

  beforeElementCreate?(widget: TextWidget<C> | ComponentWidget<C>): void;
  componentRefAttached?(widget: ComponentWidget<C>, instance: ReactInstance): void;
}

export interface LowCodeComponentProps {
  id?: string;
  /** CSS 类名 */
  className?: string;
  /** style */
  style?: CSSProperties;

  [key: string]: any;
}

export const createComponent = createComponentFunction<
  ComponentType<any>,
  ReactInstance,
  ReactComponentLifeCycle,
  ComponentOptions
>(reactiveStateCreator, (container, options) => {
  const {
    componentsRecord,
    intl,
    displayName = '__LowCodeComponent__',
    beforeElementCreate,
    componentRefAttached,

    ...extraOptions
  } = options;
  const lowCodeComponentCache = new Map<string, ComponentType<any>>();

  function getComponentByName(componentName: string) {
    const Component = componentsRecord[componentName];
    if (!Component) {
      return undefined;
    }

    if (isLowCodeComponentSchema(Component)) {
      if (lowCodeComponentCache.has(componentName)) {
        return lowCodeComponentCache.get(componentName);
      }

      const LowCodeComponent = createComponent({
        ...extraOptions,
        intl,
        displayName: Component.componentName,
        componentsRecord,
        componentsTree: Component.schema,
      });

      lowCodeComponentCache.set(componentName, LowCodeComponent);

      return LowCodeComponent;
    }

    return Component;
  }

  function createReactElement(
    widget: TextWidget<ComponentType<any>> | ComponentWidget<ComponentType<any>>,
    codeRuntime: CodeRuntime,
  ) {
    beforeElementCreate?.(widget);

    return widget.build((elements) => {
      if (elements.length > 0) {
        const RenderObject = elements[elements.length - 1];
        const Wrappers = elements.slice(0, elements.length - 1);

        const buildRenderElement = () => {
          if (widget instanceof TextWidget) {
            if (widget.type === 'string') {
              return createElement(RenderObject, { key: widget.key, text: widget.raw });
            } else {
              return createElement(
                reactive(RenderObject, {
                  target:
                    widget.type === 'expression' ? { text: widget.raw } : (widget.raw as I18nNode),
                  valueGetter(expr) {
                    return codeRuntime.parseExprOrFn(expr);
                  },
                }),
                { key: widget.key },
              );
            }
          } else if (widget instanceof ComponentWidget) {
            const { condition, loop, loopArgs } = widget;

            // condition为 Falsy 的情况下 不渲染
            if (!condition) return null;
            // loop 为数组且为空的情况下 不渲染
            if (Array.isArray(loop) && loop.length === 0) return null;

            function createElementWithProps(
              Component: ComponentType<any>,
              widget: ComponentWidget<ComponentType<any>>,
              codeRuntime: CodeRuntime,
              key?: string,
            ): ReactElement {
              const { ref, ...componentProps } = widget.props;
              const componentKey = key ?? widget.key;

              const attachRef = (ins: ReactInstance) => {
                if (ins) {
                  if (ref) container.setInstance(ref as string, ins);
                  componentRefAttached?.(widget, ins);
                } else {
                  if (ref) container.removeInstance(ref);
                }
              };

              // 先将 jsslot, jsFunction 对象转换
              const finalProps = processValue(
                componentProps,
                (node) => isJSFunction(node) || isJSSlot(node),
                (node: JSSlot | JSFunction) => {
                  if (isJSSlot(node)) {
                    const slot = node as JSSlot;

                    if (slot.value) {
                      const widgets = (Array.isArray(node.value) ? node.value : [node.value]).map(
                        (v) => new ComponentWidget<ComponentType<any>>(v),
                      );

                      if (slot.params?.length) {
                        return (...args: any[]) => {
                          const params = slot.params!.reduce((prev, cur, idx) => {
                            return (prev[cur] = args[idx]);
                          }, {} as PlainObject);
                          const subCodeScope = codeRuntime.getScope().createSubScope(params);
                          const subCodeRuntime = createCodeRuntime(subCodeScope);

                          return widgets.map((n) => createReactElement(n, subCodeRuntime));
                        };
                      } else {
                        return widgets.map((n) => createReactElement(n, codeRuntime));
                      }
                    }
                  } else if (isJSFunction(node)) {
                    return codeRuntime.parseExprOrFn(node);
                  }

                  return null;
                },
              );

              const childElements = widget.children.map((child) =>
                createReactElement(child, codeRuntime),
              );

              if (someValue(finalProps, isJSExpression)) {
                const PropsWrapper = (props: PlainObject) =>
                  createElement(
                    Component,
                    {
                      ...props,
                      key: componentKey,
                      ref: attachRef,
                    },
                    childElements,
                  );

                PropsWrapper.displayName = 'PropsWrapper';

                return createElement(
                  reactive(PropsWrapper, {
                    target: finalProps,
                    valueGetter: (node) => codeRuntime.parseExprOrFn(node),
                  }),
                  { key: componentKey },
                );
              } else {
                return createElement(
                  Component,
                  {
                    ...finalProps,
                    key: componentKey,
                    ref: attachRef,
                  },
                  childElements,
                );
              }
            }

            let element: ReactElement | ReactElement[] = createElementWithProps(
              RenderObject,
              widget,
              codeRuntime,
            );

            if (loop) {
              const genLoopElements = (loopData: any[]) => {
                return loopData.map((item, idx) => {
                  const loopArgsItem = loopArgs[0] ?? 'item';
                  const loopArgsIndex = loopArgs[1] ?? 'index';
                  const subCodeScope = codeRuntime.getScope().createSubScope({
                    [loopArgsItem]: item,
                    [loopArgsIndex]: idx,
                  });
                  const subCodeRuntime = createCodeRuntime(subCodeScope);

                  return createElementWithProps(
                    RenderObject,
                    widget,
                    subCodeRuntime,
                    `loop-${widget.key}-${idx}`,
                  );
                });
              };

              if (isJSExpression(loop)) {
                function Loop(props: { loop: boolean }) {
                  if (!Array.isArray(props.loop)) {
                    return null;
                  }
                  return <>{genLoopElements(props.loop)}</>;
                }
                Loop.displayName = 'Loop';

                const ReactivedLoop = reactive(Loop, {
                  target: {
                    loop,
                  },
                  valueGetter: (expr) => codeRuntime.parseExprOrFn(expr),
                });

                element = createElement(ReactivedLoop, {
                  key: widget.key,
                });
              } else {
                element = genLoopElements(loop as any[]);
              }
            }

            if (isJSExpression(condition)) {
              function Condition(props: any) {
                if (props.condition) {
                  return element;
                }
                return null;
              }
              Condition.displayName = 'Condition';

              const ReactivedCondition = reactive(Condition, {
                target: {
                  condition,
                },
                valueGetter: (expr) => codeRuntime.parseExprOrFn(expr),
              });

              element = createElement(ReactivedCondition, {
                key: widget.key,
              });
            }

            return element;
          }

          return null;
        };

        const element = buildRenderElement();

        return Wrappers.reduce((prevElement, CurWrapper) => {
          return createElement(CurWrapper, { key: widget.key }, prevElement);
        }, element);
      }
    });
  }

  const LowCodeComponent = forwardRef(function (
    props: LowCodeComponentProps,
    ref: ForwardedRef<any>,
  ) {
    const { id, className, style } = props;
    const isConstructed = useRef(false);
    const isMounted = useRef(false);

    if (!isConstructed.current) {
      container.triggerLifeCycle('constructor');
      isConstructed.current = true;
    }

    useEffect(() => {
      const scopeValue = container.codeRuntime.getScope().value;

      // init dataSource
      scopeValue.reloadDataSource();

      let styleEl: HTMLElement | undefined;
      const cssText = container.getCssText();
      if (cssText) {
        appendExternalStyle(cssText).then((el) => {
          styleEl = el;
        });
      }

      // trigger lifeCycles
      // componentDidMount?.();
      container.triggerLifeCycle('componentDidMount');

      // 当 state 改变之后调用
      const unwatch = watch(scopeValue.state, (_, oldVal) => {
        if (isMounted.current) {
          container.triggerLifeCycle('componentDidUpdate', props, oldVal);
        }
      });

      isMounted.current = true;

      return () => {
        // componentWillUnmount?.();
        container.triggerLifeCycle('componentWillUnmount');
        styleEl?.parentNode?.removeChild(styleEl);
        unwatch();
        isMounted.current = false;
      };
    }, []);

    const widgets = useMemo(() => {
      return container.createWidgets<ComponentType<any>>().map((widget) =>
        widget.mapRenderObject((widget) => {
          if (widget instanceof TextWidget) {
            if (widget.type === 'i18n') {
              function IntlText(props: { key: string; params: Record<string, string> }) {
                return <>{intl.i18n(props.key, props.params)}</>;
              }
              IntlText.displayName = 'IntlText';
              return IntlText;
            }

            function Text(props: { text: string }) {
              return <>{props.text}</>;
            }
            Text.displayName = 'Text';
            return Text;
          } else if (widget instanceof ComponentWidget) {
            return getComponentByName(widget.raw.componentName);
          }
        }),
      );
    }, []);

    return (
      <div id={id} className={className} style={style} ref={ref}>
        {widgets.map((widget) => createReactElement(widget, container.codeRuntime))}
      </div>
    );
  });

  LowCodeComponent.displayName = displayName;

  return LowCodeComponent;
});

function reactiveStateCreator(initState: PlainObject): InstanceStateApi {
  const proxyState = signal(initState);

  return {
    get state() {
      return proxyState.value;
    },
    setState(newState) {
      if (!isPlainObject(newState)) {
        throw Error('newState mush be a object');
      }

      proxyState.value = {
        ...proxyState.value,
        ...newState,
      };
    },
  };
}
