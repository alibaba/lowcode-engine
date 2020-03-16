import React, { PureComponent, Fragment } from 'react';

import PropTypes from 'prop-types';
import TopIcon from '../TopIcon';
import { Balloon, Badge, Dialog } from '@alifd/next';

import './index.scss';
export default class TopPlugin extends PureComponent {
  static displayName = 'lowcodeTopPlugin';
  
  static defaultProps = {
    active: false,
    config: {},
    disabled: false,
    dotted: false,
    locked: false,
    onClick: () => {},
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      dialogVisible: false,
    };
  }

  componentDidMount() {
    const { config } = this.props;
    const pluginKey = config && config.pluginKey;
    // const appHelper = this.appHelper;
    // if (appHelper && addonKey) {
    //   appHelper.on(`${addonKey}.dialog.show`, this.handleShow);
    //   appHelper.on(`${addonKey}.dialog.close`, this.handleClose);
    // }
  }

  componentWillUnmount() {
    // const { config } = this.props;
    // const addonKey = config && config.addonKey;
    // const appHelper = this.appHelper;
    // if (appHelper && addonKey) {
    //   appHelper.off(`${addonKey}.dialog.show`, this.handleShow);
    //   appHelper.off(`${addonKey}.dialog.close`, this.handleClose);
    // }
  }

  handleShow = () => {
    const { disabled, config, onClick } = this.props;
    const addonKey = config && config.addonKey;
    if (disabled || !addonKey) return;
    //考虑到弹窗情况，延时发送消息
    setTimeout(() => this.appHelper.emit(`${addonKey}.addon.activate`), 0);
    this.handleOpen();
    onClick && onClick();
  };

  handleClose = () => {
    const addonKey = this.props.config && this.props.config.addonKey;
    const currentAddon =
      this.appHelper.addons && this.appHelper.addons[addonKey];
    if (currentAddon) {
      this.utils.transformToPromise(currentAddon.close()).then(() => {
        this.setState({
          dialogVisible: false,
        });
      });
    }
  };

  handleOpen = () => {
    // todo dialog类型的插件初始时拿不动插件实例
    this.setState({
      dialogVisible: true,
    });
  };

  renderIcon = clickCallback => {
    const { active, disabled, dotted, locked, config, onClick } = this.props;
    const { pluginKey, props } = config || {};
    const { icon, title } = props || {};
    const node = (
      <TopIcon
        className={`lowcode-top-addon ${pluginKey}`}
        active={active}
        disabled={disabled}
        locked={locked}
        icon={icon}
        title={title}
        onClick={() => {
          if (disabled) return;
          //考虑到弹窗情况，延时发送消息
          setTimeout(
            () => this.appHelper.emit(`${pluginKey}.addon.activate`),
            0,
          );
          clickCallback && clickCallback();
          onClick && onClick();
        }}
      />
    );
    return dotted ? <Badge dot>{node}</Badge> : node;
  };

  render() {
    const { active, dotted, locked, disabled, config, editor, pluginClass: Comp } = this.props;
    const { pluginKey, pluginProps, props, type } = config || {};
    const { onClick, title } = props || {};
    const { dialogVisible } = this.state;
    if (!pluginKey || !type || !Comp) return null;
    const node = <Comp 
      active={active}
      locked={locked}
      disabled={disabled}
      config={config}
      onClick={() => {
        onClick && onClick.call(null, editor);
      }}
      {...pluginProps}
    />;

    switch (type) {
      case 'LinkIcon':
        return (
          <a {...props.linkProps}>
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
              {...props.dialogProps}
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
            triggerType={['click', 'hover']}
            {...props.balloonProps}
          >
            {node}
          </Balloon>
        );
      case 'Custom':
        return dotted ? <Badge dot>{node}</Badge> : node;
      default:
        return null;
    }
  }
}
