import { Component } from 'react';
import { isJSSlot } from '@ali/lowcode-types';
import { Button, Input, Icon } from '@alifd/next';
import './index.less';
import { intl } from '../../locale';

export default class SlotSetter extends Component<{
  value: any;
  onChange?: (value: any) => void;
  onInitial?: () => void;
  // 是否支持设置入参
  supportParams?: boolean;
}> {
  private handleInitial = () => {
    const { onChange, onInitial } = this.props;
    if (onInitial) {
      onInitial();
      return;
    }
    if (!onChange) {
      return;
    }
    onChange({
      type: 'JSSlot',
      value: null,
    });
  };

  render() {
    const { value, onChange, supportParams } = this.props;
    if (!isJSSlot(value)) {
      return (
        <Button type="primary" onClick={this.handleInitial}>
          {intl('Open slot')}
        </Button>
      );
    }


    const hasParams = value.params && Array.isArray(value.params);
    return (
      <div className="lc-setter-slot lc-setter-slot-column">
        <Button
          onClick={() => {
            // TODO: use slot first child literal value pad
            onChange && onChange(null);
          }}
          type="secondary"
        >
          {intl('Close slot')}
        </Button>
        {hasParams ? (
          <Input
            className="lc-slot-params"
            addonTextBefore={intl('Parameter')}
            placeholder={intl('ParameterPlaceholder')}
            value={value.params!.join(',')}
            autoFocus
            onChange={(val) => {
              val = val.trim();
              const params = val ? val.split(/ *, */) : [];
              onChange &&
                onChange({
                  ...value,
                  params: params.length == 0 ? [''] : params,
                });
            }}
            addonAfter={
              <Button
                type="secondary"
                onClick={() => {
                  onChange &&
                  onChange({
                    ...value,
                    params: [''],
                  });
                }}
              >
                <Icon type="close" />
              </Button>
            }
          />
        ) : supportParams ? (
          <Button
            className="lc-slot-params"
            type="primary"
            onClick={() => {
              onChange &&
                onChange({
                  ...value,
                  params: [],
                });
            }}
          >
            {intl('Add parameters')}
          </Button>
        ) : null}
      </div>
    );
  }
}
