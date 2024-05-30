import { processValue, someValue } from '@alilc/lowcode-renderer-core';
import {
  watch,
  isJSExpression,
  isJSFunction,
  isJSSlot,
  invariant,
  isLowCodeComponentSchema,
  isJSI18nNode,
} from '@alilc/lowcode-shared';
import { forwardRef, useRef, useEffect, createElement, memo } from 'react';
import { appendExternalStyle } from '../utils/element';
import { reactive } from '../utils/reactive';
import { useRenderContext } from '../context/render';
import { reactiveStateCreator } from './reactiveState';
import { dataSourceCreator } from './dataSource';
import { normalizeComponentNode, type NormalizedComponentNode } from '../utils/node';

import type { PlainObject, Spec } from '@alilc/lowcode-shared';
import type {
  IWidget,
  RenderContext,
  ICodeScope,
  IComponentTreeModel,
} from '@alilc/lowcode-renderer-core';
import type {
  ComponentType,
  ReactInstance,
  CSSProperties,
  ForwardedRef,
  ReactElement,
} from 'react';

export type ReactComponent = ComponentType<any>;
export type ReactWidget = IWidget<ReactComponent, ReactInstance>;

export interface ComponentOptions {
  displayName?: string;

  widgetCreated?(widget: ReactWidget): void;
  componentRefAttached?(widget: ReactWidget, instance: ReactInstance): void;
}

export interface LowCodeComponentProps {
  id?: string;
  /** CSS 类名 */
  className?: string;
  /** style */
  style?: CSSProperties;

  [key: string]: any;
}

const lowCodeComponentsCache = new Map<string, ReactComponent>();

export function getComponentByName(
  name: string,
  { packageManager, boostsManager }: RenderContext,
): ReactComponent {
  const componentsRecord = packageManager.getComponentsNameRecord<ReactComponent>();
  // read cache first
  const result = lowCodeComponentsCache.get(name) || componentsRecord[name];

  invariant(result, `${name} component not found in componentsRecord`);

  if (isLowCodeComponentSchema(result)) {
    const { componentsMap, componentsTree, utils, i18n } = result.schema;

    if (componentsMap.length > 0) {
      packageManager.resolveComponentMaps(componentsMap);
    }

    const boosts = boostsManager.toExpose();

    utils?.forEach((util) => boosts.util.add(util));

    if (i18n) {
      Object.keys(i18n).forEach((locale) => {
        boosts.intl.addTranslations(locale, i18n[locale]);
      });
    }

    const lowCodeComponent = createComponentBySchema(componentsTree[0], {
      displayName: name,
    });

    lowCodeComponentsCache.set(name, lowCodeComponent);

    return lowCodeComponent;
  }

  return result;
}

export function createComponentBySchema(
  schema: string | Spec.ComponentTreeRoot,
  { displayName = '__LowCodeComponent__', componentRefAttached }: ComponentOptions = {},
) {
  const LowCodeComponent = forwardRef(function (
    props: LowCodeComponentProps,
    ref: ForwardedRef<any>,
  ) {
    const renderContext = useRenderContext();
    const { componentTreeModel } = renderContext;

    const modelRef = useRef<IComponentTreeModel<ReactComponent, ReactInstance>>();

    if (!modelRef.current) {
      if (typeof schema === 'string') {
        modelRef.current = componentTreeModel.createById(schema, {
          stateCreator: reactiveStateCreator,
          dataSourceCreator,
        });
      } else {
        modelRef.current = componentTreeModel.create(schema, {
          stateCreator: reactiveStateCreator,
          dataSourceCreator,
        });
      }
    }

    const model = modelRef.current;

    const isConstructed = useRef(false);
    const isMounted = useRef(false);

    if (!isConstructed.current) {
      model.triggerLifeCycle('constructor');
      isConstructed.current = true;
    }

    useEffect(() => {
      const scopeValue = model.codeScope.value;

      // init dataSource
      scopeValue.reloadDataSource();

      let styleEl: HTMLElement | undefined;
      const cssText = model.getCssText();
      if (cssText) {
        appendExternalStyle(cssText).then((el) => {
          styleEl = el;
        });
      }

      // trigger lifeCycles
      // componentDidMount?.();
      model.triggerLifeCycle('componentDidMount');

      // 当 state 改变之后调用
      const unwatch = watch(scopeValue.state, (_, oldVal) => {
        if (isMounted.current) {
          model.triggerLifeCycle('componentDidUpdate', props, oldVal);
        }
      });

      isMounted.current = true;

      return () => {
        // componentWillUnmount?.();
        model.triggerLifeCycle('componentWillUnmount');
        styleEl?.parentNode?.removeChild(styleEl);
        unwatch();
        isMounted.current = false;
      };
    }, []);

    const elements = model.widgets.map((widget) => {
      return createElementByWidget(widget, model.codeScope, renderContext, componentRefAttached);
    });

    return (
      <div id={props.id} className={props.className} style={props.style} ref={ref}>
        {elements}
      </div>
    );
  });

  LowCodeComponent.displayName = displayName;

  return memo(LowCodeComponent);
}

function Text(props: { text: string }) {
  return <>{props.text}</>;
}

Text.displayName = 'Text';

function createElementByWidget(
  widget: IWidget<ReactComponent, ReactInstance>,
  codeScope: ICodeScope,
  renderContext: RenderContext,
  componentRefAttached?: ComponentOptions['componentRefAttached'],
) {
  return widget.build<ReactElement | ReactElement[] | null>((ctx) => {
    const { key, node, model, children } = ctx;
    const boosts = renderContext.boostsManager.toExpose();

    if (typeof node === 'string') {
      return createElement(Text, { key, text: node });
    }

    if (isJSExpression(node)) {
      return createElement(
        reactive(Text, {
          target: { text: node },
          valueGetter(expr) {
            return model.codeRuntime.resolve(expr, codeScope);
          },
        }),
        { key },
      );
    }

    if (isJSI18nNode(node)) {
      return createElement(
        reactive(Text, {
          target: { text: node },
          predicate: isJSI18nNode,
          valueGetter: (node: Spec.JSI18n) => {
            return boosts.intl.t({
              key: node.key,
              params: node.params ? model.codeRuntime.resolve(node.params, codeScope) : undefined,
            });
          },
        }),
        { key },
      );
    }

    function createElementWithProps(
      node: NormalizedComponentNode,
      codeScope: ICodeScope,
      key: string,
    ): ReactElement {
      const { ref, ...componentProps } = node.props;
      const Component = getComponentByName(node.componentName, renderContext);

      const attachRef = (ins: ReactInstance | null) => {
        if (ins) {
          if (ref) model.setComponentRef(ref as string, ins);
          componentRefAttached?.(widget, ins);
        } else {
          if (ref) model.removeComponentRef(ref);
        }
      };

      // 先将 jsslot, jsFunction 对象转换
      const finalProps = processValue(
        componentProps,
        (node) => isJSFunction(node) || isJSSlot(node),
        (node: Spec.JSSlot | Spec.JSFunction) => {
          if (isJSSlot(node)) {
            const slot = node as Spec.JSSlot;

            if (slot.value) {
              const widgets = model.buildWidgets(
                Array.isArray(node.value) ? node.value : [node.value],
              );

              if (slot.params?.length) {
                return (...args: any[]) => {
                  const params = slot.params!.reduce((prev, cur, idx) => {
                    return (prev[cur] = args[idx]);
                  }, {} as PlainObject);

                  return widgets.map((n) =>
                    createElementByWidget(
                      n,
                      codeScope.createChild(params),
                      renderContext,
                      componentRefAttached,
                    ),
                  );
                };
              } else {
                return widgets.map((n) =>
                  createElementByWidget(n, codeScope, renderContext, componentRefAttached),
                );
              }
            }
          } else if (isJSFunction(node)) {
            return model.codeRuntime.resolve(node, codeScope);
          }

          return null;
        },
      );

      const childElements = children?.map((child) =>
        createElementByWidget(child, codeScope, renderContext, componentRefAttached),
      );

      if (someValue(finalProps, isJSExpression)) {
        const PropsWrapper = (props: PlainObject) =>
          createElement(
            Component,
            {
              ...props,
              key,
              ref: attachRef,
            },
            childElements,
          );

        PropsWrapper.displayName = 'PropsWrapper';

        return createElement(
          reactive(PropsWrapper, {
            target: finalProps,
            valueGetter: (node) => model.codeRuntime.resolve(node, codeScope),
          }),
          { key },
        );
      } else {
        return createElement(
          Component,
          {
            ...finalProps,
            key,
            ref: attachRef,
          },
          childElements,
        );
      }
    }

    const normalizedNode = normalizeComponentNode(node);
    const { condition, loop, loopArgs } = normalizedNode;

    // condition为 Falsy 的情况下 不渲染
    if (!condition) return null;
    // loop 为数组且为空的情况下 不渲染
    if (Array.isArray(loop) && loop.length === 0) return null;

    let element: ReactElement | ReactElement[] | null = null;

    if (loop) {
      const genLoopElements = (loopData: any[]) => {
        return loopData.map((item, idx) => {
          const loopArgsItem = loopArgs[0] ?? 'item';
          const loopArgsIndex = loopArgs[1] ?? 'index';

          return createElementWithProps(
            normalizedNode,
            codeScope.createChild({
              [loopArgsItem]: item,
              [loopArgsIndex]: idx,
            }),
            `loop-${key}-${idx}`,
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
          target: { loop },
          valueGetter: (expr) => model.codeRuntime.resolve(expr, codeScope),
        });

        element = createElement(ReactivedLoop, { key });
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
        target: { condition },
        valueGetter: (expr) => model.codeRuntime.resolve(expr, codeScope),
      });

      element = createElement(ReactivedCondition, {
        key,
      });
    }

    if (!element) {
      element = createElementWithProps(normalizedNode, codeScope, key);
    }

    return element;
  });
}
