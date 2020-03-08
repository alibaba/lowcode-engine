import React, { PureComponent, Fragment } from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Balloon, Dialog, Icon, Badge } from '@alife/next';

import './index.scss';
export default class LeftPlugin extends PureComponent {
  static displayName = 'lowcodeLeftPlugin';

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
    // const { config } = this.props;
    // const addonKey = config && config.addonKey;
    // const appHelper = this.appHelper;
    // if (appHelper && addonKey) {
    //   appHelper.on(`${addonKey}.dialog.show`, this.handleShow);
    //   appHelper.on(`${addonKey}.dialog.close`, this.handleClose);
    // }
  }

  componentWillUnmount() {
    // const { config } = this.props;
    // const appHelper = this.appHelper;
    // const addonKey = config && config.addonKey;
    // if (appHelper && addonKey) {
    //   appHelper.off(`${addonKey}.dialog.show`, this.handleShow);
    //   appHelper.off(`${addonKey}.dialog.close`, this.handleClose);
    // }
  }

  handleClose = () => {
    // const addonKey = this.props.config && this.props.config.addonKey;
    // const currentAddon =
    //   this.appHelper.addons && this.appHelper.addons[addonKey];
    // if (currentAddon) {
    //   this.utils.transformToPromise(currentAddon.close()).then(() => {
    //     this.setState({
    //       dialogVisible: false,
    //     });
    //   });
    // }
  };

  handleOpen = () => {
    // todo 对话框类型的插件初始时拿不到插件实例
    this.setState({
      dialogVisible: true,
    });
  };

  handleShow = () => {
    // const { disabled, config, onClick } = this.props;
    // const addonKey = config && config.addonKey;
    // if (disabled || !addonKey) return;
    // //考虑到弹窗情况，延时发送消息
    // setTimeout(() => this.appHelper.emit(`${addonKey}.addon.activate`), 0);
    // this.handleOpen();
    // onClick && onClick();
  };

  renderIcon = clickCallback => {
    const {
      active,
      disabled,
      dotted,
      locked,
      onClick,
      config,
      editor,
    } = this.props;
    const { pluginKey, props } = config || {};
    const { icon, title } = props || {};
    return (
      <div
        className={classNames('lowcode-left-plugin', pluginKey, {
          active,
          disabled,
          locked,
        })}
        data-tooltip={title}
        onClick={() => {
          if (disabled) return;
          //考虑到弹窗情况，延时发送消息
          clickCallback && clickCallback();
          onClick && onClick();
        }}
      >
        {dotted ? (
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
    const {
      dotted,
      locked,
      active,
      disabled,
      config,
      editor,
      pluginClass: Comp,
    } = this.props;
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
        return dotted ? <Badge dot>{node}</Badge> : node;
      default:
        return null;
    }
  }
}
