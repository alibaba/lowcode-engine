import { Component, ReactNode } from 'react';
import { createContent } from '../../utils/create-content';
import { shallowEqual } from '../../utils/shallow-equal';
import {
  SettingField,
  CustomView,
  isSettingField,
  SettingTarget,
  SetterConfig,
  isCustomView,
  DynamicProps,
} from './main';
import { Field, FieldGroup } from './field';
import { TitleContent } from './title';
import { Balloon } from '@alifd/next';
import PopupService from './popup';

export type RegisteredSetter = {
  component: CustomView;
  defaultProps?: object;
  title?: TitleContent;
};

const settersMap = new Map<string, RegisteredSetter>();
export function registerSetter(type: string, setter: CustomView | RegisteredSetter) {
  if (isCustomView(setter)) {
    setter = {
      component: setter,
      title: (setter as any).displayName || (setter as any).name || 'CustomSetter'
    };
  }
  settersMap.set(type, setter);
}

export function getSetter(type: string): RegisteredSetter | null {
  return settersMap.get(type) || null;
}

export function createSetterContent(setter: any, props: object): ReactNode {
  if (typeof setter === 'string') {
    setter = getSetter(setter);
    if (!setter) {
      return null;
    }
    if (setter.defaultProps) {
      props = {
        ...setter.defaultProps,
        ...props,
      };
    }
    setter = setter.component;
  }

  return createContent(setter, props);
}

function isSetterConfig(obj: any): obj is SetterConfig {
  return obj && typeof obj === 'object' && 'componentName' in obj && !isCustomView(obj);
}

class SettingFieldView extends Component<{ field: SettingField }> {
  state = {
    visible: false,
    value: null,
    setterProps: {},
  };
  private dispose: () => void;
  private setterType?: string | CustomView;
  constructor(props: any) {
    super(props);
    const { field } = this.props;
    const { setter } = field;
    let setterProps: object | DynamicProps = {};
    if (isSetterConfig(setter)) {
      this.setterType = setter.componentName;
      if (setter.props) {
        setterProps = setter.props;
      }
    } else if (setter) {
      this.setterType = setter;
    }
    let firstRun: boolean = true;
    this.dispose = field.onEffect(() => {
      const state: any = {};
      const { extraProps } = field;
      const { condition, defaultValue } = extraProps;
      state.visible = field.isOne && typeof condition === 'function' ? !condition(field) : true;
      if (state.visible) {
        state.setterProps = {
          ...(typeof setterProps === 'function' ? setterProps(field) : setterProps),
        };
        if (field.type === 'field') {
          if (defaultValue != null && !('defaultValue' in state.setterProps)) {
            state.setterProps.defaultValue = defaultValue;
          }
          if (field.valueState > 0) {
            state.value = field.getValue();
          } else {
            state.value = null;
            state.setterProps.multiValue = true;
            if (!('placeholder' in props)) {
              state.setterProps.placeholder = '多种值';
            }
          }
          // TODO: error handling
        }
      }
      if (firstRun) {
        firstRun = false;
        this.state = state;
      } else {
        this.setState(state);
      }
    });
  }

  shouldComponentUpdate(_: any, nextState: any) {
    const { state } = this;
    if (
      nextState.value !== state.value ||
      nextState.visible !== state.visible ||
      !shallowEqual(state.setterProps, nextState.setterProps)
    ) {
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    this.dispose();
  }

  render() {
    const { visible, value, setterProps } = this.state;
    if (!visible) {
      return null;
    }
    const { field } = this.props;
    const { title, extraProps } = field;

    // todo: error handling

    return (
      <Field title={extraProps.forceInline ? null : title}>
        {createSetterContent(this.setterType, {
          ...setterProps,
          forceInline: extraProps.forceInline,
          key: field.id,
          // === injection
          prop: field, // for compatible
          field,
          // === IO
          value, // reaction point
          onChange: (value: any) => {
            this.setState({
              value,
            });
            field.setValue(value);
          },
        })}
      </Field>
    );
  }
}

class SettingGroupView extends Component<{ field: SettingField }> {
  state = {
    visible: false,
    items: [],
  };
  private dispose: () => void;
  constructor(props: any) {
    super(props);
    const { field } = this.props;
    const { condition } = field.extraProps;
    let firstRun: boolean = true;
    this.dispose = field.onEffect(() => {
      const state: any = {};
      state.visible = field.isOne && typeof condition === 'function' ? !condition(field) : true;
      if (state.visible) {
        state.items = field.items.slice();
      }
      if (firstRun) {
        firstRun = false;
        this.state = state;
      } else {
        this.setState(state);
      }
    });
  }

  shouldComponentUpdate(_: any, nextState: any) {
    // todo: shallowEqual ?
    if (nextState.items !== this.state.items || nextState.visible !== this.state.visible) {
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    this.dispose();
  }

  render() {
    const { field } = this.props;
    const { title, extraProps } = field;
    const { defaultCollapsed } = extraProps;
    const { visible, items } = this.state;
    // reaction point
    if (!visible) {
      return null;
    }

    return (
      <FieldGroup title={title} defaultCollapsed={defaultCollapsed}>
        {items.map((item, index) => createSettingFieldView(item, field, index))}
      </FieldGroup>
    );
  }
}

export function createSettingFieldView(item: SettingField | CustomView, field: SettingTarget, index?: number) {
  if (isSettingField(item)) {
    if (item.isGroup) {
      return <SettingGroupView field={item} key={item.id} />;
    } else {
      return <SettingFieldView field={item} key={item.id} />;
    }
  } else {
    return createContent(item, { key: index, field });
  }
}

export default class SettingsPane extends Component<{ target: SettingTarget }> {
  state: { items: Array<SettingField | CustomView> } = {
    items: [],
  };
  private dispose: () => void;
  constructor(props: any) {
    super(props);

    const { target } = this.props;
    let firstRun: boolean = true;
    this.dispose = target.onEffect(() => {
      const state = {
        items: target.items.slice(),
      };
      if (firstRun) {
        firstRun = false;
        this.state = state;
      } else {
        this.setState(state);
      }
    });
  }

  shouldComponentUpdate(_: any, nextState: any) {
    if (nextState.items !== this.state.items) {
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    this.dispose();
  }

  render() {
    const { items } = this.state;
    const { target } = this.props;
    return (
      <div className="lc-settings-pane">
        {/* todo: add head for single use */}
        <PopupService>
          <div className="lc-settings-content">
            {items.map((item, index) => createSettingFieldView(item, target, index))}
          </div>
        </PopupService>
      </div>
    );
  }
}
