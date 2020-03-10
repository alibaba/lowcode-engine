import React, { PureComponent, createRef } from 'react';

import EditorContext from './context';
import Editor from './editor';
import { isEmpty, generateI18n } from './utils';
import { PluginConfig, I18nFunction } from './definitions';

export interface PluginProps {
  editor: Editor;
  config: PluginConfig;
}

export interface InjectedPluginProps {
  i18n?: I18nFunction;
}

export default function pluginFactory(
  Comp: React.ComponentType<PluginProps & InjectedPluginProps>
): React.ComponentType<PluginProps> {
  class LowcodePlugin extends PureComponent<PluginProps> {
    static displayName = 'LowcodeEditorPlugin';
    static defaultProps = {
      config: {}
    };
    static contextType = EditorContext;
    static init = Comp.init;
    public ref = createRef<React.Component>();
    private editor: Editor;
    private pluginKey: string;
    private i18n: I18nFunction;

    constructor(props, context) {
      super(props, context);
      if (isEmpty(props.config) || !props.config.pluginKey) {
        console.warn('lowcode editor plugin has wrong config');
        return;
      }
      const { locale, messages, editor } = props;
      // 注册插件
      this.editor = editor;
      this.i18n = generateI18n(locale, messages);
      this.pluginKey = props.config.pluginKey;
      editor.set('plugins', {
        ...editor.plugins,
        [this.pluginKey]: this
      });
    }

    componentWillUnmount() {
      // 销毁插件
      if (this.editor && this.editor.plugins) {
        delete this.editor.plugins[this.pluginKey];
      }
    }

    open = () => {
      return this.ref && this.ref.open && this.ref.open();
    };

    close = () => {
      return this.ref && this.ref.close && this.ref.close();
    };

    render() {
      const { config } = this.props;
      return <Comp ref={this.ref} i18n={this.i18n} editor={this.editor} config={config} {...config.pluginProps} />;
    }
  }

  return LowcodePlugin;
}
