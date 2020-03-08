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
    // if (appHelper && pluginKey) {
    //   appHelper.on(`${pluginKey}.dialog.show`, this.handleShow);
    //   appHelper.on(`${pluginKey}.dialog.close`, this.handleClose);
    // }
  }

  componentWillUnmount() {
    // const { config } = this.props;
    // const pluginKey = config && config.pluginKey;
    // const appHelper = this.appHelper;
    // if (appHelper && pluginKey) {
    //   appHelper.off(`${pluginKey}.dialog.show`, this.handleShow);
    //   appHelper.off(`${pluginKey}.dialog.close`, this.handleClose);
    // }
  }

  handleShow = () => {
    // const { disabled, config, onClick, editor } = this.props;
    // const pluginKey = config && config.pluginKey;
    // if (disabled || !pluginKey) return;
    // //考虑到弹窗情况，延时发送消息
    // setTimeout(() => editor.emit(`${pluginKey}.addon.activate`), 0);
    // this.handleOpen();
    // onClick && onClick();
  };

  handleClose = () => {
    // const pluginKey = this.props.config && this.props.config.pluginKey;
    // const currentAddon =
    //   this.appHelper.addons && this.appHelper.addons[pluginKey];
    // if (currentAddon) {
    //   this.utils.transformToPromise(currentAddon.close()).then(() => {
    //     this.setState({
    //       dialogVisible: false,
    //     });
    //   });
    // }
  };

  handleOpen = () => {
    // todo dialog类型的插件初始时拿不动插件实例
    this.setState({
      dialogVisible: true,
    });
  };

  renderIcon = clickCallback => {
    const {
      active,
      disabled,
      dotted,
      locked,
      config,
      onClick,
      editor,
    } = this.props;
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
          setTimeout(() => editor.emit(`${pluginKey}.addon.activate`), 0);
          clickCallback && clickCallback();
          onClick && onClick();
        }}
      />
    );
    return dotted ? <Badge dot>{node}</Badge> : node;
  };

  render() {
    const {
      active,
      dotted,
      locked,
      disabled,
      config,
      editor,
      pluginClass: Comp,
    } = this.props;
    const { pluginKey, pluginProps, props, type } = config || {};
    const { onClick, title } = props || {};
    const { dialogVisible } = this.state;
    if (!pluginKey || !type) return null;
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
