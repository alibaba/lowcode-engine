import { invariant, isLowCodeComponentPackage, type Spec } from '@alilc/lowcode-shared';
import { forwardRef, useRef, useEffect } from 'react';
import { isValidElementType } from 'react-is';
import { useRendererContext } from '../api/context';
import { reactiveStateFactory } from './reactiveState';
import { type ReactComponent, type ReactWidget, createElementByWidget } from './elements';
import { appendExternalStyle } from '../utils/element';

import type {
  RenderContext,
  IComponentTreeModel,
  CreateComponentTreeModelOptions,
} from '@alilc/lowcode-renderer-core';
import type { ReactInstance, CSSProperties, ForwardedRef, ReactNode } from 'react';

export interface ComponentOptions {
  displayName?: string;
  modelOptions?: Pick<CreateComponentTreeModelOptions, 'id' | 'metadata'>;

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

export function getComponentByName(
  name: string,
  { packageManager, boostsManager }: RenderContext,
  componentOptions: ComponentOptions = {},
): ReactComponent {
  const result = lowCodeComponentsCache.get(name) || packageManager.getComponent(name);

  if (isLowCodeComponentPackage(result)) {
    const { schema, ...metadata } = result;
    const { componentsMap, componentsTree, utils, i18n } = schema;

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

    const lowCodeComponent = createComponent(componentsTree[0], {
      ...componentOptions,
      displayName: name,
      modelOptions: {
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
  schema: string | Spec.ComponentTreeRoot,
  componentOptions: ComponentOptions = {},
) {
  const { displayName = '__LowCodeComponent__', modelOptions } = componentOptions;

  const LowCodeComponent = forwardRef(function (
    props: LowCodeComponentProps,
    ref: ForwardedRef<any>,
  ) {
    const context = useRendererContext();
    const { options: globalOptions, componentTreeModel } = context;

    const modelRef = useRef<IComponentTreeModel<ReactComponent, ReactInstance>>();

    if (!modelRef.current) {
      const finalOptions: CreateComponentTreeModelOptions = {
        ...modelOptions,
        codeScopeValue: {
          props,
        },
        stateCreator: reactiveStateFactory,
        dataSourceCreator: globalOptions.dataSourceCreator,
      };

      if (typeof schema === 'string') {
        modelRef.current = componentTreeModel.createById(schema, finalOptions);
      } else {
        modelRef.current = componentTreeModel.create(schema, finalOptions);
      }
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
      // componentDidMount?.();
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
        {model.widgets.map((w) => createElementByWidget(w, w.model.codeRuntime, componentOptions))}
      </div>
    );
  });

  LowCodeComponent.displayName = displayName;

  return LowCodeComponent;
}
