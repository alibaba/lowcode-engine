/* eslint-disable react/button-has-type */
import * as React from 'react';
import classNames from 'classnames';
import omit from 'omit.js';

import Group from './button-group';
import { ConfigContext } from '../config-provider';
import Wave from '../_util/wave';
import { Omit, tuple } from '../_util/type';
import warning from '../_util/warning';
import SizeContext, { SizeType } from '../config-provider/SizeContext';
import LoadingIcon from './LoadingIcon';
import { RefactorActionInfo } from 'typescript';

const rxTwoCNChar = /^[\u4e00-\u9fa5]{2}$/;
const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar);
function isString(str: any) {
  return typeof str === 'string';
}

// Insert one space between two chinese characters automatically.
function insertSpace(child: React.ReactChild, needInserted: boolean) {
  // Check the child if is undefined or null.
  if (child == null) {
    return;
  }
  const SPACE = needInserted ? ' ' : '';
  // strictNullChecks oops.
  if (
    typeof child !== 'string' &&
    typeof child !== 'number' &&
    isString(child.type) &&
    isTwoCNChar(child.props.children)
  ) {
    return React.cloneElement(child, {}, child.props.children.split('').join(SPACE));
  }
  if (typeof child === 'string') {
    if (isTwoCNChar(child)) {
      child = child.split('').join(SPACE);
    }
    return <span>{child}</span>;
  }
  return child;
}

function spaceChildren(children: React.ReactNode, needInserted: boolean) {
  let isPrevChildPure: boolean = false;
  const childList: React.ReactNode[] = [];
  React.Children.forEach(children, (child) => {
    const type = typeof child;
    const isCurrentChildPure = type === 'string' || type === 'number';
    if (isPrevChildPure && isCurrentChildPure) {
      const lastIndex = childList.length - 1;
      const lastChild = childList[lastIndex];
      childList[lastIndex] = `${lastChild}${child}`;
    } else {
      childList.push(child);
    }

    isPrevChildPure = isCurrentChildPure;
  });

  // Pass to React.Children.map to auto fill key
  return React.Children.map(childList, (child) => insertSpace(child as React.ReactChild, needInserted));
}

const ButtonTypes = tuple('default', 'primary', 'ghost', 'dashed', 'danger', 'link');
export type ButtonType = typeof ButtonTypes[number];
const ButtonShapes = tuple('circle', 'circle-outline', 'round');
export type ButtonShape = typeof ButtonShapes[number];
const ButtonHTMLTypes = tuple('submit', 'button', 'reset');
export type ButtonHTMLType = typeof ButtonHTMLTypes[number];

export interface BaseButtonProps {
  type?: ButtonType;
  icon?: React.ReactNode;
  shape?: ButtonShape;
  size?: SizeType;
  loading?: boolean | { delay?: number };
  prefixCls?: string;
  className?: string;
  ghost?: boolean;
  danger?: boolean;
  block?: boolean;
  children?: React.ReactNode;
}

// Typescript will make optional not optional if use Pick with union.
// Should change to `AnchorButtonProps | NativeButtonProps` and `any` to `HTMLAnchorElement | HTMLButtonElement` if it fixed.
// ref: https://github.com/ant-design/ant-design/issues/15930
export type AnchorButtonProps = {
  href: string;
  target?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
} & BaseButtonProps &
  Omit<React.AnchorHTMLAttributes<any>, 'type' | 'onClick'>;

export type NativeButtonProps = {
  htmlType?: ButtonHTMLType;
  onClick?: React.MouseEventHandler<HTMLElement>;
} & BaseButtonProps &
  Omit<React.ButtonHTMLAttributes<any>, 'type' | 'onClick'>;

export type ButtonProps = Partial<AnchorButtonProps & NativeButtonProps>;

interface ButtonTypeProps extends React.FC<ButtonProps> {
  Group: typeof Group;
  __ANT_BUTTON: boolean;
}

const Button: ButtonTypeProps = (props) => {
  const [loading, setLoading] = React.useState(props.loading);
  const [hasTwoCNChar, setHasTwoCNChar] = React.useState(false);
  const { getPrefixCls, autoInsertSpaceInButton, direction } = React.useContext(ConfigContext);
  const buttonRef = React.createRef<HTMLButtonElement>();
  let delayTimeout: number;

  const isNeedInserted = () => {
    const { icon, children, type } = props;
    return React.Children.count(children) === 1 && !icon && type !== 'link';
  };

  const fixTwoCNChar = () => {
    // Fix for HOC usage like <FormatMessage />
    if (!buttonRef || !buttonRef.current || autoInsertSpaceInButton === false) {
      return;
    }
    const buttonText = buttonRef.current.textContent;
    if (isNeedInserted() && isTwoCNChar(buttonText)) {
      if (!hasTwoCNChar) {
        setHasTwoCNChar(true);
      }
    } else if (hasTwoCNChar) {
      setHasTwoCNChar(false);
    }
  };

  React.useEffect(() => {
    if (props.loading && typeof props.loading !== 'boolean') {
      clearTimeout(delayTimeout);
    }
    if (props.loading && typeof props.loading !== 'boolean' && props.loading.delay) {
      delayTimeout = window.setTimeout(() => {
        setLoading(props.loading);
      }, props.loading.delay);
    } else if (props.loading !== loading) {
      setLoading(props.loading);
    }
  }, [props.loading]);

  React.useEffect(() => {
    fixTwoCNChar();
  }, [buttonRef]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>) => {
    const { onClick } = props;
    if (loading) {
      return;
    }
    if (onClick) {
      (onClick as React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>)(e);
    }
  };

  return (
    <SizeContext.Consumer>
      {(size) => {
        const {
          prefixCls: customizePrefixCls,
          type,
          danger,
          shape,
          size: customizeSize,
          className,
          children,
          icon,
          ghost,
          block,
          ...rest
        } = props;

        warning(
          !(typeof icon === 'string' && icon.length > 2),
          'Button',
          `\`icon\` is using ReactNode instead of string naming in v4. Please check \`${icon}\` at https://ant.design/components/icon`,
        );

        const prefixCls = getPrefixCls('btn', customizePrefixCls);
        const autoInsertSpace = autoInsertSpaceInButton !== false;

        // large => lg
        // small => sm
        let sizeCls = '';
        switch (customizeSize || size) {
          case 'large':
            sizeCls = 'lg';
            break;
          case 'small':
            sizeCls = 'sm';
            break;
          default:
            break;
        }

        const iconType = loading ? 'loading' : icon;

        const classes = classNames(prefixCls, className, {
          [`${prefixCls}-${type}`]: type,
          [`${prefixCls}-${shape}`]: shape,
          [`${prefixCls}-${sizeCls}`]: sizeCls,
          [`${prefixCls}-icon-only`]: !children && children !== 0 && iconType,
          [`${prefixCls}-background-ghost`]: ghost,
          [`${prefixCls}-loading`]: loading,
          [`${prefixCls}-two-chinese-chars`]: hasTwoCNChar && autoInsertSpace,
          [`${prefixCls}-block`]: block,
          [`${prefixCls}-dangerous`]: !!danger,
          [`${prefixCls}-rtl`]: direction === 'rtl',
        });

        const iconNode =
          icon && !loading ? icon : <LoadingIcon existIcon={!!icon} prefixCls={prefixCls} loading={loading} />;

        const kids = children || children === 0 ? spaceChildren(children, isNeedInserted() && autoInsertSpace) : null;

        const linkButtonRestProps = omit(rest as AnchorButtonProps, ['htmlType', 'loading']);
        if (linkButtonRestProps.href !== undefined) {
          return (
            <a {...linkButtonRestProps} className={classes} onClick={handleClick} ref={buttonRef}>
              {iconNode}
              {kids}
            </a>
          );
        }

        // React does not recognize the `htmlType` prop on a DOM element. Here we pick it out of `rest`.
        const { htmlType, ...otherProps } = rest as NativeButtonProps;

        const buttonNode = (
          <button
            {...(omit(otherProps, ['loading']) as NativeButtonProps)}
            type={htmlType}
            className={classes}
            onClick={handleClick}
            ref={buttonRef}
          >
            {iconNode}
            {kids}
          </button>
        );

        if (type === 'link') {
          return buttonNode;
        }

        return <Wave>{buttonNode}</Wave>;
      }}
    </SizeContext.Consumer>
  );
};

Button.defaultProps = {
  loading: false,
  ghost: false,
  block: false,
  htmlType: 'button' as ButtonProps['htmlType'],
};

Button.Group = Group;
Button.__ANT_BUTTON = true;

export default Button;
