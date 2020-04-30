import { Component, ReactNode } from 'react';
import {
  PopupField,
  Field as NormalField,
  EntryField,
  PlainField,
  createSettingFieldView,
  SettingsPane,
  createField,
} from '@ali/lowcode-editor-skeleton';
import { createSetterContent } from '@ali/lowcode-editor-core';
import { isPlainObject } from '@ali/lowcode-utils';
import { isSetterConfig } from '@ali/lowcode-types';
import context from './context';
import { VE_HOOKS } from './base/const';

export class Placeholder extends Component {
  render() {
    console.info(this.props);
    return 'rending placeholder here';
  }
}

export class SettingField extends Component<{
  prop: any;
  selected?: boolean;
  forceDisplay?: string;
  className?: string;
  children?: ReactNode;
  compact?: boolean;
  key?: string;
  addonProps?: object;
}> {
  constructor(props: any) {
    super(props);

    console.info(props);
  }

  render() {
    const { prop, selected, addonProps } = this.props;
    const display = this.props.forceDisplay || prop.getDisplay();

    if (display === 'none') {
      return null;
    }

    // 标准的属性，即每一个 Field 在 VE 下都拥有的属性
    const standardProps = {
      className: this.props.className,
      compact: this.props.compact,

      isSupportMultiSetter: this.supportMultiSetter(),
      isSupportVariable: prop.isSupportVariable(),
      isUseVariable: prop.isUseVariable(),
      prop,
      setUseVariable: () => prop.setUseVariable(!prop.isUseVariable()),
      tip: prop.getTip(),
      title: prop.getTitle(),
    };

    // 部分 Field 所需要的额外 fieldProps
    const extraProps = {};
    const ctx = context;
    const plugin = ctx.getPlugin(VE_HOOKS.VE_SETTING_FIELD_PROVIDER);
    let Field;
    if (typeof plugin === 'function') {
      Field = plugin(display, FIELD_TYPE_MAP, prop);
    }
    if (!Field) {
      Field = FIELD_TYPE_MAP[display] || PlainField;
    }
    createField()
    this._prepareProps(display, extraProps);

    if (display === 'entry') {
      return <Field {...{ ...standardProps, ...extraProps }} />;
    }

    let setter;
    const props: any = {
      prop,
      selected,
    };
    const fieldProps = { ...standardProps, ...extraProps };

    if (prop.isUseVariable() && !this.variableSetter.isPopup) {
      props.placeholder = '请输入表达式: ${var}';
      props.key = `${prop.getId()}-variable`;
      setter = React.createElement(this.variableSetter, props);
      return <Field {...fieldProps}>{setter}</Field>;
    }

    // for composited prop
    if (prop.getVisibleItems) {
      setter = prop
        .getVisibleItems()
        .map((item: any) => <SettingField {...{ key: item.getId(), prop: item, selected }} />);
      return <Field {...fieldProps}>{setter}</Field>;
    }

    setter = createSetterContent(prop.getSetter(), {
      ...addonProps,
      ...props,
    });

    return <Field {...fieldProps}>{setter}</Field>;
  }

  private supportMultiSetter() {
    const { prop } = this.props;
    const setter = prop && prop.getConfig && prop.getConfig('setter');
    return prop.isSupportVariable() || Array.isArray(setter);
  }

  private _prepareProps(displayType: string, extraProps: IExtraProps): void {
    const { prop } = this.props;
    extraProps.propName = prop.isGroup() ? '组合属性，无属性名称' : prop.getName();
    switch (displayType) {
      case 'title':
        break;
      case 'block':
        assign(extraProps, { isGroup: prop.isGroup() });
        break;
      case 'accordion':
        assign(extraProps, {
          headDIY: true,
          isExpand: prop.isExpand(),
          isGroup: prop.isGroup(),
          onExpandChange: () => prop.onExpandChange(() => this.forceUpdate()),
          toggleExpand: () => {
            prop.toggleExpand();
          },
        });
        break;
      case 'entry':
        assign(extraProps, { stageName: prop.getName() });
        break;
      default:
        break;
    }
  }
}

const Field = {
  SettingField: Placeholder,
  Stage: Placeholder,
  PopupField: Placeholder,
  EntryField: Placeholder,
  AccordionField: Placeholder,
  BlockField: Placeholder,
  InlineField: Placeholder,
};

export default Field;
