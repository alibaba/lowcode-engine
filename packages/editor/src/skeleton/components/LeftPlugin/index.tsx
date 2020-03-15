import React, { PureComponent, Fragment } from 'react';
import classNames from 'classnames';
import { Balloon, Dialog, Icon, Badge } from '@alifd/next';

import './index.scss';
import Editor from '../../../framework/editor';
import { PluginConfig, PluginClass } from '../../../framework/definitions';

export interface LeftPluginProps {
  active?: boolean;
  config: PluginConfig;
  disabled?: boolean;
  editor: Editor;
  locked?: boolean;
  marked?: boolean;
  onClick?: () => void;
  pluginClass: PluginClass;
}

export interface LeftPluginState {
  dialogVisible: boolean;
}

export default class LeftPlugin extends PureComponent<LeftPluginProps, LeftPluginState> {
  static displayName = 'LowcodeLeftPlugin';

  static defaultProps = {
    active: false,
    config: {},
    disabled: false,
    marked: false,
    locked: false,
    onClick: () => {}
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      dialogVisible: false
    };
  }

  componentDidMount() {
    const { config, editor } = this.props;
    const pluginKey = config && config.pluginKey;
    if (editor && pluginKey) {
      editor.on(`${pluginKey}.dialog.show`, this.handleShow);
      editor.on(`${pluginKey}.dialog.close`, this.handleClose);
    }
  }

  componentWillUnmount() {
    const { config, editor } = this.props;
    const pluginKey = config && config.pluginKey;
    if (editor && pluginKey) {
      editor.off(`${pluginKey}.dialog.show`, this.handleShow);
      editor.off(`${pluginKey}.dialog.close`, this.handleClose);
    }
  }

  handleClose = () => {
    const { config, editor } = this.props;
    const pluginKey = config && config.pluginKey;
    const plugin = editor.plugins && editor.plugins[pluginKey];
    if (plugin) {
      plugin.close().then(() => {
        this.setState({
          dialogVisible: false
        });
      });
    }
  };

  handleOpen = () => {
    // todo 对话框类型的插件初始时拿不到插件实例
    this.setState({
      dialogVisible: true
    });
  };

  handleShow = () => {
    const { disabled, config, onClick, editor } = this.props;
    const pluginKey = config && config.pluginKey;
    if (disabled || !pluginKey) return;
    // 考虑到弹窗情况，延时发送消息
    setTimeout(() => editor.emit(`${pluginKey}.addon.activate`), 0);
    this.handleOpen();
    onClick && onClick();
  };

  renderIcon = clickCallback => {
    const { active, disabled, marked, locked, onClick, config } = this.props;
    const { pluginKey, props } = config || {};
    const { icon, title } = props || {};
    return (
      <div
        className={classNames('lowcode-left-plugin', pluginKey, {
          active,
          disabled,
          locked
        })}
        data-tooltip={title}
        onClick={() => {
          if (disabled) return;
          // 考虑到弹窗情况，延时发送消息
          clickCallback && clickCallback();
          onClick && onClick();
        }}
      >
        {marked ? (
          <Badge dot>
            <Icon type={icon} size="small" />
          </Badge>
        ) : (
          <Icon type={icon} size="small" />
        )}
      </div>
    );
  };

  render() {
    const { marked, locked, active, disabled, config, editor, pluginClass: Comp } = this.props;
    const { pluginKey, props, type, pluginProps } = config || {};
    const { onClick, title } = props || {};
    const { dialogVisible } = this.state;
    if (!pluginKey || !type || !props) return null;

    const node =
      (Comp && (
        <Comp
          editor={editor}
          active={active}
          locked={locked}
          disabled={disabled}
          config={config}
          onClick={() => {
            onClick && onClick.call(null, editor);
          }}
          {...pluginProps}
        />
      )) ||
      null;

    switch (type) {
      case 'LinkIcon':
        return (
          <a {...(props.linkProps || {})}>
            {this.renderIcon(() => {
              onClick && onClick.call(null, editor);
            })}
          </a>
        );
      case 'Icon':
        return this.renderIcon(() => {
          onClick && onClick.call(null, editor);
        });
      case 'DialogIcon':
        return (
          <Fragment>
            {this.renderIcon(() => {
              onClick && onClick.call(null, editor);
              this.handleOpen();
            })}
            <Dialog
              onOk={() => {
                editor.emit(`${pluginKey}.dialog.onOk`);
                this.handleClose();
              }}
              onCancel={this.handleClose}
              onClose={this.handleClose}
              title={title}
              style={{
                width: 500,
                ...(props && props.style)
              }}
              {...(props.dialogProps || {})}
              visible={dialogVisible}
            >
              {node}
            </Dialog>
          </Fragment>
        );
      case 'BalloonIcon':
        return (
          <Balloon
            trigger={this.renderIcon(() => {
              onClick && onClick.call(null, editor);
            })}
            align="r"
            triggerType={['click', 'hover']}
            {...(props.balloonProps || {})}
          >
            {node}
          </Balloon>
        );
      case 'PanelIcon':
        return this.renderIcon(() => {
          onClick && onClick.call(null, editor);
          this.handleOpen();
        });
      case 'Custom':
        return marked ? <Badge dot>{node}</Badge> : node;
      default:
        return null;
    }
  }
}
