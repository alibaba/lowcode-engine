import React, { Component, isValidElement } from 'react';
import classNames from 'classnames';
import { Dropdown, Button, Menu } from '@alifd/next';
import {
  getSetter,
  getSettersMap,
  SetterConfig,
  computed,
  obx,
  CustomView,
  DynamicProps,
  DynamicSetter,
  TitleContent,
  isSetterConfig,
  Title,
  createSetterContent,
  observer,
  isDynamicSetter,
  shallowIntl,
  EmbedTip,
  isI18nData,
} from '@ali/lowcode-globals';
import { SettingField } from '../../settings/setting-field';
import { IconConvert } from '../../icons/convert';

import './style.less';

export interface SetterItem {
  name: string;
  title: TitleContent;
  setter: string | DynamicSetter | CustomView;
  props?: object | DynamicProps;
  condition?: (field: SettingField) => boolean;
  initialValue?: any | ((field: SettingField) => any);
  list: boolean;
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
        list: setter.recommend || false,
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
  return setters.map((setter) => {
    const config: any = {
      setter,
      list: true,
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

@observer
export default class MixedSetter extends Component<{
  field: SettingField;
  setters?: Array<string | SetterConfig | CustomView | DynamicSetter>;
  onSetterChange?: (field: SettingField, name: string) => void;
  onChange?: (val: any) => void;
  value?: any;
  className?: string;
}> {
  private setters = nomalizeSetters(this.props.setters);
  @obx.ref private used?: string;
  @computed private getCurrentSetter() {
    const { field } = this.props;
    let firstMatched: SetterItem | undefined;
    for (const setter of this.setters) {
      const matched = !setter.condition || setter.condition(field);
      if (matched) {
        if (setter.name === this.used) {
          return setter;
        }
        if (!firstMatched) {
          firstMatched = setter;
        }
      }
    }
    return firstMatched;
  }

  private useSetter = (name: string) => {
    if (name === this.used) {
      return;
    }
    const { field, onChange } = this.props;
    const setter = this.setters.find((item) => item.name === name);
    this.used = name;
    if (setter) {
      let newValue: any = setter.initialValue;
      if (newValue && typeof newValue === 'function') {
        newValue = newValue(field);
      }
      onChange && onChange(newValue);
    }
  };

  private shell: HTMLDivElement | null = null;
  private checkIsBlockField() {
    if (this.shell) {
      const setter = this.shell.firstElementChild;
      if (setter && setter.classList.contains('lc-block-setter')) {
        this.shell.classList.add('lc-block-setter');
      } else {
        this.shell.classList.remove('lc-block-setter');
      }
    }
  }
  componentDidUpdate() {
    this.checkIsBlockField();
  }
  componentDidMount() {
    this.checkIsBlockField();
  }

  render() {
    const { className, field, setters, onSetterChange, ...restProps } = this.props;

    const currentSetter = this.getCurrentSetter();
    const isTwoType = this.setters.length < 3;

    let setterContent: any;
    const triggerTitle: any = {
      tip: {
        type: 'i18n',
        'zh-CN': '切换格式',
        'en-US': 'Switch Format',
      },
      icon: <IconConvert size={24} />,
    };
    if (currentSetter) {
      const { setter, title, props } = currentSetter;
      let setterProps: any = {};
      let setterType: any;
      if (isDynamicSetter(setter)) {
        setterType = setter(field);
      } else {
        setterType = setter;
      }
      if (props) {
        setterProps = props;
        if (typeof setterProps === 'function') {
          setterProps = setterProps(field);
        }
      }

      setterContent = createSetterContent(setterType, {
        ...shallowIntl(setterProps),
        field,
        ...restProps,
      });
      if (title) {
        if (typeof title !== 'object' || isI18nData(title) || isValidElement(title)) {
          triggerTitle.tip = title;
        } else {
          triggerTitle.tip = title.tip || title.label;
        }
      }
    } else {
      // 未匹配的 null 值，显示 NullValue 空值
      // 未匹配的 其它 值，显示 InvalidValue 非法值
      if (restProps.value == null) {
        setterContent = <span>NullValue</span>;
      } else {
        setterContent = <span>InvalidValue</span>;
      }
    }
    const usedName = currentSetter?.name || this.used;
    let moreBtnNode = (
      <Title
        title={triggerTitle}
        onClick={
          isTwoType
            ? () => {
                if (this.setters[0]?.name === usedName) {
                  this.useSetter(this.setters[1]?.name);
                } else {
                  this.useSetter(this.setters[0]?.name);
                }
              }
            : undefined
        }
      />
    );
    if (!isTwoType) {
      moreBtnNode = (
        <Dropdown trigger={moreBtnNode} triggerType="click" align="tr br">
          <Menu selectMode="single" hasSelectedIcon={true} selectedKeys={usedName} onItemClick={this.useSetter}>
            {this.setters.filter(setter => setter.list || setter.name === usedName).map((setter) => {
              return (
                <Menu.Item key={setter.name}>
                  <Title title={setter.title} />
                </Menu.Item>
              );
            })}
          </Menu>
        </Dropdown>
      );
    }

    return (
      <div ref={(shell) => (this.shell = shell)} className={classNames('lc-setter-mixed', className)}>
        {setterContent}

        <div className="lc-setter-actions">{moreBtnNode}</div>
      </div>
    );
  }
}
