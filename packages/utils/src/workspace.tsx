import React, { useEffect, useState, useCallback } from 'react';
import { IPublicModelPluginContext, IPublicEnumPluginRegisterLevel, IPublicModelWindow, IPublicModelEditorView } from '@alilc/lowcode-types';

/**
 * 高阶组件（HOC）：为组件提供 view 插件上下文。
 *
 * @param {React.ComponentType} Component - 需要被封装的组件。
 * @param {string|string[]} viewName - 视图名称或视图名称数组，用于过滤特定的视图插件上下文。
 * @returns {React.ComponentType} 返回封装后的组件。
 *
 * @example
 * // 用法示例（函数组件）:
 * const EnhancedComponent = ProvideViewPluginContext(MyComponent, "viewName");
 */
export const ProvideViewPluginContext = (Component: any, viewName?: string | string[]) => {
  // 创建一个新的函数组件，以便在其中使用 Hooks
  return function WithPluginContext(props: {
    [key: string]: any;

    pluginContext?: IPublicModelPluginContext;
  }) {
    const getPluginContextFun = useCallback((editorWindow?: IPublicModelWindow | null) => {
      if (!editorWindow?.currentEditorView) {
        return null;
      }
      if (viewName) {
        const items = editorWindow?.editorViews.filter(d => (d as any).viewName === viewName || (Array.isArray(viewName) && viewName.includes((d as any).viewName)));
        return items[0];
      } else {
        return editorWindow.currentEditorView;
      }
    }, []);

    const { workspace } = props.pluginContext || {};
    const [pluginContext, setPluginContext] = useState<IPublicModelEditorView | null>(getPluginContextFun(workspace?.window));

    useEffect(() => {
      if (workspace?.window) {
        const ctx = getPluginContextFun(workspace.window);
        ctx && setPluginContext(ctx);
      }
      return workspace?.onChangeActiveEditorView(() => {
        const ctx = getPluginContextFun(workspace.window);
        ctx && setPluginContext(ctx);
      });
    }, [workspace, getPluginContextFun]);

    if (props.pluginContext?.registerLevel !== IPublicEnumPluginRegisterLevel.Workspace || !props.pluginContext) {
      return <Component {...props} />;
    }

    return <Component {...props} pluginContext={pluginContext} />;
  };
};
