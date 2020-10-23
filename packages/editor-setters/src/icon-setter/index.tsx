import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { Input, Icon, Balloon } from '@alifd/next';

import './index.scss';

const icons = [
  'smile',
  'cry',
  'success',
  'warning',
  'prompt',
  'error',
  'help',
  'clock',
  'success-filling',
  'delete-filling',
  'favorites-filling',
  'add',
  'minus',
  'arrow-up',
  'arrow-down',
  'arrow-left',
  'arrow-right',
  'arrow-double-left',
  'arrow-double-right',
  'switch',
  'sorting',
  'descending',
  'ascending',
  'select',
  'semi-select',
  'loading',
  'search',
  'close',
  'ellipsis',
  'picture',
  'calendar',
  'ashbin',
  'upload',
  'download',
  'set',
  'edit',
  'refresh',
  'filter',
  'attachment',
  'account',
  'email',
  'atm',
  'copy',
  'exit',
  'eye',
  'eye-close',
  'toggle-left',
  'toggle-right',
  'lock',
  'unlock',
  'chart-pie',
  'chart-bar',
  'form',
  'detail',
  'list',
  'dashboard',
];
interface IconSetterProps {
  value: string;
  type: string;
  defaultValue: string;
  placeholder: string;
  hasClear: boolean;
  onChange: (icon: string) => undefined;
  icons: string[];
}
export default class IconSetter extends PureComponent<IconSetterProps> {
  static defaultProps = {
    value: undefined,
    type: 'string',
    defaultValue: '',
    hasClear: true,
    icons,
    placeholder: '请点击选择 Icon',
    onChange: () => undefined,
  };

  state = {
    firstLoad: true,
  };

  _onChange = (icon: string) => {
    const { onChange, type } = this.props;
    if (type === 'string') {
      onChange(icon);
    } else if (type === 'node') {
      onChange({
        componentName: 'Icon',
        props: {
          type: icon,
        },
      });
    }
  };

  onInputChange = (icon: string) => {
    this._onChange(icon);
  };

  onSelectIcon = (icon: string) => {
    this._onChange(icon);
  };

  render() {
    const { value, defaultValue, onChange, placeholder, hasClear } = this.props;
    const { firstLoad } = this.state;
    const _value = typeof value === 'object' ? value?.props?.type : value;
    if (firstLoad && defaultValue && typeof value === 'undefined') {
      onChange(defaultValue);
      this.setState({
        firstLoad: false,
      });
    }
    const currentIcon = <Icon size="xs" type={_value} />;
    const clearIcon = hasClear && (
      <Icon
        size="xs"
        id="icon-clear"
        type="delete-filling"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onSelectIcon('');
        }}
      />
    );

    const triggerNode = (
      <div>
        <Input
          placeholder={placeholder}
          addonTextBefore={currentIcon}
          onChange={this.onInputChange}
          value={_value}
          defaultValue={defaultValue}
          readOnly
          addonTextAfter={clearIcon}
        />
      </div>
    );
    const InnerBeforeNode = (
      <Balloon
        className={'lowcode-icon-content'}
        trigger={triggerNode}
        needAdjust
        triggerType="click"
        closable={false}
        alignEdge
        align="l"
        popupClassName="lowcode-icon-setter-popup"
      >
        <ul className="lowcode-icon-list">
          {icons.map((icon) => (
            <li key={icon} onClick={() => this.onSelectIcon(icon)}>
              <Icon type={icon} size="medium" />
            </li>
          ))}
        </ul>
      </Balloon>
    );

    return <div className="lc-icon-setter">{InnerBeforeNode}</div>;
  }
}
