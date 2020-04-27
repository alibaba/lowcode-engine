import { Component } from 'react';
import { intl, shallowIntl, createSetterContent, observer } from '@ali/lowcode-editor-core';
import { createContent } from '@ali/lowcode-utils';
import { Field, createField } from '../field';
import PopupService from '../popup';
import { SettingField, isSettingField, SettingTopEntry, SettingEntry } from '@ali/lowcode-designer';
import { isSetterConfig, CustomView } from '@ali/lowcode-types';

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
    } else if (setter) {
      setterType = setter;
    }
    let value = null;
    if (field.type === 'field') {
      if (defaultValue != null && !('defaultValue' in setterProps)) {
        setterProps.defaultValue = defaultValue;
      }
      if (field.valueState > 0) {
        value = field.getValue();
      } else {
        setterProps.multiValue = true;
        if (!('placeholder' in setterProps)) {
          // FIXME! move to locale file
          setterProps.placeholder = intl({
            type: 'i18n',
            'zh-CN': '多种值',
            'en-US': 'Multiple Value',
          });
        }
      }
    }

    // todo: error handling

    return createField(
      {
        title: field.title,
        collapsed: !field.expanded,
        onExpandChange: (expandState) => field.setExpanded(expandState),
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
