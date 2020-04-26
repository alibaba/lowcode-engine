import {
  FieldConfig,
  PropConfig,
  PropType,
  SetterType,
  OneOf,
  Shape,
  ObjectOf,
  ArrayOf,
  TransformedComponentMetadata,
} from '@ali/lowcode-types';

function propConfigToFieldConfig(propConfig: PropConfig): FieldConfig {
  const { name, description } = propConfig;
  const title = {
    label: {
      type: 'i18n',
      'en-US': name,
      'zh-CN': description?.slice(0, 10) || name,
    },
    tip: description ? `${name} | ${description}` : undefined,
  };
  return {
    title,
    ...propConfig,
    setter: propTypeToSetter(propConfig.propType),
  };
}

function propTypeToSetter(propType: PropType): SetterType {
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
    case 'node': // TODO: use Mixin
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
      const items = (propType as Shape).value.map((item) => propConfigToFieldConfig(item));
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
          items.forEach((item) => {
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

export default function(metadata: TransformedComponentMetadata): TransformedComponentMetadata {
  const { configure } = metadata;
  if (configure.props) {
    return metadata;
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
  const { component = {}, events = {}, styles = {} } = configure;
  const supportedEvents: any[] | null = (events as any).supportedEvents ? null : [];
  const props: FieldConfig[] = [];

  metadata.props.forEach((prop) => {
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
}
