import {
  PropConfig,
  PropType,
  Shape,
  OneOf,
  ObjectOf,
  ArrayOf,
  OneOfType,
} from '../../designer/src/designer/prop-config';
import { SetterType, FieldConfig, SettingField } from './main';
import { registerMetadataTransducer } from '../../designer/src/designer/component-meta';

export function propConfigToFieldConfig(propConfig: PropConfig): FieldConfig {
  const { name, description } = propConfig;
  const title = {
    label: description?.slice(0, 10) || name,
    tip: description ? `${name} | ${description}` : undefined,
  };
  return {
    title,
    ...propConfig,
    setter: propTypeToSetter(propConfig.propType),
  };
}

export function propTypeToSetter(propType: PropType): SetterType {
  let typeName: string;
  let isRequired: boolean | undefined = false;
  if (typeof propType === 'string') {
    typeName = propType;
  } else {
    typeName = propType.type;
    isRequired = propType.isRequired;
  }
  // TODO: use mixinSetter wrapper
  switch (typeName) {
    case 'string':
      return {
        componentName: 'StringSetter',
        isRequired,
        initialValue: '',
      };

    case 'number':
      return {
        componentName: 'NumberSetter',
        isRequired,
        initialValue: 0,
      };
    case 'bool':
      return {
        componentName: 'NumberSetter',
        isRequired,
        initialValue: false,
      };
    case 'oneOf':
      const dataSource = ((propType as OneOf).value || []).map((value, index) => {
        const t = typeof value;
        return {
          label: t === 'string' || t === 'number' || t === 'boolean' ? String(value) : `value ${index}`,
          value,
        };
      });
      const componentName = dataSource.length > 4 ? 'SelectSetter' : 'RadioGroupSetter';
      return {
        componentName,
        props: { dataSource },
        isRequired,
        initialValue: dataSource[0] ? dataSource[0].value : null,
      };

    case 'element':
    case 'node':
      return {
        // slotSetter
        componentName: 'NodeSetter',
        props: {
          mode: typeName,
        },
        isRequired,
        initialValue: {
          type: 'JSSlot',
          value: '',
        },
      };
    case 'shape':
    case 'exact':
      const items = (propType as Shape).value.map(item => propConfigToFieldConfig(item));
      return {
        componentName: 'ObjectSetter',
        props: {
          config: {
            items,
            extraSetter: typeName === 'shape' ? propTypeToSetter('any') : null,
          },
        },
        isRequired,
        initialValue: (field: any) => {
          const data: any = {};
          items.forEach(item => {
            let initial = item.defaultValue;
            if (initial == null && item.setter && typeof item.setter === 'object') {
              initial = (item.setter as any).initialValue;
            }
            data[item.name] = initial ? (typeof initial === 'function' ? initial(field) : initial) : null;
          });
          return data;
        },
      };
    case 'object':
    case 'objectOf':
      return {
        componentName: 'ObjectSetter',
        props: {
          config: {
            extraSetter: propTypeToSetter(typeName === 'objectOf' ? (propType as ObjectOf).value : 'any'),
          },
        },
        isRequired,
      };
    case 'array':
    case 'arrayOf':
      return {
        componentName: 'ArraySetter',
        props: {
          itemSetter: propTypeToSetter(typeName === 'arrayOf' ? (propType as ArrayOf).value : 'any'),
        },
        isRequired,
        initialValue: [],
      };
    case 'func':
      return {
        componentName: 'FunctionSetter',
        isRequired,
        initialValue: {
          type: 'JSFunction',
          value: 'function(){}',
        },
      };
    case 'oneOfType':
      return {
        componentName: 'MixinSetter',
        props: {
          // TODO:
          // setters: (propType as OneOfType).value.map(item => propTypeToSetter(item)),
        },
        isRequired,
      };
  }

  return {
    componentName: 'MixinSetter',
    isRequired,
  };
}

const EVENT_RE = /^on[A-Z][\w]*$/;

registerMetadataTransducer(metadata => {
  if (metadata.configure) {
    if (Array.isArray(metadata.configure)) {
      return {
        ...metadata,
        configure: {
          props: metadata.configure,
        },
      };
    }
    if (metadata.configure.props) {
      return metadata as any;
    }
  }

  const { configure = {} } = metadata;

  if (!metadata.props) {
    return {
      ...metadata,
      configure: {
        ...configure,
        props: [],
      },
    };
  }
  const { props = [], component = {}, events = {}, styles = {} } = configure;
  const supportedEvents: any[] | null = (events as any).supportedEvents ? null : [];

  metadata.props.forEach(prop => {
    const { name, propType, description } = prop;
    if (
      name === 'children' &&
      (component.isContainer || propType === 'node' || propType === 'element' || propType === 'any')
    ) {
      if (component.isContainer !== false) {
        component.isContainer = true;
        return;
      }
    }

    if (EVENT_RE.test(name) && (propType === 'func' || propType === 'any')) {
      if (supportedEvents) {
        supportedEvents.push({
          name,
          description,
        });
        (events as any).supportedEvents = supportedEvents;
      }
      return;
    }

    if (name === 'className' && (propType === 'string' || propType === 'any')) {
      if ((styles as any).supportClassName == null) {
        (styles as any).supportClassName = true;
      }
      return;
    }

    if (name === 'style' && (propType === 'object' || propType === 'any')) {
      if ((styles as any).supportInlineStyle == null) {
        (styles as any).supportInlineStyle = true;
      }
      return;
    }

    props.push(propConfigToFieldConfig(prop));
  });

  return {
    ...metadata,
    configure: {
      ...configure,
      props,
      events,
      styles,
      component,
    },
  };
});

registerMetadataTransducer(metadata => {
  const { configure = {}, componentName } = metadata;
  const { component = {} } = configure as any;
  if (!component.nestingRule) {
    let m;
    // uri match xx.Group set subcontrolling: true, childWhiteList
    if ((m = /^(.+)\.Group$/.exec(componentName))) {
      // component.subControlling = true;
      if (!component.nestingRule) {
        component.nestingRule = {
          childWhitelist: [`${m[1]}`],
        };
      }
    }
    // uri match xx.Node set selfControlled: false, parentWhiteList
    else if ((m = /^(.+)\.Node$/.exec(componentName))) {
      // component.selfControlled = false;
      component.nestingRule = {
        parentWhitelist: [`${m[1]}`, componentName],
      };
    }
    // uri match .Item .Node .Option set parentWhiteList
    else if ((m = /^(.+)\.(Item|Node|Option)$/.exec(componentName))) {
      component.nestingRule = {
        parentWhitelist: [`${m[1]}`],
      };
    }
  }
  if (component.isModal == null && /Dialog/.test(componentName)) {
    component.isModal = true;
  }
  return {
    ...metadata,
    configure: {
      ...configure,
      component,
    },
  };
});

registerMetadataTransducer(metadata => {
  const { componentName, configure = {} } = metadata;
  if (componentName === 'Leaf') {
    return {
      ...metadata,
      configure: {
        ...configure,
        combined: [
          {
            name: 'children',
            title: '内容设置',
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
  const supportedLifecycles = events.supportedLifecycles || (isRoot ? [
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
  ] : null);
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
  propsGroup.push({
    name: '#generals',
    title: '通用',
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
  const combined = [
    {
      title: '属性',
      name: '#props',
      items: propsGroup,
    },
  ];
  const stylesGroup = [];
  if (styles?.supportClassName) {
    stylesGroup.push({
      name: 'className',
      title: '类名绑定',
      setter: 'ClassNameSetter',
    });
  }
  if (styles?.supportInlineStyle) {
    stylesGroup.push({
      name: 'style',
      title: '行内样式',
      setter: 'StyleSetter',
    });
  }
  if (stylesGroup.length > 0) {
    combined.push({
      name: '#styles',
      title: '样式',
      items: stylesGroup,
    });
  }

  if (eventsDefinition.length > 0) {
    combined.push({
      name: '#events',
      title: '事件',
      items: [
        {
          name: '!events',
          title: '事件设置',
          setter: {
            componentName: 'EventsSetter',
            props: {
              definition: eventsDefinition,
            },
          },
          getValue(field: SettingField, val?: any[]) {
            // todo:
            return val;
          },

          setValue(field: SettingField, eventDataList: any[]) {
            // todo:
            return;
          },
        },
      ],
    });
  }

  if (isRoot) {
    combined.push({
      name: '#advanced',
      title: '高级',
      items: [],
    });
  } else {
    combined.push({
      name: '#advanced',
      title: '高级',
      items: [
        {
          name: '__condition',
          title: '条件显示',
          setter: 'ExpressionSetter',
        },
        {
          name: '#loop',
          title: '循环',
          items: [
            {
              name: '__loop',
              title: '循环数据',
              setter: {
                componentName: 'MixinSetter',
                props: {
                  // TODO:
                  setters: [
                    {
                      componentName: 'JSONSetter',
                      props: {
                        mode: 'popup',
                        placeholder: '编辑数据',
                      },
                    },
                    {
                      componentName: 'ExpressionSetter',
                      props: {
                        placeholder: '绑定数据',
                      },
                    },
                  ],
                },
              },
            },
            {
              name: '__loopArgs.0',
              title: '迭代变量名',
              setter: {
                componentName: 'StringSetter',
                placeholder: '默认为 item',
              },
            },
            {
              name: '__loopArgs.1',
              title: '索引变量名',
              setter: {
                componentName: 'StringSetter',
                placeholder: '默认为 index',
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
});
