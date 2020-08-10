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
  onChange: (icon: string) => undefined;
  icons: string[];
}
export default class IconSetter extends PureComponent<IconSetterProps, {}> {
  static defaultProps = {
    value: '',
    icons: icons,
    onChange: (icon: string) => undefined,
  };

  onInputChange() {
    console.log(this);
  }

  onSelectIcon(icon: string) {
    const { onChange } = this.props;
    onChange(icon);
  }

  render() {
    const { icons, value } = this.props;

    const triggerNode = (
      <div className="lowcode-icon-box">
        <Icon type={value} />
      </div>
    );
    const InnerBeforeNode = (
      <Balloon
        className={'lowcode-icon-content'}
        trigger={triggerNode}
        needAdjust={true}
        triggerType="click"
        closable={false}
        alignEdge
        align="l"
        popupClassName="lowcode-icon-setter-popup"
      >
        <ul className="lowcode-icon-list">
          {icons.map((icon) => (
            <li onClick={() => this.onSelectIcon(icon)}>
              <Icon type={icon} size="large" />
            </li>
          ))}
        </ul>
      </Balloon>
    );

    return (
      <div className="lc-icon-setter">
        <Input innerBefore={InnerBeforeNode} onChange={this.onInputChange} value={value} />
      </div>
    );
  }
}
