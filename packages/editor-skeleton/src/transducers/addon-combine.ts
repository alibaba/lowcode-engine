import { TransformedComponentMetadata, FieldConfig, SettingTarget } from '@ali/lowcode-types';

export default function(metadata: TransformedComponentMetadata): TransformedComponentMetadata {
  const { componentName, configure = {} } = metadata;
  if (componentName === 'Leaf') {
    return {
      ...metadata,
      configure: {
        ...configure,
        combined: [
          {
            name: 'children',
            title: { type: 'i18n', 'zh-CN': '内容设置', 'en-US': 'Content' },
            setter: {
              componentName: 'MixinSetter',
              props: {
                // TODO:
                setters: [
                  {
                    componentName: 'StringSetter',
                    props: {
                      // TODO: textarea mode
                      multiline: true,
                    },
                    initialValue: '',
                  },
                  {
                    componentName: 'ExpressionSetter',
                    initialValue: {
                      type: 'JSExpression',
                      value: '',
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    };
  }

  const { props, events = {}, styles } = configure as any;
  const isRoot: boolean = componentName === 'Page' || componentName === 'Component';
  const eventsDefinition: any[] = [];
  const supportedLifecycles =
    events.supportedLifecycles ||
    (isRoot
      ? /*[
          {
            description: '初始化时',
            name: 'constructor',
          },
          {
            description: '装载后',
            name: 'componentDidMount',
          },
          {
            description: '更新时',
            name: 'componentDidMount',
          },
          {
            description: '卸载时',
            name: 'componentWillUnmount',
          },
        ]*/ null
      : null);
  if (supportedLifecycles) {
    eventsDefinition.push({
      type: 'lifeCycleEvent',
      title: '生命周期',
      list: supportedLifecycles.map((event: any) => (typeof event === 'string' ? { name: event } : event)),
    });
  }
  if (events.supportedEvents) {
    eventsDefinition.push({
      type: 'events',
      title: '事件',
      list: (events.supportedEvents || []).map((event: any) => (typeof event === 'string' ? { name: event } : event)),
    });
  }
  //  通用设置
  const propsGroup = props || [];
  /*
  propsGroup.push({
    name: '#generals',
    title: { type: 'i18n', 'zh-CN': '通用', 'en-US': 'General' },
    items: [
      {
        name: 'id',
        title: 'ID',
        setter: 'StringSetter',
      },
      {
        name: 'key',
        title: 'Key',
        // todo: use Mixin
        setter: 'StringSetter',
      },
      {
        name: 'ref',
        title: 'Ref',
        setter: 'StringSetter',
      },
      {
        name: '!more',
        title: '更多',
        setter: 'PropertiesSetter',
      },
    ],
  });
  */
  const combined: FieldConfig[] = [
    {
      title: { type: 'i18n', 'zh-CN': '属性', 'en-US': 'Props' },
      name: '#props',
      items: propsGroup,
    },
  ];
  const stylesGroup: FieldConfig[] = [];
  if (styles?.supportClassName) {
    stylesGroup.push({
      name: 'className',
      title: { type: 'i18n', 'zh-CN': '类名绑定', 'en-US': 'ClassName' },
      setter: 'ClassNameSetter',
    });
  }
  if (styles?.supportInlineStyle) {
    stylesGroup.push({
      name: 'style',
      title: { type: 'i18n', 'zh-CN': '行内样式', 'en-US': 'Style' },
      setter: 'StyleSetter',
    });
  }
  if (stylesGroup.length > 0) {
    combined.push({
      name: '#styles',
      title: { type: 'i18n', 'zh-CN': '样式', 'en-US': 'Styles' },
      items: stylesGroup,
    });
  }

  if (eventsDefinition.length > 0) {
    combined.push({
      name: '#events',
      title: { type: 'i18n', 'zh-CN': '事件', 'en-US': 'Events' },
      items: [
        {
          name: '!events',
          title: { type: 'i18n', 'zh-CN': '事件设置', 'en-US': 'Events' },
          setter: {
            componentName: 'EventsSetter',
            props: {
              definition: eventsDefinition,
            },
          },
          getValue(field: SettingTarget, val?: any[]) {
            // todo:
            return val;
          },

          setValue(field: SettingTarget, eventDataList: any[]) {
            // todo:
            return;
          },
        },
      ],
    });
  }

  if (isRoot) {
    /*
    combined.push({
      name: '#advanced',
      title: { type: 'i18n', 'zh-CN': '高级', 'en-US': 'Advance' },
      items: [],
    });
    */
  } else {
    combined.push({
      name: '#advanced',
      title: { type: 'i18n', 'zh-CN': '高级', 'en-US': 'Advance' },
      items: [
        {
          name: '___condition',
          title: { type: 'i18n', 'zh-CN': '条件显示', 'en-US': 'Condition' },
          setter: 'ExpressionSetter',
        },
        {
          name: '#loop',
          title: { type: 'i18n', 'zh-CN': '循环', 'en-US': 'Loop' },
          items: [
            {
              name: '___loop',
              title: { type: 'i18n', 'zh-CN': '循环数据', 'en-US': 'Loop Data' },
              setter: {
                componentName: 'MixinSetter',
                props: {
                  // TODO:
                  setters: [
                    {
                      componentName: 'JSONSetter',
                      props: {
                        mode: 'popup',
                        placeholder: { type: 'i18n', 'zh-CN': '编辑数据', 'en-US': 'Edit Data' },
                      },
                    },
                    {
                      componentName: 'ExpressionSetter',
                      props: {
                        placeholder: { type: 'i18n', 'zh-CN': '绑定数据', 'en-US': 'Bind Data' },
                      },
                    },
                  ],
                },
              },
            },
            {
              name: '___loopArgs.0',
              title: { type: 'i18n', 'zh-CN': '迭代变量名', 'en-US': 'Loop Item' },
              setter: {
                componentName: 'StringSetter',
                props: {
                  placeholder: { type: 'i18n', 'zh-CN': '默认为: item', 'en-US': 'Defaults: item' },
                }
              },
            },
            {
              name: '___loopArgs.1',
              title: { type: 'i18n', 'zh-CN': '索引变量名', 'en-US': 'Loop Index' },
              setter: {
                componentName: 'StringSetter',
                props: {
                  placeholder: { type: 'i18n', 'zh-CN': '默认为: index', 'en-US': 'Defaults: index' },
                }
              },
            },
            {
              name: 'key',
              title: 'Key',
              setter: 'ExpressionSetter',
            },
          ],
        },
      ],
    });
  }

  return {
    ...metadata,
    configure: {
      ...configure,
      combined,
    },
  };
}
