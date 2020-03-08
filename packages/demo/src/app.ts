import { ViewController } from '@ali/recore';
import DesignView from '../../designer/src';
import NumberSetter from '../../plugin-setters/number-setter';
import SettingsPane, { registerSetter } from '../../plugin-settings-pane/src';
import { EventEmitter } from 'events';
import { Input } from '@alifd/next';
import { createElement } from 'react';

registerSetter('ClassNameSetter', () => {
  return createElement('div', {
    className: 'lc-block-setter'
  }, '这里是类名绑定');
});

registerSetter('EventsSetter', () => {
  return createElement('div', {
    className: 'lc-block-setter'
  }, '这里是事件设置');
});

registerSetter('StringSetter', { component: Input, props: { placeholder: "请输入" } });

registerSetter('NumberSetter', NumberSetter as any);

const emitter = new EventEmitter();

// 应用入口视图，导航和所有页面复用的 UI 在这里处理
export default class App extends ViewController {
  static components = {
    DesignView,
    SettingsPane
  };

  editor = {
    on(type: string, fn: any) {
      emitter.on(type, fn);
    }
  }

  $didMount() {
    const designer = this.$refs.d.designer;
    const pane = this.$refs.pane;
    (window as any).LCDesigner = designer;
    if (designer.project.activedDocument) {
      emitter.emit('designer.actived-document-change', designer.project.activedDocument);
    }
    designer.project.onActivedDocumentChange((doc: any) => {
      emitter.emit('designer.actived-document-change', doc);
    });
    (this.editor as any).designer = designer;
    designer.dragon.from(pane, () => {
      return {
        type: 'nodedata',
        data: {
          componentName: 'Button',
          props: {
            type: 'primary',
          },
          children: 'awefawef'
        },
      };
    });
  }
}
