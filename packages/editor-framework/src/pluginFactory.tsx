import React, { createRef, PureComponent } from 'react';

import EditorContext from './context';
import { I18nFunction, PluginProps, PluginClass, Plugin } from './definitions';
import Editor from './editor';
import { acceptsRef, generateI18n, isEmpty, transformToPromise } from './utils';

export default function pluginFactory(Comp: PluginClass): React.ComponentType<PluginProps> {
  class LowcodePlugin extends PureComponent<PluginProps> {
    public static displayName = 'LowcodeEditorPlugin';

    public static contextType = EditorContext;

    public static init = Comp.init;

    public ref: React.RefObject<React.ReactElement> & Plugin;

    private editor: Editor;

    private pluginKey: string;

    private i18n: I18nFunction;

    constructor(props, context) {
      super(props, context);
      if (isEmpty(props.config) || !props.config.pluginKey) {
        console.warn('lowcode editor plugin has wrong config');
        return;
      }
      const { editor } = props;
      this.ref = createRef<React.ReactElement>();
      // 注册插件
      this.editor = editor;
      this.pluginKey = props.config.pluginKey;
      const defaultProps = Comp.defaultProps || {};
      const locale = this.editor.get('locale') || defaultProps.locale || 'zh-CN';
      const editorMessages = this.editor.get('messages') || {};
      const messages = editorMessages[this.pluginKey] || defaultProps.messages || {};
      this.i18n = generateI18n(locale, messages);

      editor.set('plugins', {
        ...editor.plugins,
        [this.pluginKey]: this,
      });
    }

    public componentWillUnmount(): void {
      // 销毁插件
      if (this.pluginKey && this.editor && this.editor.plugins) {
        delete this.editor.plugins[this.pluginKey];
      }
    }

    public open = (): Promise<any> => {
      if (this.ref && this.ref.open && typeof this.ref.open === 'function') {
        return transformToPromise(this.ref.open());
      }
      return Promise.resolve();
    };

    public close = (): Promise<any> => {
      if (this.ref && this.ref.close && typeof this.ref.close === 'function') {
        return transformToPromise(this.ref.close());
      }
      return Promise.resolve();
    };

    public render(): React.ReactNode {
      const { config } = this.props;
      const props = {
        i18n: this.i18n,
        editor: this.editor,
        config,
        ...config.pluginProps,
      };
      if (acceptsRef(Comp)) {
        props.ref = this.ref;
      }
      return <Comp {...props} />;
    }
  }

  return LowcodePlugin;
}
