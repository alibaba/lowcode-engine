import {
  type StateContext,
  type ComponentOptionsBase,
  createComponentFunction,
  type ComponentTreeNode,
  type ComponentNode,
  someValue,
  type ContainerInstance,
  processValue,
  createNode,
  type CodeRuntime,
  createCodeRuntime,
} from '@alilc/runtime-core';
import {
  type AnyObject,
  type Package,
  type JSSlot,
  type JSFunction,
  isPlainObject,
  isJsExpression,
  isJsSlot,
  isLowCodeComponentPackage,
  isJsFunction,
  type JSExpression,
} from '@alilc/runtime-shared';
import {
  useEffect,
  type ComponentType,
  type ReactNode,
  type ElementType,
  forwardRef,
  ForwardedRef,
  useMemo,
  createElement,
  type CSSProperties,
  useRef,
} from 'react';
import { createSignal, watch } from '../signals';
import { appendExternalStyle } from '../helper/element';
import { reactive } from '../helper/reactive';

function reactiveStateCreator(initState: AnyObject): StateContext {
  const proxyState = createSignal(initState);

  return {
    get state() {
      return proxyState.value;
    },
    setState(newState) {
      if (!isPlainObject(newState)) {
        throw Error('newState mush be a object');
      }
      for (const key of Object.keys(newState)) {
        proxyState.value[key] = newState[key];
      }
    },
  };
}

/**
 * 作为组件树节点在转换为 reactNode 的过程中的中间介质对象
 * 提供对外拓展、修改的能力
 */
export interface ConvertedTreeNode {
  type: ComponentTreeNode['type'];
  /** 节点对应的值 */
  raw: ComponentTreeNode;
  /** 转换时所在的上下文 */
  context: {
    codeRuntime: CodeRuntime;
    [key: string]: any;
  };
  /** 用于渲染的组件，只存在于树节点为组件节点的情况 */
  rawComponent?: ComponentType<any> | undefined;

  /** 获取节点对应的 reactNode，被用于渲染 */
  getReactNode(): ReactNode;
  /** 设置节点对应的 reactNode */
  setReactNode(element: ReactNode): void;
}

export interface CreateComponentOptions<C = ComponentType<any>>
  extends ComponentOptionsBase<C> {
  displayName?: string;

  beforeNodeCreateComponent?(convertedNode: ConvertedTreeNode): void;
  nodeCreatedComponent?(convertedNode: ConvertedTreeNode): void;
  nodeComponentRefAttached?(node: ComponentNode, instance: ElementType): void;
  componentDidMount?(): void;
  componentWillUnmount?(): void;
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
  ComponentType<LowCodeComponentProps>,
  CreateComponentOptions
>({
  stateCreator: reactiveStateCreator,
  componentCreator: ({ codeRuntime, createInstance }, componentOptions) => {
    const {
      displayName = '__LowCodeComponent__',
      componentsTree,
      componentsRecord,

      beforeNodeCreateComponent,
      nodeCreatedComponent,
      nodeComponentRefAttached,
      componentDidMount,
      componentWillUnmount,

      ...extraOptions
    } = componentOptions;

    const lowCodeComponentCache = new Map<string, ComponentType<any>>();

    function getComponentByName(
      componentName: string,
      componentsRecord: Record<string, ComponentType<any> | Package>
    ) {
      const Component = componentsRecord[componentName];
      if (!Component) {
        return undefined;
      }

      if (isLowCodeComponentPackage(Component)) {
        if (lowCodeComponentCache.has(componentName)) {
          return lowCodeComponentCache.get(componentName);
        }

        const componentsTree = Component.schema as any;
        const LowCodeComponent = createComponent({
          ...extraOptions,
          displayName: componentsTree.componentName,
          componentsRecord,
          componentsTree,
        });

        lowCodeComponentCache.set(componentName, LowCodeComponent);

        return LowCodeComponent;
      }

      return Component;
    }

    function createConvertedTreeNode(
      rawNode: ComponentTreeNode,
      codeRuntime: CodeRuntime
    ): ConvertedTreeNode {
      let elementValue: ReactNode = null;

      const node: ConvertedTreeNode = {
        type: rawNode.type,
        raw: rawNode,
        context: { codeRuntime },

        getReactNode() {
          return elementValue;
        },
        setReactNode(element) {
          elementValue = element;
        },
      };

      if (rawNode.type === 'component') {
        node.rawComponent = getComponentByName(
          rawNode.data.componentName,
          componentsRecord
        );
      }

      return node;
    }

    function createReactElement(
      node: ComponentTreeNode,
      codeRuntime: CodeRuntime,
      instance: ContainerInstance,
      componentsRecord: Record<string, ComponentType<any> | Package>
    ) {
      const convertedNode = createConvertedTreeNode(node, codeRuntime);

      beforeNodeCreateComponent?.(convertedNode);

      if (!convertedNode.getReactNode()) {
        if (convertedNode.type === 'string') {
          convertedNode.setReactNode(convertedNode.raw.data as string);
        } else if (convertedNode.type === 'expression') {
          const rawValue = convertedNode.raw.data as JSExpression;

          function Text(props: any) {
            return props.text;
          }
          Text.displayName = 'Text';

          const ReactivedText = reactive(Text, {
            target: {
              text: rawValue,
            },
            valueGetter: node => codeRuntime.parseExprOrFn(node),
          });

          convertedNode.setReactNode(<ReactivedText key={rawValue.value} />);
        } else if (convertedNode.type === 'component') {
          const createReactElementByNode = () => {
            const Component = convertedNode.rawComponent;
            if (!Component) return null;

            const rawNode = convertedNode.raw as ComponentNode;
            const {
              id,
              componentName,
              condition = true,
              loop,
              loopArgs = ['item', 'index'],
              props: nodeProps = {},
            } = rawNode.data;

            // condition为 Falsy 的情况下 不渲染
            if (!condition) return null;
            // loop 为数组且为空的情况下 不渲染
            if (Array.isArray(loop) && loop.length === 0) return null;

            function createElementWithProps(
              Component: ComponentType<any>,
              props: AnyObject,
              codeRuntime: CodeRuntime,
              key: string,
              children: ReactNode[] = []
            ) {
              const { ref, ...componentProps } = props;

              const refFunction = (ins: any) => {
                if (ins) {
                  if (ref) instance.setRefInstance(ref as string, ins);
                  nodeComponentRefAttached?.(rawNode, ins);
                }
              };

              // 先将 jsslot, jsFunction 对象转换
              const finalProps = processValue(
                componentProps,
                node => isJsSlot(node) || isJsFunction(node),
                (node: JSSlot | JSFunction) => {
                  if (isJsSlot(node)) {
                    if (node.value) {
                      const nodes = (
                        Array.isArray(node.value) ? node.value : [node.value]
                      ).map(n => createNode(n, undefined));

                      if (node.params?.length) {
                        return (...args: any[]) => {
                          const params = node.params!.reduce(
                            (prev, cur, idx) => {
                              return (prev[cur] = args[idx]);
                            },
                            {} as AnyObject
                          );
                          const subCodeScope = codeRuntime
                            .getScope()
                            .createSubScope(params);
                          const subCodeRuntime =
                            createCodeRuntime(subCodeScope);

                          return nodes.map(n =>
                            createReactElement(
                              n,
                              subCodeRuntime,
                              instance,
                              componentsRecord
                            )
                          );
                        };
                      } else {
                        return nodes.map(n =>
                          createReactElement(
                            n,
                            codeRuntime,
                            instance,
                            componentsRecord
                          )
                        );
                      }
                    }
                  } else if (isJsFunction(node)) {
                    return codeRuntime.parseExprOrFn(node);
                  }

                  return null;
                }
              );

              if (someValue(finalProps, isJsExpression)) {
                function Props(props: any) {
                  return createElement(
                    Component,
                    {
                      ...props,
                      key,
                      ref: refFunction,
                    },
                    children
                  );
                }
                Props.displayName = 'Props';

                const Reactived = reactive(Props, {
                  target: finalProps,
                  valueGetter: node => codeRuntime.parseExprOrFn(node),
                });

                return <Reactived key={key} />;
              } else {
                return createElement(
                  Component,
                  {
                    ...finalProps,
                    key,
                    ref: refFunction,
                  },
                  children
                );
              }
            }

            const currentComponentKey = id || componentName;

            let element: any = createElementWithProps(
              Component,
              nodeProps,
              codeRuntime,
              currentComponentKey,
              rawNode.children?.map(n =>
                createReactElement(n, codeRuntime, instance, componentsRecord)
              )
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
                    Component,
                    nodeProps,
                    subCodeRuntime,
                    `loop-${currentComponentKey}-${idx}`,
                    rawNode.children?.map(n =>
                      createReactElement(
                        n,
                        subCodeRuntime,
                        instance,
                        componentsRecord
                      )
                    )
                  );
                });
              };

              if (isJsExpression(loop)) {
                function Loop(props: any) {
                  if (!Array.isArray(props.loop)) {
                    return null;
                  }

                  return genLoopElements(props.loop);
                }
                Loop.displayName = 'Loop';

                const ReactivedLoop = reactive(Loop, {
                  target: {
                    loop,
                  },
                  valueGetter: expr => codeRuntime.parseExprOrFn(expr),
                });

                element = createElement(ReactivedLoop, {
                  key: currentComponentKey,
                });
              } else {
                element = genLoopElements(loop as any[]);
              }
            }

            if (isJsExpression(condition)) {
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
                valueGetter: expr => codeRuntime.parseExprOrFn(expr),
              });

              return createElement(ReactivedCondition, {
                key: currentComponentKey,
              });
            }

            return element;
          };

          convertedNode.setReactNode(createReactElementByNode());
        }
      }

      nodeCreatedComponent?.(convertedNode);

      const finalElement = convertedNode.getReactNode();
      // if finalElement is null, todo..
      return finalElement;
    }

    const LowCodeComponent = forwardRef(function (
      props: LowCodeComponentProps,
      ref: ForwardedRef<any>
    ) {
      const { id, className, style, ...extraProps } = props;
      const isMounted = useRef(false);

      const instance = useMemo(() => {
        return createInstance(componentsTree, extraProps);
      }, []);

      useEffect(() => {
        let styleEl: HTMLElement | undefined;
        const scopeValue = instance.codeScope.value;

        // init dataSource
        scopeValue.reloadDataSource();

        if (instance.cssText) {
          appendExternalStyle(instance.cssText).then(el => {
            styleEl = el;
          });
        }

        // trigger lifeCycles
        componentDidMount?.();
        instance.triggerLifeCycle('componentDidMount');

        // 当 state 改变之后调用
        const unwatch = watch(scopeValue.state, (_, oldVal) => {
          if (isMounted.current) {
            instance.triggerLifeCycle('componentDidUpdate', props, oldVal);
          }
        });

        isMounted.current = true;

        return () => {
          styleEl?.parentNode?.removeChild(styleEl);

          componentWillUnmount?.();
          instance.triggerLifeCycle('componentWillUnmount');
          unwatch();

          isMounted.current = false;
        };
      }, [instance]);

      return (
        <div id={id} className={className} style={style} ref={ref}>
          {instance
            .getComponentTreeNodes()
            .map(n =>
              createReactElement(n, codeRuntime, instance, componentsRecord)
            )}
        </div>
      );
    });

    LowCodeComponent.displayName = displayName;

    return LowCodeComponent;
  },
});
