import React from 'react';
import { Select, Input } from '@alifd/next';
import i18n from '@alife/whale-i18n';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { getLanguage } from '@alife/whale-util';

import i18nBundles from './i18n';
import countryDataSource from './data';

const lang = getLanguage();
const isCN = ['ZH_CN', 'ZH-CN'].includes(lang && lang.toUpperCase());

class WhaleTelephone extends React.Component {
  static displayName = 'WhaleTelephone';

  static propTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    value: PropTypes.object,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    style: {},
    className: '',
    disabled: false,
    onChange: undefined,
    value: {
      countryCode: '+86',
      phoneNumber: '',
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      popupStyle: {},
      tmpSelectedItem: {},
    };
  }

  componentDidMount() {
    if (!this.props.readOnly) {
      this.handleStyle();
      window.addEventListener('resize', this.resizeEventFunction);
    }
  }

  componentWillUnmount() {
    if (!this.props.readOnly) {
      window.removeEventListener('resize', this.resizeEventFunction);
    }
  }

  resizeEventFunction = () => this.handleStyle();

  handleStyle = () => {
    const { el } = this;
    const elWidth = el.offsetWidth;
    this.setState({
      popupStyle: {
        width: elWidth,
      },
    });
  };

  selectChange=(val, actionType, tmpSelectedItem) => {
    const { value, onChange } = this.props;
    this.setState({ tmpSelectedItem });
    onChange && onChange(Object.assign({}, value, { countryCode: val }), tmpSelectedItem, 'select');
  };

  inputChange = (val) => {
    const { value, onChange } = this.props;
    const { tmpSelectedItem } = this.state;
    onChange && onChange(Object.assign({}, value, { phoneNumber: val }), tmpSelectedItem, 'input');
  };

  renderItem = (item) => {
    const { countryName, countryName_zh: countryNameZh, value } = item;
    return (
      <div>
        <span className="country-span">{!isCN ? countryName : countryNameZh}</span>
        <span className="code-span">{value}</span>
      </div>
    );
  };

  render() {
    // i18nBundle 是 i18n 包装后额外提供的 prop，表示组件当前实际使用的文案
    const {
      style,
      className,
      disabled,
      value: { countryCode, phoneNumber },
      readOnly,
    } = this.props;
    // 排除掉不需要透传下去的参数，特别地适用于直接把大部分特殊控制外的参数透传给 Fusion 等组件的用法
    const cls = classnames({
      'whale-telephone': true,
      'whale-telephone-readonly': !!readOnly,
      [className]: className,
    });
    const { popupStyle } = this.state;

    if (readOnly) {
      return (
        <div className={cls} style={style}>
          <span>{countryCode}</span>&nbsp;<span>{phoneNumber}</span>
        </div>
      );
    }

    return (
      <div className={cls} style={style} ref={(ref) => { this.el = ref; }} data-name="WhaleTelephone">
        <Select
          className="whale-telephone-select"
          disabled={disabled}
          dataSource={countryDataSource}
          itemRender={this.renderItem}
          popupStyle={popupStyle}
          popupClassName="whale-telephone-select-popup"
          defaultValue={countryCode}
          onChange={this.selectChange}
        />
        <Input
          className="whale-telephone-number-input"
          value={phoneNumber}
          disabled={disabled}
          onChange={this.inputChange}
        />
      </div>
    );
  }
}

// 默认 export 提供了内置多语言文案的组件
export default i18n(WhaleTelephone, i18nBundles);
// 万一需有对组件进行扩展，为了避免 HOC 后无法直接继承，提供了导出组件内置多语言文案及未经 HOC 的组件
export { i18nBundles, WhaleTelephone as Pure };
