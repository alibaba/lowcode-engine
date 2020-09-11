import { Component } from 'react';
import { isJSSlot } from '@ali/lowcode-types';
import { Button, Input, Icon } from '@alifd/next';
import './index.less';

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
          开启插槽
        </Button>
      );
    }
    const hasParams = value.params && Array.isArray(value.params);
    return (
      <div className="lc-setter-slot">
        <Button
          onClick={() => {
            // TODO: use slot first child literal value pad
            onChange && onChange(null);
          }}
          type="secondary"
        >
          关闭插槽
        </Button>
        {hasParams ? (
          <Input
            className="lc-slot-params"
            addonTextBefore="入参"
            placeholder="插槽入参，以逗号风格"
            value={value.params!.join(',')}
            autoFocus
            onChange={(val) => {
              val = val.trim();
              const params = val ? val.split(/ *, */) : [];
              onChange &&
                onChange({
                  ...value,
                  params,
                });
            }}
            addonAfter={
              <Button
                type="secondary"
                onClick={() => {
                  onChange &&
                    onChange({
                      type: 'JSSlot',
                      value: value.value,
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
            添加入参
          </Button>
        ) : null}
      </div>
    );
  }
}
