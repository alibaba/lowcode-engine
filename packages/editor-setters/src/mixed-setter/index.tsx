import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Dropdown, Button, Menu, Icon } from '@alifd/next';
import { getSetter } from '@ali/lowcode-editor-core';

import { generateI18n } from './locale/utils';
import zhCN from './locale/zh-CN';
import './index.scss';

export default class Mixed extends PureComponent {
  static displayName = 'Mixed';
  static propTypes = {
    locale: PropTypes.string,
    messages: PropTypes.object,
    defaultType: PropTypes.string,
    types: PropTypes.arrayOf(PropTypes.string),
    inputProps: PropTypes.object,
    expressionProps: PropTypes.object,
    monacoEditorProps: PropTypes.object,
    switchProps: PropTypes.object,
    selectProps: PropTypes.object,
    radioGroupProps: PropTypes.object,
  };
  static defaultProps = {
    locale: 'zh-CN',
    messages: zhCN,
    types: [{
      "name": "StringSetter",
      "props": {}
    }],
  };
  typeMap: any;
  i18n: (key: any, values?: {}) => string | void | (string | void)[];
  constructor(props: Readonly<{}>) {
    super(props);
    let type = props.defaultType;// judgeTypeHandler(props, {});
    this.i18n = generateI18n(props.locale, props.messages);
    this.state = {
      preType: type,
      type
    };
  }
  changeType(type: string) {
    if (typeof type === 'object' || type === this.state.type) return;
    let { onChange } = this.props;
    let newValue = undefined;
    const setterProps = this.typeMap[type]['props'];
    if (setterProps) {
      if (setterProps.value !== undefined) {
        newValue = setterProps.value;
      } else if (setterProps.defaultValue !== undefined) {
        newValue = setterProps.defaultValue;
      }
    }
    if (type === 'BoolSetter' && newValue === undefined) {
      newValue = false; //给切换到switch默认值为false
    }
    this.setState({ type });
    onChange && onChange(newValue);
  }
  render() {
    const {
      style = {},
      className,
      locale,
      messages,
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
            MenuItems.push(<Menu.Item key={type}>{this.typeMap[type]['label']}</Menu.Item>);
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
            selectedKeys={this.state.type}
            onItemClick={this.changeType.bind(this)}
          >
            {MenuItems}
          </Menu>
        );

        moreBtnNode = (
          <Dropdown trigger={triggerNode} triggerType="click">
            {MenuNode}
          </Dropdown>
        );
      }
    }
    let TargetNode = this.typeMap[this.state.type]?.component || 'div';
    let targetProps = this.typeMap[this.state.type]?.props || {};
    let tarStyle = { position: 'relative', ...style };
    let classes = classNames(className, 'lowcode-setter-mixed');

    return (
      <div style={tarStyle} className={classes} >
        <TargetNode {...restProps} {...targetProps} />
        {moreBtnNode}
      </div>
    );
  }
}
