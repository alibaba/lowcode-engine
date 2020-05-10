import { Component } from 'react';
import { shallowIntl, createSetterContent, observer } from '@ali/lowcode-editor-core';
import { createContent } from '@ali/lowcode-utils';
import { Field, createField } from '../field';
import PopupService from '../popup';
import { SettingField, isSettingField, SettingTopEntry, SettingEntry } from '@ali/lowcode-designer';
import { isSetterConfig, CustomView } from '@ali/lowcode-types';
import { intl } from '../../locale';

@observer
class SettingFieldView extends Component<{ field: SettingField }> {
  render() {
    const { field } = this.props;
    const { extraProps } = field;
    const { condition, defaultValue } = extraProps;
    const visible = field.isSingle && typeof condition === 'function' ? condition(field) !== false : true;
    if (!visible) {
      return null;
    }
    const { setter } = field;

    let setterProps: any = {};
    let setterType: any;
    let initialValue: any = null;
    if (Array.isArray(setter)) {
      setterType = 'MixedSetter';
      setterProps = {
        setters: setter,
      };
    } else if (isSetterConfig(setter)) {
      setterType = setter.componentName;
      if (setter.props) {
        setterProps = setter.props;
        if (typeof setterProps === 'function') {
          setterProps = setterProps(field);
        }
      }
      if (setter.initialValue != null) {
        initialValue = setter.initialValue;
      }
    } else if (setter) {
      setterType = setter;
    }
    let value = null;
    if (defaultValue != null && !('defaultValue' in setterProps)) {
      setterProps.defaultValue = defaultValue;
      if (initialValue == null) {
        initialValue = defaultValue;
      }
    }
    if (field.valueState === -1) {
      setterProps.multiValue = true;
      if (!('placeholder' in setterProps)) {
        setterProps.placeholder = intl('Multiple Value');
      }
    } else {
      value = field.getValue();
    }

    // todo: error handling

    return createField(
      {
        title: field.title,
        collapsed: !field.expanded,
        valueState: field.isRequired ? 10 : field.valueState,
        onExpandChange: (expandState) => field.setExpanded(expandState),
        onClear: () => field.clearValue(),
      },
      createSetterContent(setterType, {
        ...shallowIntl(setterProps),
        forceInline: extraProps.forceInline,
        key: field.id,
        // === injection
        prop: field, // for compatible vision
        field,
        // === IO
        value, // reaction point
        onChange: (value: any) => {
          this.setState({
            value,
          });
          field.setValue(value);
        },
        onInitial: () => {
          if (initialValue == null) {
            return;
          }
          const value = typeof initialValue === 'function' ? initialValue(field) : initialValue;
          this.setState({
            value,
          });
          field.setValue(value);
        }
      }),
      extraProps.forceInline ? 'plain' : extraProps.display,
    );
  }
}

@observer
class SettingGroupView extends Component<{ field: SettingField }> {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { field } = this.props;
    const { extraProps } = field;
    const { condition } = extraProps;
    const visible = field.isSingle && typeof condition === 'function' ? condition(field) !== false : true;

    if (!visible) {
      return null;
    }

    // todo: split collapsed state | field.items for optimize
    return (
      <Field
        defaultDisplay="accordion"
        title={field.title}
        collapsed={!field.expanded}
        onExpandChange={(expandState) => {
          field.setExpanded(expandState);
        }}
      >
        {field.items.map((item, index) => createSettingFieldView(item, field, index))}
      </Field>
    );
  }
}

export function createSettingFieldView(item: SettingField | CustomView, field: SettingEntry, index?: number) {
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

@observer
export class SettingsPane extends Component<{ target: SettingTopEntry | SettingField }> {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { target } = this.props;
    const items = target.items;
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
