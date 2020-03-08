import { PureComponent } from 'react';

import EditorContext from './context';
import { isEmpty, generateI18n, goldlog } from './utils';

export interface pluginProps {
  config: object,
  editor: object,
  locale: string,
  messages: object
}

export default function plugin(Comp) {

  class Plugin extends PureComponent<pluginProps> {
    static displayName = 'lowcode-editor-plugin';
    static defaultProps = {
      config: {}
    };
    static contextType = EditorContext;
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
      const {
        config
      } = this.props;
      return <Comp i18n={this.i18n} editor={this.editor} config={config} {...config.pluginProps}/>
    }
  }

  return Plugin;
}



export class Plugin extends PureComponent<pluginProps> {
  static displayName = 'lowcode-editor-plugin';
  static defaultProps = {
    config: {}
  };
  static contextType = EditorContext;
  constructor(props, context) {
    super(props, context);
    if (isEmpty(props.config) || !props.config.addonKey) {
      console.warn('luna addon has wrong config');
      return;
    }

  
    const { locale, messages, editor } = props;
    // 注册插件
    this.editor = editor;
    this.i18n = generateI18n(locale, messages);
    this.pluginKey = props.config.pluginKey;
    editor.plugins = editor.plugins || {};
    editor.plugins[this.pluginKey] = this;
  }

  async componentWillUnmount() {
    // 销毁插件
    if (this.editor && this.editor.plugins) {
      delete this.editor.plugins[this.pluginKey];
    }
  }

  open = () => {
    return true;
  };

  close = () => {
    return true;
  };

  goldlog = (goKey:string, params:any) => {
    const { pluginKey, config = {} } = this.props.config || {};
    goldlog(
      goKey,
      {
        pluginKey,
        package: config.package,
        version: config.version,
        ...this.editor.logParams,
        ...params
      },
      'addon'
    );
  };

  get utils() {
    return this.editor.utils;
  }

  get constants() {
    return this.editor.constants;
  }

  get history() {
    return this.editor.history;
  }

  get location() {
    return this.editor.location;
  }

  render() {
    return null;
  }
}
