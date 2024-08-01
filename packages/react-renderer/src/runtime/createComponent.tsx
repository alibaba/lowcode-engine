import { invariant, specTypes, type ComponentTree } from '@alilc/lowcode-shared';
import { type ComponentTreeModelOptions, ComponentTreeModel } from '@alilc/lowcode-renderer-core';
import { forwardRef, useRef, useEffect } from 'react';
import { isValidElementType } from 'react-is';
import { type ReactComponent, type ReactWidget, createElementByWidget } from './elements';
import { appendExternalStyle } from '../utils/element';
import { type ComponentsAccessor } from '../app';

import type { ICodeRuntime, IComponentTreeModel } from '@alilc/lowcode-renderer-core';
import type { ReactInstance, CSSProperties, ForwardedRef, ReactNode } from 'react';

export interface ComponentOptions {
  displayName?: string;
  modelOptions: ComponentTreeModelOptions;

  beforeElementCreate?(widget: ReactWidget): ReactWidget;
  elementCreated?(widget: ReactWidget, element: ReactNode): ReactNode;
  componentRefAttached?(widget: ReactWidget, instance: ReactInstance | null): void;
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

export function getOrCreateComponent(
  name: string,
  codeRuntime: ICodeRuntime,
  components: ComponentsAccessor,
  componentOptions: ComponentOptions,
): ReactComponent {
  const result = lowCodeComponentsCache.get(name) || components.getComponent(name);

  if (specTypes.isLowCodeComponentPackage(result)) {
    const { schema, ...metadata } = result;

    const lowCodeComponent = createComponent(schema, codeRuntime, components, {
      ...componentOptions,
      displayName: name,
      modelOptions: {
        ...componentOptions.modelOptions,
        id: metadata.id,
        metadata,
      },
    });

    lowCodeComponentsCache.set(name, lowCodeComponent);

    return lowCodeComponent;
  }

  invariant(isValidElementType(result), `${name} must be a React Component`);

  return result;
}

export function createComponent(
  schema: ComponentTree,
  codeRuntime: ICodeRuntime,
  components: ComponentsAccessor,
  componentOptions: ComponentOptions,
) {
  const { displayName = '__LowCodeComponent__', modelOptions } = componentOptions;

  const LowCodeComponent = forwardRef(function (
    props: LowCodeComponentProps,
    ref: ForwardedRef<any>,
  ) {
    const modelRef = useRef<IComponentTreeModel<ReactComponent, ReactInstance>>();

    if (!modelRef.current) {
      modelRef.current = new ComponentTreeModel(
        schema,
        codeRuntime.createChild({
          props,
        } as any),
        modelOptions,
      );

      console.log(
        '%c [ model ]-103',
        'font-size:13px; background:pink; color:#bf2c9f;',
        modelRef.current,
      );
    }

    const model = modelRef.current!;

    const isConstructed = useRef(false);
    const isMounted = useRef(false);

    if (!isConstructed.current) {
      model.triggerLifeCycle('constructor');
      isConstructed.current = true;

      const cssText = model.getCssText();
      if (cssText) {
        appendExternalStyle(cssText, { id: model.id });
      }
    }

    useEffect(() => {
      // trigger lifeCycles
      model.triggerLifeCycle('componentDidMount');

      // 当 state 改变之后调用
      // const unwatch = watch(scopeValue.state, (_, oldVal) => {
      //   if (isMounted.current) {
      //     model.triggerLifeCycle('componentDidUpdate', props, oldVal);
      //   }
      // });

      isMounted.current = true;

      return () => {
        // componentWillUnmount?.();
        model.triggerLifeCycle('componentWillUnmount');
        // unwatch();
        isMounted.current = false;
      };
    }, []);

    return (
      <div id={props.id} className={props.className} style={props.style} ref={ref}>
        {model.widgets.map((w) =>
          createElementByWidget({
            widget: w,
            codeRuntime: w.model.codeRuntime,
            components,
            options: componentOptions,
          }),
        )}
      </div>
    );
  });

  LowCodeComponent.displayName = displayName;

  return LowCodeComponent;
}
