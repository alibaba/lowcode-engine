import { TransformedComponentMetadata, FieldConfig, SettingTarget } from '@ali/lowcode-types';
import { IconSlot } from '../icons/slot';

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
  let propsGroup = props || [];
  const basicInfo: any = {};
  if (componentName === 'Slot') {
    basicInfo.icon = IconSlot;
    propsGroup = [{
      name: '___title',
      title: {
        type: 'i18n',
        'en-US': 'Slot Title',
        'zh-CN': '插槽标题'
      },
      setter: 'StringSetter',
      defaultValue: '插槽容器'
    }]
  }
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
      title: { type: 'i18n', 'zh-CN': '高级', 'en-US': 'Advanced' },
      items: [
        {
          name: '___condition',
          title: { type: 'i18n', 'zh-CN': '是否渲染', 'en-US': 'Condition' },
          setter: [{
            componentName: 'BoolSetter',
            props: {
              defaultValue: true,
            }
          }, {
            componentName: 'VariableSetter'
          }],
        },
        {
          name: '#loop',
          title: { type: 'i18n', 'zh-CN': '循环', 'en-US': 'Loop' },
          items: [
            {
              name: '___loop',
              title: { type: 'i18n', 'zh-CN': '循环数据', 'en-US': 'Loop Data' },
              setter: [{
                componentName: 'JsonSetter',
                props: {
                  label: { type: 'i18n', 'zh-CN': '编辑数据', 'en-US': 'Edit Data'},
                },
              }, {
                componentName: 'VariableSetter'
              }],
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
              title: '循环 Key',
              setter: [{
                componentName: 'StringSetter',
              }, {
                componentName: 'VariableSetter'
              }],
            },
          ],
        },
      ],
    });
  }

  return {
    ...metadata,
    ...basicInfo,
    configure: {
      ...configure,
      combined,
    },
  };
}
