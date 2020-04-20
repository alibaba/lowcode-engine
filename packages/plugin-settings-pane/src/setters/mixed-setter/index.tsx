import React, { PureComponent, Component } from 'react';
import classNames from 'classnames';
import { Dropdown, Button, Menu, Icon } from '@alifd/next';
import { getSetter, getSettersMap, SetterConfig, computed, obx, CustomView, DynamicProps, DynamicSetter, TitleContent, isSetterConfig, Title, createSetterContent } from '@ali/lowcode-globals';
import { SettingField } from 'plugin-settings-pane/src/settings/main';

import './index.scss';

export interface SetterItem {
  name: string;
  title: TitleContent;
  setter: string | DynamicSetter | CustomView;
  props?: object | DynamicProps;
  condition?: (field: SettingField) => boolean;
  initialValue?: (field: SettingField) => any;
}

function nomalizeSetters(setters?: Array<string | SetterConfig | CustomView | DynamicSetter>): SetterItem[] {
  if (!setters) {
    const normalized: SetterItem[] = [];
    getSettersMap().forEach((setter, name) => {
      if (name === 'MixedSetter') {
        return;
      }
      normalized.push({
        name,
        title: setter.title || name,
        setter: name,
        condition: setter.condition,
        initialValue: setter.initialValue,
      });
    });
    return normalized;
  }
  const names: string[] = [];
  function generateName(n: string) {
    let idx = 1;
    let got = n;
    while (names.indexOf(got) > -1) {
      got = `${n}:${idx++}`;
    }
    names.push(got);
    return got;
  }
  return setters.map(setter => {
    const config: any = {
      setter,
    };
    if (isSetterConfig(setter)) {
      config.setter = setter.componentName;
      config.props = setter.props;
      config.condition = setter.condition;
      config.initialValue = setter.initialValue;
      config.title = setter.title;
    }
    if (typeof config.setter === 'string') {
      config.name = config.setter;
      names.push(config.name);
      const info = getSetter(config.setter);
      if (!config.title) {
        config.title = info?.title || config.setter;
      }
      if (!config.condition) {
        config.condition = info?.condition;
      }
      if (!config.initialValue) {
        config.initialValue = info?.initialValue;
      }
    } else {
      config.name = generateName((config.setter as any).displayName || (config.setter as any).name || 'CustomSetter');
      if (!config.title) {
        config.title = config.name;
      }
    }
    return config;
  });
}

export default class MixedSetter extends Component<{
  field: SettingField;
  setters?: Array<string | SetterConfig | CustomView | DynamicSetter>;
  onSetterChange?: (field: SettingField, name: string) => void;
}> {
  private setters = nomalizeSetters(this.props.setters);
  @obx.ref private used?: string;
  @computed private getCurrentSetter() {
    const { field } = this.props;
    if (this.used != null) {
      const selected = this.used;
      if (selected.condition) {
        if (selected.condition(field)) {
          return selected;
        }
      } else {
        return selected;
      }
    }
    return this.setters.find(item => {
      if (!item.condition) {
        return true;
      }
      return item.condition(field);
    });
  }

  private checkIsBlockField() {
    if (this.shell) {
      const setter = this.shell.lastElementChild!.firstElementChild;
      if (setter && setter.classList.contains('lc-block-setter')) {
        this.shell.classList.add('lc-block-setter');
      } else {
        this.shell.classList.remove('lc-block-field');
      }
    }
  }
  componentDidUpdate() {
    this.checkIsBlockField();
  }
  componentDidMount() {
    this.checkIsBlockField();
  }

  private useSetter: (id: string) => {
    const { field, onChange } = this.props;
    const newValue = setter.initialValue?.(field);
    this.used = setter;
    onChange && onChange(newValue);
  }
  render() {
    const {
      style = {},
      className,
      types = [],
      defaultType,
      ...restProps
    } = this.props;
    this.typeMap = {};
    let realTypes: any[] = [];
    types.forEach( (el: { name: any; props: any; }) => {
      const { name, props } = el;
      const Setter = getSetter(name);
      if (Setter) {
        this.typeMap[name] = {
          label: name,
          component: Setter.component,
          props,
        }
      }
      realTypes.push(name);
    })
    let moreBtnNode = null;
    //如果只有2种，且有变量表达式，则直接展示变量按钮
    if (realTypes.length > 1) {
      let isTwoType = !!(realTypes.length === 2 && ~realTypes.indexOf('ExpressionSetter'));
      let btnProps = {
        size: 'small',
        text: true,
        style: {
          position: 'absolute',
          left: '100%',
          top: 0,
          bottom: 0,
          margin: 'auto 0 auto 8px',
          padding: 0,
          width: 16,
          height: 16,
          lineHeight: '16px',
          textAlign: 'center'
        }
      };
      if (isTwoType) {
        btnProps.onClick = this.changeType.bind(this, realTypes.indexOf(this.state.type) ? realTypes[0] : realTypes[1]);
      }
      // 未匹配的 null 值，显示 NullValue 空值
      // 未匹配的 其它 值，显示 InvalidValue 非法值
      let triggerNode = (
        <Button {...btnProps} size={isTwoType ? 'large' : 'small'}>
          <Icon type={isTwoType ? 'edit' : 'ellipsis'} />
        </Button>
      );
      if (isTwoType) {
        moreBtnNode = triggerNode;
      } else {
        let MenuItems: {} | null | undefined = [];
        realTypes.map(type => {
          if (this.typeMap[type]) {
            MenuItems.push(<Menu.Item key={type}></Menu.Item>);
          } else {
            console.error(
              this.i18n('typeError', {
                type
              })
            );
          }
        });
        let MenuNode = (
          <Menu
            selectMode="single"
            hasSelectedIcon={false}
            selectedKeys={this.used}
            onItemClick={this.useSetter}
          >
            {this.setters.map((setter) => {
              return <Menu.Item key={setter.name}>
                <Title title={setter.title} />
              </Menu.Item>
            })}
          </Menu>
        );

        moreBtnNode = (
          <Dropdown trigger={triggerNode} triggerType="click">
            <Menu
              selectMode="single"
              hasSelectedIcon={false}
              selectedKeys={this.used}
              onItemClick={this.useSetter}
            >
              {this.setters.map((setter) => {
                return <Menu.Item key={setter.name}>
                  <Title title={setter.title} />
                </Menu.Item>
              })}
            </Menu>
          </Dropdown>
        );
      }
    }
    let TargetNode = this.typeMap[this.state.type]?.component || 'div';
    let targetProps = this.typeMap[this.state.type]?.props || {};
    let tarStyle = { position: 'relative', ...style };
    let classes = classNames(className, 'lowcode-setter-mixin');

    return (
      <div style={tarStyle} className={classes} >
        {createSetterContent()}
        {moreBtnNode}
      </div>
    );
  }
}
