import * as React from 'react';
import classNames from 'classnames';
import toArray from 'rc-util/lib/Children/toArray';
import findDOMNode from 'rc-util/lib/Dom/findDOMNode';
import copy from 'copy-to-clipboard';
import omit from 'omit.js';
import EditOutlined from '@ant-design/icons/EditOutlined';
import CheckOutlined from '@ant-design/icons/CheckOutlined';
import CopyOutlined from '@ant-design/icons/CopyOutlined';
import ResizeObserver from 'rc-resize-observer';
import { ConfigConsumerProps, configConsumerProps } from '../config-provider';
import { withConfigConsumer } from '../config-provider/context';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import warning from '../_util/warning';
import TransButton from '../_util/transButton';
import raf from '../_util/raf';
import isStyleSupport from '../_util/styleChecker';
import Tooltip from '../tooltip';
import Typography, { TypographyProps } from './Typography';
import Editable from './Editable';
import measure from './util';

export type BaseType = 'secondary' | 'danger' | 'warning';

const isLineClampSupport = isStyleSupport('webkitLineClamp');
const isTextOverflowSupport = isStyleSupport('textOverflow');

interface CopyConfig {
  text?: string;
  onCopy?: () => void;
}

interface EditConfig {
  editing?: boolean;
  onStart?: () => void;
  onChange?: (value: string) => void;
}

interface EllipsisConfig {
  rows?: number;
  expandable?: boolean;
  suffix?: string;
  onExpand?: React.MouseEventHandler<HTMLElement>;
}

export interface BlockProps extends TypographyProps {
  title?: string;
  editable?: boolean | EditConfig;
  copyable?: boolean | CopyConfig;
  type?: BaseType;
  disabled?: boolean;
  ellipsis?: boolean | EllipsisConfig;
  // decorations
  code?: boolean;
  mark?: boolean;
  underline?: boolean;
  delete?: boolean;
  strong?: boolean;
}

function wrapperDecorations(
  { mark, code, underline, delete: del, strong }: BlockProps,
  content: React.ReactNode,
) {
  let currentContent = content;

  function wrap(needed: boolean | undefined, tag: string) {
    if (!needed) return;

    currentContent = React.createElement(tag, {}, currentContent);
  }

  wrap(strong, 'strong');
  wrap(underline, 'u');
  wrap(del, 'del');
  wrap(code, 'code');
  wrap(mark, 'mark');

  return currentContent;
}

interface InternalBlockProps extends BlockProps {
  component: string;
}

interface BaseState {
  edit: boolean;
  copied: boolean;
  ellipsisText: string;
  ellipsisContent: React.ReactNode;
  isEllipsis: boolean;
  expanded: boolean;
  clientRendered: boolean;
}

interface Locale {
  edit?: string;
  copy?: string;
  copied?: string;
  expand?: string;
}

const ELLIPSIS_STR = '...';

class Base extends React.Component<InternalBlockProps & ConfigConsumerProps, BaseState> {
  static defaultProps = {
    children: '',
  };

  static getDerivedStateFromProps(nextProps: BlockProps) {
    const { children, editable } = nextProps;

    warning(
      !editable || typeof children === 'string',
      'Typography',
      'When `editable` is enabled, the `children` should use string.',
    );

    return {};
  }

  editIcon?: TransButton;

  content?: HTMLElement;

  copyId?: number;

  rafId?: number;

  // Locale
  expandStr?: string;

  copyStr?: string;

  copiedStr?: string;

  editStr?: string;

  state: BaseState = {
    edit: false,
    copied: false,
    ellipsisText: '',
    ellipsisContent: null,
    isEllipsis: false,
    expanded: false,
    clientRendered: false,
  };

  componentDidMount() {
    this.setState({ clientRendered: true });
    this.resizeOnNextFrame();
  }

  componentDidUpdate(prevProps: BlockProps) {
    const { children } = this.props;
    const ellipsis = this.getEllipsis();
    const prevEllipsis = this.getEllipsis(prevProps);
    if (children !== prevProps.children || ellipsis.rows !== prevEllipsis.rows) {
      this.resizeOnNextFrame();
    }
  }

  componentWillUnmount() {
    window.clearTimeout(this.copyId);
    raf.cancel(this.rafId);
  }

  // =============== Expand ===============
  onExpandClick: React.MouseEventHandler<HTMLElement> = e => {
    const { onExpand } = this.getEllipsis();
    this.setState({ expanded: true });

    if (onExpand) {
      (onExpand as React.MouseEventHandler<HTMLElement>)(e);
    }
  };

  // ================ Edit ================
  onEditClick = () => {
    this.triggerEdit(true);
  };

  onEditChange = (value: string) => {
    const { onChange } = this.getEditable();
    if (onChange) {
      onChange(value);
    }

    this.triggerEdit(false);
  };

  onEditCancel = () => {
    this.triggerEdit(false);
  };

  // ================ Copy ================
  onCopyClick = () => {
    const { children, copyable } = this.props;
    const copyConfig: CopyConfig = {
      ...(typeof copyable === 'object' ? copyable : null),
    };

    if (copyConfig.text === undefined) {
      copyConfig.text = String(children);
    }
    copy(copyConfig.text || '');

    this.setState({ copied: true }, () => {
      if (copyConfig.onCopy) {
        copyConfig.onCopy();
      }

      this.copyId = window.setTimeout(() => {
        this.setState({ copied: false });
      }, 3000);
    });
  };

  getEditable(props?: BlockProps): EditConfig {
    const { edit } = this.state;
    const { editable } = props || this.props;
    if (!editable) return { editing: edit };

    return {
      editing: edit,
      ...(typeof editable === 'object' ? editable : null),
    };
  }

  getEllipsis(props?: BlockProps): EllipsisConfig {
    const { ellipsis } = props || this.props;
    if (!ellipsis) return {};

    return {
      rows: 1,
      expandable: false,
      ...(typeof ellipsis === 'object' ? ellipsis : null),
    };
  }

  setContentRef = (node: HTMLElement) => {
    this.content = node;
  };

  setEditRef = (node: TransButton) => {
    this.editIcon = node;
  };

  triggerEdit = (edit: boolean) => {
    const { onStart } = this.getEditable();
    if (edit && onStart) {
      onStart();
    }

    this.setState({ edit }, () => {
      if (!edit && this.editIcon) {
        this.editIcon.focus();
      }
    });
  };

  // ============== Ellipsis ==============
  resizeOnNextFrame = () => {
    raf.cancel(this.rafId);
    this.rafId = raf(() => {
      // Do not bind `syncEllipsis`. It need for test usage on prototype
      this.syncEllipsis();
    });
  };

  canUseCSSEllipsis(): boolean {
    const { clientRendered } = this.state;
    const { editable, copyable } = this.props;
    const { rows, expandable, suffix } = this.getEllipsis();

    if (suffix) return false;
    // Can't use css ellipsis since we need to provide the place for button
    if (editable || copyable || expandable || !clientRendered) {
      return false;
    }

    if (rows === 1) {
      return isTextOverflowSupport;
    }

    return isLineClampSupport;
  }

  syncEllipsis() {
    const { ellipsisText, isEllipsis, expanded } = this.state;
    const { rows, suffix } = this.getEllipsis();
    const { children } = this.props;
    if (!rows || rows < 0 || !this.content || expanded) return;

    // Do not measure if css already support ellipsis
    if (this.canUseCSSEllipsis()) return;

    warning(
      toArray(children).every((child: React.ReactNode) => typeof child === 'string'),
      'Typography',
      '`ellipsis` should use string as children only.',
    );

    const { content, text, ellipsis } = measure(
      findDOMNode(this.content),
      { rows, suffix },
      children,
      this.renderOperations(true),
      ELLIPSIS_STR,
    );
    if (ellipsisText !== text || isEllipsis !== ellipsis) {
      this.setState({ ellipsisText: text, ellipsisContent: content, isEllipsis: ellipsis });
    }
  }

  renderExpand(forceRender?: boolean) {
    const { expandable } = this.getEllipsis();
    const { prefixCls } = this.props;
    const { expanded, isEllipsis } = this.state;

    if (!expandable) return null;

    // force render expand icon for measure usage or it will cause dead loop
    if (!forceRender && (expanded || !isEllipsis)) return null;

    return (
      <a
        key="expand"
        className={`${prefixCls}-expand`}
        onClick={this.onExpandClick}
        aria-label={this.expandStr}
      >
        {this.expandStr}
      </a>
    );
  }

  renderEdit() {
    const { editable, prefixCls } = this.props;
    if (!editable) return;

    return (
      <Tooltip key="edit" title={this.editStr}>
        <TransButton
          ref={this.setEditRef}
          className={`${prefixCls}-edit`}
          onClick={this.onEditClick}
          aria-label={this.editStr}
        >
          <EditOutlined role="button" />
        </TransButton>
      </Tooltip>
    );
  }

  renderCopy() {
    const { copied } = this.state;
    const { copyable, prefixCls } = this.props;
    if (!copyable) return;

    const title = copied ? this.copiedStr : this.copyStr;
    return (
      <Tooltip key="copy" title={title}>
        <TransButton
          className={classNames(`${prefixCls}-copy`, copied && `${prefixCls}-copy-success`)}
          onClick={this.onCopyClick}
          aria-label={title}
        >
          {copied ? <CheckOutlined /> : <CopyOutlined />}
        </TransButton>
      </Tooltip>
    );
  }

  renderEditInput() {
    const { children, prefixCls, className, style, direction } = this.props;
    return (
      <Editable
        value={typeof children === 'string' ? children : ''}
        onSave={this.onEditChange}
        onCancel={this.onEditCancel}
        prefixCls={prefixCls}
        className={className}
        style={style}
        direction={direction}
      />
    );
  }

  renderOperations(forceRenderExpanded?: boolean) {
    return [this.renderExpand(forceRenderExpanded), this.renderEdit(), this.renderCopy()].filter(
      node => node,
    );
  }

  renderContent() {
    const { ellipsisContent, isEllipsis, expanded } = this.state;
    const {
      component,
      children,
      className,
      prefixCls,
      type,
      disabled,
      style,
      title,
      ...restProps
    } = this.props;
    const { rows, suffix } = this.getEllipsis();

    const textProps = omit(restProps, [
      'prefixCls',
      'editable',
      'copyable',
      'ellipsis',
      'mark',
      'underline',
      'mark',
      'code',
      'delete',
      'underline',
      'strong',
      ...configConsumerProps,
    ]);
    const cssEllipsis = this.canUseCSSEllipsis();
    const cssTextOverflow = rows === 1 && cssEllipsis;
    const cssLineClamp = rows && rows > 1 && cssEllipsis;

    let textNode: React.ReactNode = children;
    let ariaLabel: string | undefined;

    // Only use js ellipsis when css ellipsis not support
    if (rows && isEllipsis && !expanded && !cssEllipsis) {
      ariaLabel = title;
      if (!title && (typeof children === 'string' || typeof children === 'number')) {
        ariaLabel = String(children);
      }
      // We move full content to outer element to avoid repeat read the content by accessibility
      textNode = (
        <span title={ariaLabel} aria-hidden="true">
          {ellipsisContent}
          {ELLIPSIS_STR}
          {suffix}
        </span>
      );
    } else {
      textNode = (
        <>
          {children}
          {suffix}
        </>
      );
    }

    textNode = wrapperDecorations(this.props, textNode);

    return (
      <LocaleReceiver componentName="Text">
        {({ edit, copy: copyStr, copied, expand }: Locale) => {
          this.editStr = edit;
          this.copyStr = copyStr;
          this.copiedStr = copied;
          this.expandStr = expand;

          return (
            <ResizeObserver onResize={this.resizeOnNextFrame} disabled={!rows}>
              <Typography
                className={classNames(className, {
                  [`${prefixCls}-${type}`]: type,
                  [`${prefixCls}-disabled`]: disabled,
                  [`${prefixCls}-ellipsis`]: rows,
                  [`${prefixCls}-ellipsis-single-line`]: cssTextOverflow,
                  [`${prefixCls}-ellipsis-multiple-line`]: cssLineClamp,
                })}
                style={{
                  ...style,
                  WebkitLineClamp: cssLineClamp ? rows : null,
                }}
                component={component}
                ref={this.setContentRef}
                aria-label={ariaLabel}
                {...textProps}
              >
                {textNode}
                {this.renderOperations()}
              </Typography>
            </ResizeObserver>
          );
        }}
      </LocaleReceiver>
    );
  }

  render() {
    const { editing } = this.getEditable();

    if (editing) {
      return this.renderEditInput();
    }
    return this.renderContent();
  }
}

export default withConfigConsumer<InternalBlockProps>({
  prefixCls: 'typography',
})(Base);
