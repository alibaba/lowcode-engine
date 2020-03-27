import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Select, Balloon } from '@alife/next';
import * as acorn from 'acorn';

import { isJSExpression, generateI18n } from './locale/utils';
import zhCN from './locale/zh-CN';

const { Option, AutoComplete } = Select;
const { Tooltip } = Balloon;
const helpMap = {
  this: '容器上下文对象',
  'this.state': '容器的state',
  'this.props': '容器的props',
  'this.context': '容器的context',
  'this.page': '页面上下文对象',
  'this.component': '组件上下文对象',
  'this.constants': '应用常量对象',
  'this.utils': '应用工具对象',
  'this.dataSourceMap': '容器数据源Map',
  'this.field': '表单Field对象',
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
  listenerFun: (event: any) => void;

  static getInitValue(val: { value: any; match: (arg0: RegExp) => any }) {
    if (isJSExpression(val)) {
      if (typeof val === 'object') {
        return val.value;
      } else if (typeof val === 'string') {
        let arr = val.match(/^\{\{(.*?)\}\}$/);
        if (arr) return arr[1];
      }
    }
    return val;
  }
  constructor(props: Readonly<{}>) {
    super(props);
    this.expression = React.createRef();
    this.i18n = generateI18n(props.locale, props.messages);
    this.state = {
      value: ExpressionView.getInitValue(props.value),
      context: props.context || {},
      dataSource: props.dataSource || [],
    };
  }
  static getDerivedStateFromProps(props: { value: any }, state: { preValue: any }) {
    let curValue = ExpressionView.getInitValue(props.value);
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
    let realDataSource = null;
    const cursorIndex = this.getInputCursorPosition();
    let nextCursorIndex: number;
    //更新值
    if (actionType === 'itemClick' || actionType === 'enter') {
      let curValue = this.state.value;
      if (curValue) {
        //如果是非.结束，则替换当前这个变量；
        let preStr = curValue.substr(0, cursorIndex);
        let nextStr = curValue.substr(cursorIndex);
        let preArr = preStr.split('.');
        let preArrLen = preArr.length;
        let tarPreStr = '';
        if (!preArr[preArrLen - 1]) {
          //如果是.结束，则增加到.后面
          if (preArr[preArrLen - 2] === 'this') {
            preArr = preArr.slice(0, preArrLen - 2);
            preArr.push(value);
            tarPreStr = preArr.join('.');
          } else {
            tarPreStr = preStr + value;
          }
        } else {
          if (preArr[preArrLen - 2] === 'this') {
            preArr = preArr.slice(0, preArrLen - 2);
          } else {
            preArr = preArr.slice(0, preArrLen - 1);
          }
          preArr.push(value);
          tarPreStr = preArr.join('.');
        }
        realInputValue = tarPreStr + nextStr;
        realDataSource = this.getDataSource(tarPreStr + '.') || [];
        nextCursorIndex = tarPreStr.length;
      }
    } else {
      let tarPreStr = value.substr(0, cursorIndex);
      if (tarPreStr) {
        let lastChar = tarPreStr.charAt(tarPreStr.length - 1);
        if (lastChar === '.') {
          realDataSource = this.getDataSource(tarPreStr) || [];
        } else {
          realDataSource = this.getDataSource(tarPreStr + '.');
        }
      } else {
        realDataSource = this.getDataSource('this.');
      }
    }
    //更新数据源
    let newState = {
      value: realInputValue,
    };
    if (realDataSource !== null) newState.dataSource = realDataSource;
    this.setState(newState, () => {
      nextCursorIndex && this.setInputCursorPosition(nextCursorIndex);
    });
    //默认加上变量表达式
    this.t && clearTimeout(this.t);
    this.t = setTimeout(() => {
      const { onChange } = this.props;
      // realInputValue = realInputValue ? `{{${realInputValue}}}` : undefined;
      onChange &&
        onChange({
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
  getDataSource(tempStr: string): Array<any> {
    if (tempStr === '' || /[^\w\.]$/.test(tempStr)) {
      return this.getDataSource('this.') || [];
    } else if (/\w\.$/.test(tempStr)) {
      let currentField = this.getCurrentFiled(tempStr);
      if (!currentField) return null;
      let tempKeys = this.getObjectKeys(currentField.str);
      tempKeys = this.getContextKeys(tempKeys);
      if (!tempKeys) return null;
      //给默认情况增加this
      if (tempStr === 'this.') {
        tempKeys = tempKeys.map((item: string) => {
          return 'this.' + item;
        });
        tempKeys.unshift('this');
      }
      return tempKeys;
    } else if (/\.$/.test(tempStr)) {
      return [];
    } else {
      return null;
    }
  }

  /**
   * 获取光标前的对象字符串，语法解析获取对象字符串
   * @param  {String} str 模板字符串
   * @return {String}     光标前的对象字符串
   */
  getCurrentFiled(str: string | any[]) {
    str += 'x'; //.后面加一个x字符，便于acorn解析
    try {
      let astTree = acorn.parse(str);
      let right = astTree.body[0].expression.right || astTree.body[0].expression;
      if (right.type === 'MemberExpression') {
        let { start, end } = right;
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
  getContextKeys(keys: any) {
    // let context = {};
    // const { appHelper } = this.context;
    // const activeKey = appHelper && appHelper.activeKey;
    // if (!activeKey) return;
    // const activeCtx = appHelper.schemaHelper.compCtxMap && appHelper.schemaHelper.compCtxMap[activeKey];
    // if (!activeCtx) return null;
    // let __self = activeCtx;
    // if (keys && keys.length > 1) {
    //   keys.shift(0);
    //   let path = '/' + keys.join('/');
    //   path = path.replace(/[\[\]]/g, '/');
    //   context = jsonuri.get(__self, path);
    //   if (context && typeof context === 'object') {
    //     return this.filterKey(context);
    //   }
    // } else if (keys && keys[0] === 'this') {
    //   return this.filterKey(__self);
    // }
    // return null;
    return ['page', 'component'];
  }

  /*过滤key */
  filterKey(obj: any) {
    let filterKeys = [
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
    let result = [];
    for (let key in obj) {
      if (key.indexOf('_') !== 0 && filterKeys.indexOf(key) === -1) {
        result.push(key);
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
  filterOption(inputValue: string, item: { value: string | any[] }) {
    const cursorIndex = this.getInputCursorPosition();
    let preStr = inputValue.substr(0, cursorIndex);
    let lastKey = preStr.split('.').slice(-1);
    if (!lastKey) return true;
    if (item.value.indexOf(lastKey) > -1) return true;
    return false;
  }

  render() {
    const { value, dataSource } = this.state;
    const { placeholder } = this.props;
    const isValObject = !!(value == '[object Object]');
    let title = isValObject
      ? this.i18n('valueIllegal')
      : (value || placeholder || this.i18n('jsExpression')).toString();
    const cursorIndex = this.getInputCursorPosition();
    let childNode = cursorIndex ? (
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
              <AutoComplete
                {...this.props}
                style={{ width: '100%' }}
                dataSource={dataSource}
                placeholder={placeholder || this.i18n('jsExpression')}
                value={value}
                disabled={isValObject}
                innerBefore={<span style={{ color: '#999', marginLeft: 4 }}>{'{{'}</span>}
                innerAfter={<span style={{ color: '#999', marginRight: 4 }}>{'}}'}</span>}
                itemRender={({ value }) => {
                  return (
                    <Option key={value} text={value} value={value}>
                      <div className="code-input-value">{value}</div>
                      <div className="code-input-help">{helpMap[value]}</div>
                    </Option>
                  );
                }}
                onChange={this.onChange.bind(this)}
                filter={this.filterOption.bind(this)}
              />
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
      this.listenerFun = (event) => {
        let isMoveKey = !!(event.type == 'keyup' && ~[37, 38, 39, 91].indexOf(event.keyCode));
        let isMouseup = event.type == 'mouseup';
        if (isMoveKey || isMouseup) {
          let dataSource = this.getDataSource(this.state.value) || [];
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
    let keys = [];
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
