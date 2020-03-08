import React, { PureComponent, creatRef} from 'react';

import EditorContext from './context';
import { isEmpty, generateI18n, goldlog } from './utils';


export default function plugin(Comp) {
  class LowcodePlugin extends PureComponent {
    static displayName = 'LowcodeEditorPlugin';
    static defaultProps = {
      config: {},
    };
    static contextType = EditorContext;
    constructor(props, context) {
      super(props, context);
      if (isEmpty(props.config) || !props.config.pluginKey) {
        console.warn('lowcode editor plugin has wrong config');
        return;
      }
      this.ref = React.createRef();
      const { locale, messages, editor } = props;
      // 注册插件
      this.editor = editor;
      this.i18n = generateI18n(locale, messages);
      this.pluginKey = props.config.pluginKey;
      editor.plugins = editor.plugins || {};
      editor.plugins[this.pluginKey] = this;
    }

    componentWillUnmount() {
      // 销毁插件
      if (this.editor && this.editor.plugins) {
        delete this.editor.plugins[this.pluginKey];
      }
    }

    render() {
      const { config } = this.props;
      return (
        <Comp
          ref={this.ref}
          i18n={this.i18n}
          editor={this.editor}
          config={config}
          {...config.pluginProps}
        />
      );
    }
  }

  LowcodePlugin.init = Comp.init;

  return LowcodePlugin;
}
