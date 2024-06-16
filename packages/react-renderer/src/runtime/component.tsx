import { invariant, isLowCodeComponentPackage, type Spec } from '@alilc/lowcode-shared';
import { forwardRef, useRef, useEffect } from 'react';
import { isValidElementType } from 'react-is';
import { useRenderContext } from '../app/context';
import { reactiveStateFactory } from './reactiveState';
import { dataSourceCreator } from './dataSource';
import { type ReactComponent, type ReactWidget, createElementByWidget } from './render';
import { ModelContextProvider } from './context';
import { appendExternalStyle } from '../utils/element';

import type {
  RenderContext,
  IComponentTreeModel,
  ComponentTreeModelOptions,
} from '@alilc/lowcode-renderer-core';
import type { ReactInstance, CSSProperties, ForwardedRef } from 'react';

export interface ComponentOptions {
  displayName?: string;
  modelOptions?: ComponentTreeModelOptions;

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

    const lowCodeComponent = createComponentBySchema(componentsTree[0], {
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

export function createComponentBySchema(
  schema: string | Spec.ComponentTreeRoot,
  { displayName = '__LowCodeComponent__', modelOptions }: ComponentOptions = {},
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
        modelRef.current = componentTreeModel.createById(schema, modelOptions);
      } else {
        modelRef.current = componentTreeModel.create(schema, modelOptions);
      }
    }

    const model = modelRef.current!;
    console.log('%c [ model ]-103', 'font-size:13px; background:pink; color:#bf2c9f;', model);

    const isConstructed = useRef(false);
    const isMounted = useRef(false);

    if (!isConstructed.current) {
      model.initialize({
        defaultProps: props,
        stateCreator: reactiveStateFactory,
        dataSourceCreator,
      });

      model.triggerLifeCycle('constructor');
      isConstructed.current = true;

      const cssText = model.getCssText();
      if (cssText) {
        appendExternalStyle(cssText, { id: model.id });
      }
    }

    useEffect(() => {
      const scopeValue = model.codeScope.value;

      // init dataSource
      scopeValue.reloadDataSource?.();

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
      <ModelContextProvider value={model}>
        <div id={props.id} className={props.className} style={props.style} ref={ref}>
          {model.widgets.map((w) => createElementByWidget(w, model.codeScope))}
        </div>
      </ModelContextProvider>
    );
  });

  LowCodeComponent.displayName = displayName;

  return LowCodeComponent;
}
