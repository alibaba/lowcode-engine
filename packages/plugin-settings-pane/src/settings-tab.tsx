import { Component, isValidElement, ReactNode, ReactElement, ComponentType as ReactComponentType } from 'react';
import { isReactClass } from '../../utils/is-react';
import { createContent } from '../../utils/create-content';
import { SettingField, CustomView, isSettingField, SettingTarget } from './main';
import { Field, FieldGroup } from './field';

const settersMap = new Map<string, ReactElement | ReactComponentType<any>>();
export function registerSetter(type: string, setter: ReactElement | ReactComponentType<any>) {
  settersMap.set(type, setter);
}

export function getSetter(type: string): ReactElement | ReactComponentType<any> | null {
  return settersMap.get(type) || null;
}

export function createSetterContent(setter: any, props: object): ReactNode {
  if (typeof setter === 'string') {
    setter = getSetter(setter);
  }

  return createContent(setter, props);
}

class SettingFieldView extends Component<{ field: SettingField }> {
  state = {
    visible: false,
    value: null,
  };
  private dispose: () => void;
  constructor(props: any) {
    super(props);
    const { field } = this.props;
    const { condition } = field.extraProps;
    let firstRun: boolean = true;
    this.dispose = field.onEffect(() => {
      const state: any = {};
      state.visible = (field.isOne && typeof condition === 'function') ? !condition(field, field.editor) : true;
      if (state.visible) {
        state.value = field.getValue();
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
    if (nextState.value !== this.state.value || nextState.visible !== this.state.visible) {
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    this.dispose();
  }

  render() {
    const { field } = this.props;
    const { setter, title, extraProps } = field;
    const { defaultValue } = extraProps;
    const { visible, value } = this.state;
    // reaction point
    if (!visible) {
      return null;
    }

    let setterType = setter;
    let props: any = {};
    if (typeof setter === 'object' && 'componentName' in setter && !(isValidElement(setter) || isReactClass(setter))) {
      setterType = (setter as any).componentName;
      props = (setter as any).props;
    }
    if (defaultValue != null && !('defaultValue' in props)) {
      props.defaultValue = defaultValue;
    }
    /*
    if (!('placeholder' in props) && !isSameValue) {
      props.placeholder = '多种值';
    }
    */

    // todo: error handling

    return (
      <Field title={title}>
        {createSetterContent(setterType, {
          ...props,
          key: field.id,
          // === injection
          prop: field,
          field,
          // === IO
          value, // reaction point
          onChange: (value: any) => {
            field.setValue(value);
          }
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
      state.visible = (field.isOne && typeof condition === 'function') ? !condition(field, field.editor) : true;
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

export function createSettingFieldView(item: SettingField | CustomView, field: SettingTarget, index: number) {
  if (isSettingField(item)) {
    if (item.isGroup) {
      return <SettingGroupView field={item} key={item.id} />;
    } else {
      return <SettingFieldView field={item} key={item.id} />;
    }
  } else {
    return createContent(item, { key: index, field, editor: field.editor });
  }
}

export default class SettingsTab extends Component<{ target: SettingTarget }> {
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
      <div className="lc-settings-singlepane">
        {items.map((item, index) => createSettingFieldView(item, target, index))}
      </div>
    );
  }
}
