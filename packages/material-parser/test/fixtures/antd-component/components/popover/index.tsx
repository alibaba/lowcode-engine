import * as React from 'react';
import Tooltip, { AbstractTooltipProps, TooltipPlacement } from '../tooltip';
import { ConfigConsumer, ConfigConsumerProps } from '../config-provider';
import { getRenderPropValue, RenderFunction } from '../_util/getRenderPropValue';

export interface PopoverProps extends AbstractTooltipProps {
  title?: React.ReactNode | RenderFunction;
  content?: React.ReactNode | RenderFunction;
}

export default class Popover extends React.Component<PopoverProps, {}> {
  static defaultProps = {
    placement: 'top' as TooltipPlacement,
    transitionName: 'zoom-big',
    trigger: 'hover',
    mouseEnterDelay: 0.1,
    mouseLeaveDelay: 0.1,
    overlayStyle: {},
  };

  private tooltip: Tooltip;

  getPopupDomNode() {
    return this.tooltip.getPopupDomNode();
  }

  getOverlay(prefixCls: string) {
    const { title, content } = this.props;
    return (
      <>
        {title && <div className={`${prefixCls}-title`}>{getRenderPropValue(title)}</div>}
        <div className={`${prefixCls}-inner-content`}>{getRenderPropValue(content)}</div>
      </>
    );
  }

  saveTooltip = (node: any) => {
    this.tooltip = node;
  };

  renderPopover = ({ getPrefixCls }: ConfigConsumerProps) => {
    const { prefixCls: customizePrefixCls, ...props } = this.props;
    delete props.title;
    const prefixCls = getPrefixCls('popover', customizePrefixCls);
    return (
      <Tooltip
        {...props}
        prefixCls={prefixCls}
        ref={this.saveTooltip}
        overlay={this.getOverlay(prefixCls)}
      />
    );
  };

  render() {
    return <ConfigConsumer>{this.renderPopover}</ConfigConsumer>;
  }
}
