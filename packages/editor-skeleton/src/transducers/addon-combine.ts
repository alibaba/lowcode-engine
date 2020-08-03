import { TransformedComponentMetadata, FieldConfig, SettingTarget } from '@ali/lowcode-types';
import { IconSlot } from '../icons/slot';
import { getConvertedExtraKey } from '@ali/lowcode-designer';

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
              componentName: 'MixedSetter',
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

  const { props, supports = {} } = configure as any;
  const isRoot: boolean = componentName === 'Page' || componentName === 'Component';
  const eventsDefinition: any[] = [];
  const supportedLifecycles =
  supports.lifecycles ||
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
  if (supports.events) {
    eventsDefinition.push({
      type: 'events',
      title: '事件',
      list: (supports.events || []).map((event: any) => (typeof event === 'string' ? { name: event } : event)),
    });
  }
  //  通用设置
  let propsGroup = props || [];
  const basicInfo: any = {};
  if (componentName === 'Slot') {
    basicInfo.icon = IconSlot;
    propsGroup = [{
      name: getConvertedExtraKey('title'),
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
  const stylesGroup: FieldConfig[] = [];
  let advanceGroup: FieldConfig[] = [];
  if (propsGroup) {
    let l = propsGroup.length;
    while (l-- > 0) {
      const item = propsGroup[l];
      // if (item.type === 'group' && (item.title === '高级' || item.title?.label === '高级')) {
      //   advanceGroup = item.items || [];
      //   propsGroup.splice(l, 1);
      // } 
      if (item.name === '__style__' || item.name === 'style' || item.name === 'containerStyle' || item.name === 'pageStyle') {
        propsGroup.splice(l, 1);
        stylesGroup.push(item);
        if (item.extraProps?.defaultCollapsed && item.name !== 'containerStyle') {
          item.extraProps.defaultCollapsed = false;
        }
      }
    }
  }
  const combined: FieldConfig[] = [
    {
      title: { type: 'i18n', 'zh-CN': '属性', 'en-US': 'Props' },
      name: '#props',
      items: propsGroup,
    },
  ];
  if (supports.className) {
    stylesGroup.push({
      name: 'className',
      title: { type: 'i18n', 'zh-CN': '类名绑定', 'en-US': 'ClassName' },
      setter: 'ClassNameSetter',
    });
  }
  if (supports.style) {
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

  if (!isRoot) {
    if (supports.condition !== false) {
      advanceGroup.push({
        name: getConvertedExtraKey('condition'),
        title: { type: 'i18n', 'zh-CN': '是否渲染', 'en-US': 'Condition' },
        defaultValue: true,
        setter: [{
          componentName: 'BoolSetter',
        }, {
          componentName: 'VariableSetter'
        }],
        extraProps: {
          display: 'block',
        },
      });
    }
    if (supports.loop !== false) {
      advanceGroup.push({
        name: '#loop',
        title: { type: 'i18n', 'zh-CN': '循环', 'en-US': 'Loop' },
        items: [
          {
            name: getConvertedExtraKey('loop'),
            title: { type: 'i18n', 'zh-CN': '循环数据', 'en-US': 'Loop Data' },
            defaultValue: [],
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
            name: getConvertedExtraKey('loopArgs.0'),
            title: { type: 'i18n', 'zh-CN': '迭代变量名', 'en-US': 'Loop Item' },
            setter: {
              componentName: 'StringSetter',
              props: {
                placeholder: { type: 'i18n', 'zh-CN': '默认为: item', 'en-US': 'Defaults: item' },
              }
            },
          },
          {
            name: getConvertedExtraKey('loopArgs.1'),
            title: { type: 'i18n', 'zh-CN': '索引变量名', 'en-US': 'Loop Index' },
            setter: {
              componentName: 'StringSetter',
              props: {
                placeholder: { type: 'i18n', 'zh-CN': '默认为: index', 'en-US': 'Defaults: index' },
              }
            },
          },
        ],
        extraProps: {
          display: 'accordion',
        },
      })
    }
    advanceGroup.push({
      name: 'key',
      title: {
        label: '渲染唯一标识（key）',
        tip: '搭配「条件渲染」或「循环渲染」时使用，和 react 组件中的 key 原理相同，点击查看帮助',
        docUrl: 'https://yuque.antfin-inc.com/legao/help3.0/ca5in7',
      },
      setter: [{
        componentName: 'StringSetter',
      }, {
        componentName: 'VariableSetter'
      }],
      extraProps: {
        display: 'block',
      },
    },)
  }
  if (advanceGroup.length > 0) {
    combined.push({
      name: '#advanced',
      title: { type: 'i18n', 'zh-CN': '高级', 'en-US': 'Advance' },
      items: advanceGroup,
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
