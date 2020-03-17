import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Dropdown, Button, Menu, Icon, Input, NumberPicker, Switch, Select, Radio, DatePicker } from '@alifd/next';
import MonacoEditor from '@ali/iceluna-comp-monaco-editor';

import { isJSExpression, generateI18n } from './locale/utils';
import Expression from './expression-setter';
import zhCN from './locale/zh-CN';
import './index.scss';

const { Group: RadioGroup } = Radio;
// const isJSExpression = (obj) => {
//   if(typeof obj === 'object' && obj.type === 'JSExpression') {
//     return true;
//   }
//   return false;
// }

export default class Mixin extends PureComponent {
  static displayName = 'Mixin';
  static propTypes = {
    locale: PropTypes.string,
    messages: PropTypes.object,
    defaultType: PropTypes.string,
    types: PropTypes.arrayOf(PropTypes.string),
    onlyChangeType: PropTypes.bool,
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
    types: ['StringSetter', 'ExpressionSetter', 'NumberSetter', 'BoolSetter', 'SelectSetter', 'RadioGroupSetter'],
  };
  constructor(props) {
    super(props);
    let type = judgeTypeHandler(props, {});
    this.i18n = generateI18n(props.locale, props.messages);
    this.state = {
      preType: type,
      type
    };
  }
  static getDerivedStateFromProps(props, state) {
    if ('value' in props) {
      let curType = judgeTypeHandler(props, state);
      if (curType !== state.preType) {
        return {
          type: curType
        };
      }
    }
    return null;
  }
  changeType(type) {
    if (typeof type === 'object' || type === this.state.type) return;
    let { onlyChangeType, value, onChange } = this.props;
    if (onlyChangeType) {
      this.setState({ type });
      onChange && onChange(value);
    } else {
      let newValue = undefined;
      if (this.typeMap[type]['props']) {
        if (this.typeMap[type]['props']['value'] !== undefined) {
          newValue = this.typeMap[type]['props']['value'];
        } else if (this.typeMap[type]['props']['defaultValue'] !== undefined) {
          newValue = this.typeMap[type]['props']['defaultValue'];
        }
      }
      if (type === 'BoolSetter' && newValue === undefined) {
        newValue = false; //给切换到switch默认值为false
      }
      this.setState({ type });
      onChange && onChange(newValue);
    }
  }
  render() {
    const {
      style = {},
      className,
      locale,
      messages,
      types = [],
      defaultType,
      // inputProps,
      // expressionProps,
      // monacoEditorProps,
      // numberPickerProps,
      // switchProps,
      // selectProps,
      // radioGroupProps,
      ...restProps
    } = this.props;
    this.typeMap = {
      StringSetter: {
        label: this.i18n('input'),
        component: Input,
        // props: inputProps
      },
      ExpressionSetter: {
        label: this.i18n('expression'),
        component: Expression,
        // props: expressionProps
      },
      // MonacoEditor: {
      //   label: this.i18n('monacoEditor'),
      //   component: MonacoEditor,
      //   props: monacoEditorProps
      // },
      NumberSetter: {
        label: this.i18n('numberPicker'),
        component: NumberPicker,
      },
      BoolSetter: {
        label: this.i18n('bool'),
        component: Switch,
      },
      SelectSetter: {
        label: this.i18n('select'),
        component: Select,
      },
      RadioGroupSetter: {
        label: this.i18n('radio'),
        component: RadioGroup,
      },
      TextAreaSetter: {
        label: this.i18n('textarea'),
        component: Input.TextArea,
      },
      DateSetter: {
        label: this.i18n('date'),
        component: DatePicker,
      },
      DateYearSetter: {
        label: this.i18n('dateYear'),
        component: DatePicker,
      },
      DateMonthSetter: {
        label: this.i18n('dateMonth'),
        component: DatePicker,
      },
      DateRangeSetter: {
        label: this.i18n('dateRange'),
        component: DatePicker,
      }
    };
    let realTypes = [];
    types.forEach( el => {
      const { name, props } = el;
      if (this.typeMap[name]) {
        this.typeMap[name].props = props;
        realTypes.push(name);
      }
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
        let MenuItems = [];
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
    let TargetNode = this.typeMap[this.state.type] ? this.typeMap[this.state.type]['component'] : 'div';
    let targetProps = this.typeMap[this.state.type] ? this.typeMap[this.state.type]['props'] : {};

    // 特殊处理Switch的值
    if (['BoolSetter', 'RadioGroupSetter'].includes(this.state.type)) {
      restProps.checked = this.props.checked !== undefined ? this.props.checked : this.props.value;
    }
    //判断如果Mixin内部有设置onChange, 则同时触发2处onChange
    if (targetProps && targetProps.onChange && typeof targetProps.onChange === 'function') {
      let tarOnChange = targetProps.onChange;
      targetProps.onChange = function() {
        tarOnChange.apply(null, arguments);
        restProps.onChange && restProps.onChange.apply(null, arguments);
      };
    }
    let tarStyle = { position: 'relative', ...style };
    let classes = classNames(className, 'lowcode-setter-mixin');
    return (
      <div style={tarStyle} className={classes}>
        <TargetNode {...restProps} {...targetProps} />
        {moreBtnNode}
      </div>
    );
  }
}

// 判断值类型
function judgeTypeHandler(props, state) {
  let { defaultType, types, value } = props;
  let selectProps: { dataSource: any[]; };
  let radioGroupProps: { dataSource: any[]; };
  let typeKeys: any[] = [];
  types.forEach( el => {
    typeKeys.push(el.name);
  })

  types.forEach((el: { name: string; props: {}; }) => {
    if (el.name === 'SelectSetter') {selectProps === el.props;}
    if (el.name === 'RadioGroupSetter') {radioGroupProps === el.props;}
  })
  if (!defaultType || !typeKeys) return;
  // 如果defaultType不在typeKeys列表中，默认返回typeKeys的第一项
  if (!typeKeys.includes(defaultType)) return typeKeys[0];
  if (isJSExpression(value)) return 'ExpressionSetter';
  if (value && typeof value === 'string') {
    if (~typeKeys.indexOf('SelectSetter') && selectProps && selectProps.dataSource) {
      let hasOption = selectProps.dataSource.some(item => {
        if (typeof item === 'string' && item === value) return true;
        if (typeof item === 'object' && item.value === value) return true;
      });
      if (hasOption) return 'SelectSetter';
    }
    if (~typeKeys.indexOf('RadioGroupSetter') && radioGroupProps && radioGroupProps.dataSource) {
      let hasOption = radioGroupProps.dataSource.some(item => {
        if (typeof item === 'object' && item.value === value) return true;
      });
      if (hasOption) return 'RadioGroupSetter';
    }
    if (~typeKeys.indexOf('StringSetter')) return 'StringSetter';
  }
  if (typeof value === 'number') {
    if (~typeKeys.indexOf('SelectSetter') && selectProps && selectProps.dataSource) {
      let hasOption = selectProps.dataSource.some(item => {
        if (typeof item === 'object' && item.value === value) return true;
      });
      if (hasOption) return 'Select';
    }
    if (~typeKeys.indexOf('RadioGroupSetter') && radioGroupProps && radioGroupProps.dataSource) {
      let hasOption = radioGroupProps.dataSource.some(item => {
        if (typeof item === 'object' && item.value === value) return true;
      });
      if (hasOption) return 'RadioGroupSetter';
    }
    if (~typeKeys.indexOf('NumberSetter')) return 'NumberSetter';
  }
  if (~typeKeys.indexOf('NumberSetter') && typeof value === 'number') return 'NumberSetter';
  if (~typeKeys.indexOf('BoolSetter') && (value === false || value === true)) return 'BoolSetter';
  if (Array.isArray(value)) {
    if (~typeKeys.indexOf('SelectSetter') && typeof value[0] === 'string') return 'SelectSetter';
  }
  return state.type || defaultType;
}
