import {
  IPublicTypeFieldConfig,
  IPublicTypePropConfig,
  IPublicTypePropType,
  IPublicTypeSetterType,
  IPublicTypeOneOf,
  IPublicTypeObjectOf,
  IPublicTypeArrayOf,
  IPublicTypeTransformedComponentMetadata,
  IPublicTypeOneOfType,
  ConfigureSupportEvent,
  IPublicModelSettingField,
} from '@alilc/lowcode-types';

function propConfigToFieldConfig(propConfig: IPublicTypePropConfig): IPublicTypeFieldConfig {
  const { name, description } = propConfig;
  const title = {
    label: {
      type: 'i18n',
      'en-US': name,
      'zh-CN': description?.slice(0, 10) || name,
    },
    tip: description ? `${name} | ${description}` : undefined,
  } as any;
  return {
    title,
    ...propConfig,
    // TODO 这边直接用propConfig，将setter丢在propconfig里，需要确认是否在PropConfig扩展还是换实现
    setter: propConfig.setter ? propConfig.setter : propTypeToSetter(propConfig.propType),
  };
}

function propTypeToSetter(propType: IPublicTypePropType): IPublicTypeSetterType {
  let typeName: string;
  let isRequired: boolean | undefined = false;
  if (typeof propType === 'string') {
    typeName = propType;
  } else if (typeof propType === 'object') {
    typeName = propType.type;
    isRequired = propType.isRequired;
  } else {
    typeName = 'string';
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
        componentName: 'BoolSetter',
        isRequired,
        initialValue: false,
      };
    case 'oneOf':
      const dataSource = ((propType as IPublicTypeOneOf).value || []).map((value, index) => {
        const t = typeof value;
        return {
          label:
            t === 'string' || t === 'number' || t === 'boolean' ? String(value) : `value ${index}`,
          value,
        };
      });
      const componentName = dataSource.length >= 4 ? 'SelectSetter' : 'RadioGroupSetter';
      return {
        componentName,
        props: { dataSource, options: dataSource },
        isRequired,
        initialValue: dataSource[0] ? dataSource[0].value : null,
      };

    case 'element':
    case 'node': // TODO: use Mixin
      return {
        // slotSetter
        componentName: 'SlotSetter',
        props: {
          mode: typeName,
        },
        isRequired,
        initialValue: {
          type: 'JSSlot',
          value: [],
        },
      };
    case 'shape':
    case 'exact':
      const items = ((propType as any).value || []).map((item: any) =>
        propConfigToFieldConfig(item),
      );
      return {
        componentName: 'ObjectSetter',
        props: {
          config: {
            items,
            extraSetter: typeName === 'shape' ? propTypeToSetter('any') : null,
          },
        },
        isRequired,
        initialValue: (field: IPublicModelSettingField) => {
          const data: any = {};
          items.forEach((item: any) => {
            let initial = item.defaultValue;
            if (initial == null && item.setter && typeof item.setter === 'object') {
              initial = (item.setter as any).initialValue;
            }
            data[item.name] = initial
              ? typeof initial === 'function'
                ? initial(field)
                : initial
              : null;
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
            extraSetter: propTypeToSetter(
              typeName === 'objectOf' ? (propType as IPublicTypeObjectOf).value : 'any',
            ),
          },
        },
        isRequired,
        initialValue: {},
      };
    case 'array':
    case 'arrayOf':
      return {
        componentName: 'ArraySetter',
        props: {
          itemSetter: propTypeToSetter(
            typeName === 'arrayOf' ? (propType as IPublicTypeArrayOf).value : 'any',
          ),
        },
        isRequired,
        initialValue: [],
      };
    case 'func':
      return {
        componentName: 'FunctionSetter',
        isRequired,
      };
    case 'color':
      return {
        componentName: 'ColorSetter',
        isRequired,
      };
    case 'oneOfType':
      return {
        componentName: 'MixedSetter',
        props: {
          // TODO:
          setters: (propType as IPublicTypeOneOfType).value.map((item) => propTypeToSetter(item)),
        },
        isRequired,
      };
    default:
    // do nothing
  }
  return {
    componentName: 'MixedSetter',
    isRequired,
    props: {},
  };
}

const EVENT_RE = /^on|after|before[A-Z][\w]*$/;

export default function (
  metadata: IPublicTypeTransformedComponentMetadata,
): IPublicTypeTransformedComponentMetadata {
  const { configure = {} } = metadata;
  // TODO types后续补充
  let extendsProps: any = null;
  if (configure.props) {
    if (Array.isArray(configure.props)) {
      return metadata;
    }
    const { isExtends, override = [] } = configure.props;
    // 不开启继承时，直接返回configure配置
    if (!isExtends) {
      return {
        ...metadata,
        configure: {
          ...configure,
          props: [...override],
        },
      };
    }

    extendsProps = {};
    // 开启继承后，缓存重写内容的配置
    override.forEach((prop: any) => {
      extendsProps[prop.name] = prop;
    });
  }

  if (!metadata.props) {
    return {
      ...metadata,
      configure: {
        ...configure,
        props: [],
      },
    };
  }
  const { component = {}, supports = {} } = configure;
  const supportedEvents: ConfigureSupportEvent[] | null = supports.events ? null : [];
  const props: IPublicTypeFieldConfig[] = [];

  metadata.props.forEach((prop) => {
    const { name, propType, description } = prop;
    if (
      name === 'children' &&
      (component.isContainer || propType === 'node' || propType === 'element' || propType === 'any')
    ) {
      if (component.isContainer !== false) {
        component.isContainer = true;
        props.push(propConfigToFieldConfig(prop));
        return;
      }
    }

    if (EVENT_RE.test(name) && (propType === 'func' || propType === 'any')) {
      if (supportedEvents) {
        supportedEvents.push({
          name,
          description,
        });
        supports.events = supportedEvents;
      }
      return;
    }

    if (name === 'className' && (propType === 'string' || propType === 'any')) {
      if (supports.className == null) {
        supports.className = true;
      }
      return;
    }

    if (name === 'style' && (propType === 'object' || propType === 'any')) {
      if (supports.style == null) {
        supports.style = true;
      }
      return;
    }

    // 存在覆盖配置时
    if (extendsProps) {
      if (name in extendsProps) {
        prop = extendsProps[name];
      }
    }

    props.push(propConfigToFieldConfig(prop));
  });

  return {
    ...metadata,
    configure: {
      ...configure,
      props,
      supports,
      component,
    },
  };
}
