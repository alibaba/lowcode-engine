import React, { Component, ComponentClass, ReactNode } from 'react';
import classNames from 'classnames';
import { Dropdown, Menu } from '@alifd/next';
import {
  SetterConfig,
  CustomView,
  DynamicProps,
  DynamicSetter,
  TitleContent,
  isSetterConfig,
  isDynamicSetter,
} from '@ali/lowcode-types';
import {
  getSetter,
  getSettersMap,
  computed,
  obx,
  Title,
  createSetterContent,
  observer,
  shallowIntl,
} from '@ali/lowcode-editor-core';

import { IconConvert } from '../../icons/convert';
import { intlNode } from '../../locale';

import './style.less';
import { SettingField } from '@ali/lowcode-designer';
import { IconVariable } from '../../icons/variable';

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
      config.name = generateName((config.setter as any)?.displayName || (config.setter as any)?.name || 'CustomSetter');
      if (!config.title) {
        config.title = config.name;
      }
    }
    return config;
  });
}

interface VariableSetter extends ComponentClass {
  show(params: object): void;
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

  // set name ,used in setting Transducer
  static displayName = 'MixedSetter';

  @obx.ref private used?: string;

  @computed private getCurrentSetter() {
    const { field } = this.props;
    let firstMatched: SetterItem | undefined;
    let firstDefault: SetterItem | undefined;
    for (const setter of this.setters) {
      if (setter.name === this.used) {
        return setter;
      }
      if (!setter.condition) {
        if (!firstDefault) {
          firstDefault = setter;
        }
        continue;
      }
      if (!firstMatched && setter.condition(field)) {
        firstMatched = setter;
      }
    }
    return firstMatched || firstDefault || this.setters[0];
  }

  // dirty fix vision variable setter logic
  private hasVariableSetter = this.setters.some((item) => item.name === 'VariableSetter');

  private useSetter = (name: string) => {
    const { field } = this.props;
    if (name === 'VariableSetter') {
      const setterComponent = getSetter('VariableSetter')?.component as any;
      if (setterComponent && setterComponent.isPopup) {
        setterComponent.show({ prop: field });
        return;
      }
    }
    if (name === this.used) {
      return;
    }
    const setter = this.setters.find((item) => item.name === name);
    this.used = name;
    if (setter) {
      this.handleInitial(setter);
    }
  };

  private handleInitial({ initialValue }: SetterItem) {
    const { field, onChange } = this.props;
    let newValue: any = initialValue;
    if (newValue && typeof newValue === 'function') {
      newValue = newValue(field);
    }
    onChange && onChange(newValue);
  }

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

  private renderCurrentSetter(currentSetter?: SetterItem, extraProps?: object) {
    const { className, field, setters, onSetterChange, ...restProps } = this.props;
    if (!currentSetter) {
      // TODO: use intl
      if (restProps.value == null) {
        return <span>NullValue</span>;
      } else {
        return <span>InvalidValue</span>;
      }
    }
    const { setter, props } = currentSetter;
    let setterProps: any = {};
    let setterType: any;
    if (isDynamicSetter(setter)) {
      setterType = setter.call(field, field);
    } else {
      setterType = setter;
    }
    if (props) {
      setterProps = props;
      if (typeof setterProps === 'function') {
        setterProps = setterProps(field);
      }
    }

    return createSetterContent(setterType, {
      ...shallowIntl(setterProps),
      field,
      ...restProps,
      ...extraProps,
      onInitial: () => {
        this.handleInitial(currentSetter);
      },
    });
  }

  private contentsFromPolyfill(setterComponent: VariableSetter) {
    const { field } = this.props;

    const n = this.setters.length;

    let setterContent: any;
    let actions: any;
    if (n < 3) {
      const tipContent = field.isUseVariable()
        ? intlNode('Binded: {expr}', { expr: field.getVariableValue() })
        : intlNode('Variable Binding');
      if (n === 1) {
        // =1: 原地展示<当前绑定的值，点击调用 VariableSetter.show>，icon 高亮是否->isUseVaiable，点击 VariableSetter.show
        setterContent = (
          <a
            onClick={() => {
              setterComponent.show({ prop: field });
            }}
          >
            {tipContent}
          </a>
        );
      } else {
        // =2: 另外一个 Setter 原地展示，icon 高亮，点击弹出调用 VariableSetter.show
        // FIXME! use variable placeholder setter
        const otherSetter = this.setters.find((item) => item.name !== 'VariableSetter')!;
        setterContent = this.renderCurrentSetter(otherSetter, {
          value: field.getMockOrValue(),
        });
      }
      actions = (
        <Title
          className={field.isUseVariable() ? 'variable-binded' : ''}
          title={{
            icon: <IconVariable size={24} />,
            tip: tipContent,
          }}
          onClick={() => {
            setterComponent.show({ prop: field });
          }}
        />
      );
    } else {
      // >=3: 原地展示当前 setter<当前绑定的值，点击调用 VariableSetter.show>，icon tip 提示绑定的值，点击展示切换 Setter，点击其它 setter 直接切换，点击 Variable Setter-> VariableSetter.show
      const currentSetter = field.isUseVariable()
        ? this.setters.find((item) => item.name === 'VariableSetter')
        : this.getCurrentSetter();
      if (currentSetter?.name === 'VariableSetter') {
        setterContent = (
          <a
            onClick={() => {
              setterComponent.show({ prop: field });
            }}
          >
            {intlNode('Binded: {expr}', { expr: field.getVariableValue() })}
          </a>
        );
      } else {
        setterContent = this.renderCurrentSetter(currentSetter);
      }
      actions = this.renderSwitchAction(currentSetter);
    }

    return {
      setterContent,
      actions,
    };
  }

  private renderSwitchAction(currentSetter?: SetterItem) {
    const usedName = currentSetter?.name || this.used;
    const triggerNode = (
      <Title
        title={{
          tip: intlNode('Switch Setter'),
          // FIXME: got a beautiful icon
          icon: <IconConvert size={24} />,
        }}
        className="lc-switch-trigger"
      />
    );
    return (
      <Dropdown trigger={triggerNode} triggerType="click" align="tr br">
        <Menu selectMode="single" hasSelectedIcon selectedKeys={usedName} onItemClick={this.useSetter}>
          {this.setters
            .filter((setter) => setter.list || setter.name === usedName)
            .map((setter) => {
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

  render() {
    const { className } = this.props;
    let contents: {
      setterContent: ReactNode,
      actions: ReactNode,
    } | undefined;
    if (this.hasVariableSetter) {
      // polyfill vision variable setter logic
      const setterComponent = getSetter('VariableSetter')?.component as any;
      if (setterComponent && setterComponent.isPopup) {
        contents = this.contentsFromPolyfill(setterComponent);
      }
    }
    if (!contents) {
      const currentSetter = this.getCurrentSetter();
      contents = {
        setterContent: this.renderCurrentSetter(currentSetter),
        actions: this.renderSwitchAction(currentSetter),
      };
    }

    return (
      <div ref={(shell) => { this.shell = shell; }} className={classNames('lc-setter-mixed', className)}>
        {contents.setterContent}
        <div className="lc-setter-actions">{contents.actions}</div>
      </div>
    );
  }
}
