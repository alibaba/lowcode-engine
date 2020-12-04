export default {
  title: '容器',
  componentName: 'Div',
  docUrl: 'http://gitlab.alibaba-inc.com/vision-components/vc-block/blob/master/README.md',
  category: '布局',
  isContainer: true,
  canOperating: false,
  extraActions: [],
  canContain: 'Form',
  canDropTo: 'Div',
  canDropIn: 'Div',
  canResizing: true,
  canDraging: false,
  context: {},
  initialChildren() {},
  didDropIn() {},
  didDropOut() {},
  subtreeModified() {},
  onResize() {},
  onResizeStart() {},
  onResizeEnd() {},
  canUseCondition: true,
  canLoop: true,
  snippets: [
    {
      screenshot: 'https://img.alicdn.com/tfs/TB1CHN3u4z1gK0jSZSgXXavwpXa-112-64.png',
      label: '普通型',
      schema: {
        componentName: 'Div',
        props: {},
      },
    },
  ],
  configure: [
    {
      name: 'myName',
      title: '我的名字',
      display: 'tab',
      initialValue: 'NORMAL',
      defaultValue: 'NORMAL',
      collapsed: true,
      supportVariable: true,
      accessor(field, val) {},
      mutator(field, val) {},
      disabled() {
        return true;
      },
      useVariableChange() {},
      allowTextInput: true,
      liveTextEditing: true,
      setter: [
        {
          key: null,
          ref: null,
          props: {
            options: [
              {
                title: '普通',
                value: 'NORMAL',
              },
              {
                title: '隐藏',
                value: 'HIDDEN',
              },
            ],
            loose: false,
            cancelable: false,
          },
          _owner: null,
        },
        {
          key: null,
          ref: null,
          props: {
            options: [
              {
                title: '普通',
                value: 'NORMAL',
              },
              {
                title: '隐藏',
                value: 'HIDDEN',
              },
            ],
            loose: false,
            cancelable: false,
          },
          _owner: null,
        },
      ],
    },
    {
      name: 'mySlotName',
      slotName: 'mySlotName',
      slotTitle: '我的 Slot 名字',
      display: 'tab',
      initialValue: 'NORMAL',
      defaultValue: 'NORMAL',
      collapsed: true,
      supportVariable: true,
      accessor(field, val) {},
      mutator(field, val) {},
      disabled() {
        return true;
      },
      setter: {
        key: null,
        ref: null,
        props: {
          options: [
            {
              title: '普通',
              value: 'NORMAL',
            },
            {
              title: '隐藏',
              value: 'HIDDEN',
            },
          ],
          loose: false,
          cancelable: false,
        },
        _owner: null,
      },
    },
    {
      name: 'behavior',
      title: '默认状态',
      display: 'inline',
      initialValue: 'NORMAL',
      supportVariable: true,
      setter: {
        key: null,
        ref: null,
        props: {
          options: [
            {
              title: '普通',
              value: 'NORMAL',
            },
            {
              title: '隐藏',
              value: 'HIDDEN',
            },
          ],
          loose: false,
          cancelable: false,
        },
        _owner: null,
      },
    },
    {
      name: '__style__',
      title: '样式设置',
      display: 'accordion',
      collapsed: false,
      initialValue: {},
      tip: {
        url: 'https://lark.alipay.com/legao/help/design-tool-style',
        content: '点击 ? 查看样式设置器用法指南',
      },
      setter: {
        key: null,
        ref: null,
        props: {
          advanced: true,
        },
        _owner: null,
      },
    },
    {
      type: 'group',
      title: '高级',
      display: 'accordion',
      items: [
        {
          name: 'fieldId',
          title: '唯一标识',
          display: 'block',
          tip:
            '组件的唯一标识符，不能够与其它组件重名，不能够为空，且只能够使用以字母开头的，下划线以及数字的组合。',
          setter: {
            key: null,
            ref: null,
            props: {
              placeholder: '请输入唯一标识',
              multiline: false,
              rows: 10,
              required: false,
              pattern: null,
              maxLength: null,
            },
            _owner: null,
          },
        },
        {
          name: 'useFieldIdAsDomId',
          title: '将唯一标识用作 DOM ID',
          display: 'block',
          tip:
            '开启这个配置项后，会在当前组件的 HTML 元素上加入 id="当前组件的 fieldId"，一般用于做 utils 的绑定，不常用',
          initialValue: false,
          setter: {
            key: null,
            ref: null,
            props: {},
            _owner: null,
          },
        },
        {
          name: 'customClassName',
          title: '自定义样式类',
          display: 'block',
          supportVariable: true,
          initialValue: '',
          setter: {
            key: null,
            ref: null,
            props: {
              placeholder: null,
              multiline: false,
              rows: 10,
              required: false,
              pattern: null,
              maxLength: null,
            },
            _owner: null,
          },
        },
        {
          name: 'events',
          title: '动作设置',
          tip: {
            url: 'https://lark.alipay.com/legao/legao/events-call',
            content: '点击 ? 查看如何设置组件的事件响应动作',
          },
          display: 'accordion',
          initialValue: {
            ignored: true,
          },
          setter: {
            key: null,
            ref: null,
            props: {
              events: [
                {
                  name: 'onClick',
                  title: '当点击时',
                  initialValue:
                    "/**\n * 容器 当点击时\n */\nfunction onClick(event) {\n  console.log('onClick', event);\n}",
                },
                {
                  name: 'onMouseEnter',
                  title: '当鼠标进入时',
                  initialValue:
                    "/**\n * 容器 当鼠标进入时\n */\nfunction onMouseEnter(event) {\n  console.log('onMouseEnter', event);\n}",
                },
                {
                  name: 'onMouseLeave',
                  title: '当鼠标离开时',
                  initialValue:
                    "/**\n * 容器 当鼠标离开时\n */\nfunction onMouseLeave(event) {\n  console.log('onMouseLeave', event);\n}",
                },
              ],
            },
            _owner: null,
          },
        },
        {
          name: 'onClick',
          display: 'none',
          initialValue: {
            ignored: true,
          },
        },
        {
          name: 'onMouseEnter',
          display: 'none',
          initialValue: {
            ignored: true,
          },
        },
        {
          name: 'onMouseLeave',
          display: 'none',
          initialValue: {
            ignored: true,
          },
        },
      ],
    },
  ],
};
