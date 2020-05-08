import * as React from 'react';
import RcTooltip from 'rc-tooltip';
import { TooltipProps as RcTooltipProps } from 'rc-tooltip/lib/Tooltip';
import classNames from 'classnames';
import { BuildInPlacements } from 'rc-trigger/lib/interface';
import getPlacements, { AdjustOverflow, PlacementsConfig } from './placements';
import { ConfigConsumer, ConfigConsumerProps } from '../config-provider';

export { AdjustOverflow, PlacementsConfig };

export type TooltipPlacement =
  | 'top'
  | 'left'
  | 'right'
  | 'bottom'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'leftTop'
  | 'leftBottom'
  | 'rightTop'
  | 'rightBottom';

// https://github.com/react-component/tooltip
// https://github.com/yiminghe/dom-align
export interface TooltipAlignConfig {
  points?: [string, string];
  offset?: [number | string, number | string];
  targetOffset?: [number | string, number | string];
  overflow?: { adjustX: boolean; adjustY: boolean };
  useCssRight?: boolean;
  useCssBottom?: boolean;
  useCssTransform?: boolean;
}

export interface AbstractTooltipProps extends Partial<RcTooltipProps> {
  style?: React.CSSProperties;
  className?: string;
  placement?: TooltipPlacement;
  builtinPlacements?: BuildInPlacements;
  openClassName?: string;
  arrowPointAtCenter?: boolean;
  autoAdjustOverflow?: boolean | AdjustOverflow;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
}

export type RenderFunction = () => React.ReactNode;

export interface TooltipPropsWithOverlay extends AbstractTooltipProps {
  title?: React.ReactNode | RenderFunction;
  overlay: React.ReactNode | RenderFunction;
}

export interface TooltipPropsWithTitle extends AbstractTooltipProps {
  title: React.ReactNode | RenderFunction;
  overlay?: React.ReactNode | RenderFunction;
}

export declare type TooltipProps = TooltipPropsWithTitle | TooltipPropsWithOverlay;

const splitObject = (obj: any, keys: string[]) => {
  const picked: any = {};
  const omitted: any = { ...obj };
  keys.forEach(key => {
    if (obj && key in obj) {
      picked[key] = obj[key];
      delete omitted[key];
    }
  });
  return { picked, omitted };
};

// Fix Tooltip won't hide at disabled button
// mouse events don't trigger at disabled button in Chrome
// https://github.com/react-component/tooltip/issues/18
function getDisabledCompatibleChildren(element: React.ReactElement<any>, prefixCls: string) {
  const elementType = element.type as any;
  if (
    (elementType.__ANT_BUTTON === true ||
      elementType.__ANT_SWITCH === true ||
      elementType.__ANT_CHECKBOX === true ||
      element.type === 'button') &&
    element.props.disabled
  ) {
    // Pick some layout related style properties up to span
    // Prevent layout bugs like https://github.com/ant-design/ant-design/issues/5254
    const { picked, omitted } = splitObject(element.props.style, [
      'position',
      'left',
      'right',
      'top',
      'bottom',
      'float',
      'display',
      'zIndex',
    ]);
    const spanStyle = {
      display: 'inline-block', // default inline-block is important
      ...picked,
      cursor: 'not-allowed',
      width: element.props.block ? '100%' : null,
    };
    const buttonStyle = {
      ...omitted,
      pointerEvents: 'none',
    };
    const child = React.cloneElement(element, {
      style: buttonStyle,
      className: null,
    });
    return (
      <span
        style={spanStyle}
        className={classNames(element.props.className, `${prefixCls}-disabled-compatible-wrapper`)}
      >
        {child}
      </span>
    );
  }
  return element;
}

class Tooltip extends React.Component<TooltipProps, any> {
  static defaultProps = {
    placement: 'top' as TooltipPlacement,
    transitionName: 'zoom-big-fast',
    mouseEnterDelay: 0.1,
    mouseLeaveDelay: 0.1,
    arrowPointAtCenter: false,
    autoAdjustOverflow: true,
  };

  static getDerivedStateFromProps(nextProps: TooltipProps) {
    if ('visible' in nextProps) {
      return { visible: nextProps.visible };
    }
    return null;
  }

  private tooltip: typeof RcTooltip;

  constructor(props: TooltipProps) {
    super(props);

    this.state = {
      visible: !!props.visible || !!props.defaultVisible,
    };
  }

  onVisibleChange = (visible: boolean) => {
    const { onVisibleChange } = this.props;
    if (!('visible' in this.props)) {
      this.setState({ visible: this.isNoTitle() ? false : visible });
    }
    if (onVisibleChange && !this.isNoTitle()) {
      onVisibleChange(visible);
    }
  };

  getPopupDomNode() {
    return (this.tooltip as any).getPopupDomNode();
  }

  getPlacements() {
    const { builtinPlacements, arrowPointAtCenter, autoAdjustOverflow } = this.props;
    return (
      builtinPlacements ||
      getPlacements({
        arrowPointAtCenter,
        autoAdjustOverflow,
      })
    );
  }

  saveTooltip = (node: typeof RcTooltip) => {
    this.tooltip = node;
  };

  // 动态设置动画点
  onPopupAlign = (domNode: HTMLElement, align: any) => {
    const placements: any = this.getPlacements();
    // 当前返回的位置
    const placement = Object.keys(placements).filter(
      key =>
        placements[key].points[0] === align.points[0] &&
        placements[key].points[1] === align.points[1],
    )[0];
    // 根据当前坐标设置动画点
    const rect = domNode.getBoundingClientRect();
    const transformOrigin = {
      top: '50%',
      left: '50%',
    };
    if (placement.indexOf('top') >= 0 || placement.indexOf('Bottom') >= 0) {
      transformOrigin.top = `${rect.height - align.offset[1]}px`;
    } else if (placement.indexOf('Top') >= 0 || placement.indexOf('bottom') >= 0) {
      transformOrigin.top = `${-align.offset[1]}px`;
    }
    if (placement.indexOf('left') >= 0 || placement.indexOf('Right') >= 0) {
      transformOrigin.left = `${rect.width - align.offset[0]}px`;
    } else if (placement.indexOf('right') >= 0 || placement.indexOf('Left') >= 0) {
      transformOrigin.left = `${-align.offset[0]}px`;
    }
    domNode.style.transformOrigin = `${transformOrigin.left} ${transformOrigin.top}`;
  };

  isNoTitle() {
    const { title, overlay } = this.props;
    return !title && !overlay && title !== 0; // overlay for old version compatibility
  }

  getOverlay() {
    const { title, overlay } = this.props;
    if (title === 0) {
      return title;
    }
    return overlay || title || '';
  }

  renderTooltip = ({
    getPopupContainer: getContextPopupContainer,
    getPrefixCls,
    direction,
  }: ConfigConsumerProps) => {
    const { props, state } = this;
    const {
      prefixCls: customizePrefixCls,
      openClassName,
      getPopupContainer,
      getTooltipContainer,
      overlayClassName,
    } = props;
    const children = props.children as React.ReactElement<any>;
    const prefixCls = getPrefixCls('tooltip', customizePrefixCls);
    let { visible } = state;
    // Hide tooltip when there is no title
    if (!('visible' in props) && this.isNoTitle()) {
      visible = false;
    }

    const child = getDisabledCompatibleChildren(
      React.isValidElement(children) ? children : <span>{children}</span>,
      prefixCls,
    );

    const childProps = child.props;
    const childCls = classNames(childProps.className, {
      [openClassName || `${prefixCls}-open`]: true,
    });

    const customOverlayClassName = classNames(overlayClassName, {
      [`${prefixCls}-rtl`]: direction === 'rtl',
    });
    return (
      <RcTooltip
        {...this.props}
        prefixCls={prefixCls}
        overlayClassName={customOverlayClassName}
        getTooltipContainer={getPopupContainer || getTooltipContainer || getContextPopupContainer}
        ref={this.saveTooltip}
        builtinPlacements={this.getPlacements()}
        overlay={this.getOverlay()}
        visible={visible}
        onVisibleChange={this.onVisibleChange}
        onPopupAlign={this.onPopupAlign}
      >
        {visible ? React.cloneElement(child, { className: childCls }) : child}
      </RcTooltip>
    );
  };

  render() {
    return <ConfigConsumer>{this.renderTooltip}</ConfigConsumer>;
  }
}

export default Tooltip;
