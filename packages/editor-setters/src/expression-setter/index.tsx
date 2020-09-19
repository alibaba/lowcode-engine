import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Select, Balloon } from '@alife/next';
import * as acorn from 'acorn';

import { isJSExpression, generateI18n } from './locale/utils';
import zhCN from './locale/zh-CN';

import './index.scss';

const { Option, AutoComplete } = Select;
const { Tooltip } = Balloon;
const helpMap = {
  this: '容器上下文对象',
  state: '容器的state',
  props: '容器的props',
  context: '容器的context',
  schema: '页面上下文对象',
  component: '组件上下文对象',
  constants: '应用常量对象',
  utils: '应用工具对象',
  dataSourceMap: '容器数据源Map',
  field: '表单Field对象',
};

export default class ExpressionView extends PureComponent {
  static displayName = 'Expression';

  static propTypes = {
    context: PropTypes.object,
    dataSource: PropTypes.array,
    locale: PropTypes.string,
    messages: PropTypes.object,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    value: PropTypes.string,
  };

  static defaultProps = {
    context: {},
    dataSource: [],
    locale: 'zh-CN',
    messages: zhCN,
    onChange: () => {},
    placeholder: '',
    value: '',
  };

  expression: React.RefObject<unknown>;

  i18n: any;

  t: void;

  $input: any;

  listenerFun: ((event: any) => void) | undefined;

  static getInitValue(val: { value: any; match: (arg0: RegExp) => any; }) {
    if (isJSExpression(val)) {
      if (typeof val === 'object') {
        return val.value;
      } else if (typeof val === 'string') {
        const arr = val.match(/^\{\{(.*?)\}\}$/);
        if (arr) return arr[1];
      }
    }
    return val;
  }

  constructor(props: any) {
    super(props);
    this.expression = React.createRef();
    this.i18n = generateI18n(props.locale, props.messages);
    this.state = {
      value: ExpressionView.getInitValue(props.value),
      dataSource: props.dataSource || [],
    };
  }

  static getDerivedStateFromProps(props: { value: any; }, state: { preValue: any; }) {
    const curValue = ExpressionView.getInitValue(props.value);
    if (curValue !== state.preValue) {
      return {
        preValue: curValue,
        value: curValue,
      };
    }
    return null;
  }

  onChange(value: string, actionType: string) {
    let realInputValue = value;
    const realDataSource = null;
    let nextCursorIndex: number;
    // 更新值
    if (actionType === 'itemClick' || actionType === 'enter') {
      const curValue = this.state.value;
      if (curValue) {
        realInputValue = curValue + realInputValue;
      }
    }
    // 更新数据源
    const newState = {
      value: realInputValue,
    };
    if (realDataSource !== null) newState.dataSource = realDataSource;
    this.setState(newState, () => {
      nextCursorIndex && this.setInputCursorPosition(nextCursorIndex);
    });
    // 默认加上变量表达式
    this.t && clearTimeout(this.t);
    this.t = setTimeout(() => {
      const { onChange } = this.props;
      // realInputValue = realInputValue ? `{{${realInputValue}}}` : undefined;
      onChange && onChange({
        type: 'JSExpression',
        value: realInputValue,
      });
    }, 300);
  }

  /**
   * 获取AutoComplete数据源
   * @param  {String}
   * @return {Array}
   */
  getDataSource(): any[] {
    const { editor } = this.props.field;
    const schema = editor.get('designer').project.getSchema();
    const stateMap = schema.componentsTree[0].state;
    const dataSource = [];

    for (const key in stateMap) {
      dataSource.push(`this.state.${key}`);
    }

    return dataSource;
  }

  /**
   * 获取光标前的对象字符串，语法解析获取对象字符串
   * @param  {String} str 模板字符串
   * @return {String}     光标前的对象字符串
   */
  getCurrentFiled(str: string | any[]) {
    str += 'x'; // .后面加一个x字符，便于acorn解析
    try {
      const astTree = acorn.parse(str);
      const right = astTree.body[0].expression.right || astTree.body[0].expression;
      if (right.type === 'MemberExpression') {
        const { start, end } = right;
        str = str.slice(start, end);
        return { str, start, end };
      }
    } catch (e) {
      return null;
    }
  }

  /**
   * 获取输入的上下文信息
   * @param  {Array}
   * @return {Array}
   */
  getContextKeys(keys: []) {
    const { editor } = this.props.field;
    console.log(editor);
    const limitKeys = ['schema', 'utils', 'constants'];
    if (keys.length === 0) return limitKeys;
    if (!limitKeys.includes(keys[0])) return [];
    let result = [];
    let keyValue = editor;
    let assert = false;
    keys.forEach(item => {
      if (!keyValue[item] || typeof keyValue[item] !== 'object') {
        assert = true;
      }
      if (keyValue[item]) {
        keyValue = keyValue[item];
      }
    });
    if (assert) return [];
    result = Object.keys(keyValue);
    return result;
    // return utilsKeys.concat(constantsKeys).concat(schemaKeys);
  }

  /* 过滤key */
  filterKey(obj: any, name: string) {
    const filterKeys = [
      'reloadDataSource',
      'REACT_HOT_LOADER_RENDERED_GENERATION',
      'refs',
      'updater',
      'appHelper',
      'isReactComponent',
      'forceUpdate',
      'setState',
      'isPureReactComponent',
    ];
    const result = [];
    for (const key in obj) {
      if (key.indexOf('_') !== 0 && filterKeys.indexOf(key) === -1) {
        result.push(`${name}.${key}`);
      }
    }
    return result;
  }

  /**
   * 根据输入项进行筛选
   * @param  {String}
   * @param  {String}
   * @return {Boolen}
   */
  filterOption(inputValue: string, item: { value: string | any[]; }) {
    const cursorIndex = this.getInputCursorPosition();
    const preStr = inputValue.substr(0, cursorIndex);
    const lastKey: string[] = preStr.split('.').slice(-1);
    if (!lastKey) return true;
    if (item.value.indexOf(lastKey) > -1) return true;
    return false;
  }

  // handleClick = () => {
  //   this.props.field.editor.emit('variableBindDialog.open');
  // }

  render() {
    const { value, dataSource } = this.state;
    const { placeholder } = this.props;
    const isValObject = !!(value == '[object Object]');
    const title = isValObject
      ? this.i18n('valueIllegal')
      : (value || placeholder || this.i18n('jsExpression')).toString();
    const cursorIndex = this.getInputCursorPosition();
    const childNode = cursorIndex ? (
      <div className="cursor-blink">
        {title.substr(0, cursorIndex)}
        <b>|</b>
        {title.substr(cursorIndex)}
      </div>
    ) : (
      title
    );

    return (
      <div ref={this.expression} style={{ width: '100%', display: 'inline-block' }}>
        <Tooltip
          triggerType={isValObject ? ['click'] : ['focus']}
          align="tl"
          popupClassName="code-input-overlay"
          trigger={
            isValObject ? (
              value
            ) : (
              <div>
                <AutoComplete
                  {...this.props}
                  style={{ width: '100%' }}
                  dataSource={dataSource}
                  placeholder={placeholder || this.i18n('jsExpression')}
                  value={value}
                  disabled={isValObject}
                  innerBefore={<span style={{ color: '#999', marginLeft: 4 }}>{'{{'}</span>}
                  innerAfter={<span style={{ color: '#999', marginRight: 4 }}>{'}}'}</span>}
                  popupClassName="expression-setter-item-inner"
                  itemRender={({ itemValue }) => {
                    return (
                      <Option key={itemValue} text={itemValue} value={itemValue}>
                        <div className="code-input-value">{itemValue}</div>
                        <div className="code-input-help">{helpMap[itemValue]}</div>
                      </Option>
                    );
                  }}
                  onChange={this.onChange.bind(this)}
                  filter={this.filterOption.bind(this)}
                />
              </div>
            )
          }
        >
          {childNode}
        </Tooltip>
      </div>
    );
  }

  componentDidMount() {
    this.$input = this.findInputElement();
    if (this.$input) {
      this.listenerFun = event => {
        const isMoveKey = !!(event.type == 'keyup' && ~[37, 38, 39, 91].indexOf(event.keyCode));
        const isMouseup = event.type == 'mouseup';
        if (isMoveKey || isMouseup) {
          // eslint-disable-next-line react/no-access-state-in-setstate
          const dataSource = this.getDataSource(this.state.value) || [];
          this.setState({
            dataSource,
          });
        }
      };
      this.$input.addEventListener('keyup', this.listenerFun, false);
      this.$input.addEventListener('mouseup', this.listenerFun, false);
    }
  }

  componentWillUnmount() {
    if (this.listenerFun && this.$input) {
      this.$input.removeEventListener('keyup', this.listenerFun, false);
      this.$input.removeEventListener('mouseup', this.listenerFun, false);
    }
  }

  /**
   * 获取Input输入框DOM节点
   */
  findInputElement() {
    return this.expression.current.children[0].getElementsByTagName('input')[0];
  }

  /**
   * 获取光标位置
   *
   */
  getInputCursorPosition() {
    if (!this.$input) return;
    return this.$input.selectionStart;
  }

  /*
   * 字符串取得对象keys
   */
  getObjectKeys(str: string) {
    let keys: string | any[] = [];
    if (str) keys = str.split('.');
    return keys.slice(0, keys.length - 1);
  }

  /*
   * 设置input组件光标位置在闭合}前
   */
  setInputCursorPosition(idx: number) {
    this.$input.setSelectionRange(idx, idx);
    this.forceUpdate();
  }
}
