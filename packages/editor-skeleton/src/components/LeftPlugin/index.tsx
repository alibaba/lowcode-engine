import React, { PureComponent, Fragment } from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';
import AppContext from '@ali/iceluna-sdk/lib/context/appContext';
import { Balloon, Dialog, Icon, Badge } from '@alife/next';

import './index.scss';
export default class LeftAddon extends PureComponent {
  static displayName = 'LunaLeftAddon';
  static propTypes = {
    active: PropTypes.bool,
    config: PropTypes.shape({
      addonKey: PropTypes.string,
      addonProps: PropTypes.object,
      props: PropTypes.object,
      type: PropTypes.oneOf([
        'DialogIcon',
        'BalloonIcon',
        'PanelIcon',
        'LinkIcon',
        'Icon',
        'Custom',
      ]),
    }),
    disabled: PropTypes.bool,
    dotted: PropTypes.bool,
    locked: PropTypes.bool,
    onClick: PropTypes.func,
  };
  static defaultProps = {
    active: false,
    config: {},
    disabled: false,
    dotted: false,
    locked: false,
    onClick: () => {},
  };
  static contextType = AppContext;

  constructor(props, context) {
    super(props, context);
    this.state = {
      dialogVisible: false,
    };
    this.appHelper = context.appHelper;
    this.utils = this.appHelper.utils;
    this.constants = this.appHelper.constants;
  }

  componentDidMount() {
    const { config } = this.props;
    const addonKey = config && config.addonKey;
    const appHelper = this.appHelper;
    if (appHelper && addonKey) {
      appHelper.on(`${addonKey}.dialog.show`, this.handleShow);
      appHelper.on(`${addonKey}.dialog.close`, this.handleClose);
    }
  }

  componentWillUnmount() {
    const { config } = this.props;
    const appHelper = this.appHelper;
    const addonKey = config && config.addonKey;
    if (appHelper && addonKey) {
      appHelper.off(`${addonKey}.dialog.show`, this.handleShow);
      appHelper.off(`${addonKey}.dialog.close`, this.handleClose);
    }
  }

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
    // todo 对话框类型的插件初始时拿不到插件实例
    this.setState({
      dialogVisible: true,
    });
  };

  handleShow = () => {
    const { disabled, config, onClick } = this.props;
    const addonKey = config && config.addonKey;
    if (disabled || !addonKey) return;
    //考虑到弹窗情况，延时发送消息
    setTimeout(() => this.appHelper.emit(`${addonKey}.addon.activate`), 0);
    this.handleOpen();
    onClick && onClick();
  };

  renderIcon = clickCallback => {
    const { active, disabled, dotted, locked, onClick, config } = this.props;
    const { addonKey, props } = config || {};
    const { icon, title } = props || {};
    return (
      <div
        className={classNames('luna-left-addon', addonKey, {
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
    const { dotted, locked, active, disabled, config } = this.props;
    const { addonKey, props, type, addonProps } = config || {};
    const { onClick, title } = props || {};
    const { dialogVisible } = this.state;
    const { appHelper, components } = this.context;
    if (!addonKey || !type || !props) return null;
    const componentName = appHelper.utils.generateAddonCompName(addonKey);
    const localeProps = {};
    const { locale, messages } = appHelper;
    if (locale) {
      localeProps.locale = locale;
    }
    if (messages && messages[componentName]) {
      localeProps.messages = messages[componentName];
    }
    const AddonComp = components && components[componentName];
    const node =
      (AddonComp && (
        <AddonComp
          active={active}
          locked={locked}
          disabled={disabled}
          config={config}
          onClick={() => {
            onClick && onClick.call(null, appHelper);
          }}
          {...localeProps}
          {...(addonProps || {})}
        />
      )) ||
      null;

    switch (type) {
      case 'LinkIcon':
        return (
          <a {...(props.linkProps || {})}>
            {this.renderIcon(() => {
              onClick && onClick.call(null, appHelper);
            })}
          </a>
        );
      case 'Icon':
        return this.renderIcon(() => {
          onClick && onClick.call(null, appHelper);
        });
      case 'DialogIcon':
        return (
          <Fragment>
            {this.renderIcon(() => {
              onClick && onClick.call(null, appHelper);
              this.handleOpen();
            })}
            <Dialog
              onOk={() => {
                appHelper.emit(`${addonKey}.dialog.onOk`);
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
              onClick && onClick.call(null, appHelper);
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
          onClick && onClick.call(null, appHelper);
          this.handleOpen();
        });
      case 'Custom':
        return dotted ? <Badge dot>{node}</Badge> : node;
      default:
        return null;
    }
  }
}
