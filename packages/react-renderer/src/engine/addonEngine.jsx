import React from 'react';
import PropTypes from 'prop-types';
import Debug from 'debug';
import AppContext from '../context/appContext';
import classnames from 'classnames';
import BaseEngine from './base';
import { isSchema, getFileCssName, isEmpty, goldlog } from '../utils';
const debug = Debug('engine:addon');
export default class AddonEngine extends BaseEngine {
  static dislayName = 'addon-engine';
  static propTypes = {
    config: PropTypes.object,
    __schema: PropTypes.object
  };
  static defaultProps = {
    config: {},
    __schema: {}
  };

  static getDerivedStateFromProps(props, state) {
    debug(`comp.getDerivedStateFromProps`);
    const func = props.__schema.lifeCycles && props.__schema.lifeCycles.getDerivedStateFromProps;
    if (func) {
      return func(props, state);
    }
    return null;
  }

  constructor(props, context) {
    super(props, context);
    this.__generateCtx({
      component: this
    });
    const schema = props.__schema || {};
    this.state = this.__parseData(schema.state || {});
    if (isEmpty(props.config) || !props.config.addonKey) {
      console.warn('luna addon has wrong config');
      this.state.__hasError = true;
      return;
    }
    // 注册插件
    this.addonKey = props.config.addonKey;
    this.appHelper.addons = this.appHelper.addons || {};
    this.appHelper.addons[this.addonKey] = this;
    this.__initDataSource(props);
    this.open = this.open || (() => {});
    this.close = this.close || (() => {});
    this.__setLifeCycleMethods('constructor', arguments);
    debug(`addon.constructor - ${schema.fileName}`);
  }

  async getSnapshotBeforeUpdate() {
    super.getSnapshotBeforeUpdate(...arguments);
    debug(`addon.getSnapshotBeforeUpdate - ${this.props.__schema.fileName}`);
  }
  async componentDidMount() {
    super.componentDidMount(...arguments);
    debug(`addon.componentDidMount - ${this.props.__schema.fileName}`);
  }
  async componentDidUpdate() {
    super.componentDidUpdate(...arguments);
    debug(`addon.componentDidUpdate - ${this.props.__schema.fileName}`);
  }
  async componentWillUnmount() {
    super.componentWillUnmount(...arguments);
    // 注销插件
    const config = this.props.config || {};
    if (config && this.appHelper.addons) {
      delete this.appHelper.addons[config.addonKey];
    }
    debug(`addon.componentWillUnmount - ${this.props.__schema.fileName}`);
  }
  async componentDidCatch(e) {
    super.componentDidCatch(...arguments);
    debug(`addon.componentDidCatch - ${this.props.__schema.fileName}`);
  }

  goldlog = (goKey, params) => {
    const { addonKey, addonConfig = {} } = this.props.config || {};
    goldlog(
      goKey,
      {
        addonKey,
        package: addonConfig.package,
        version: addonConfig.version,
        ...this.appHelper.logParams,
        ...params
      },
      'addon'
    );
  };

  get utils() {
    const { utils = {} } = this.context.config || {};
    return { ...this.appHelper.utils, ...utils };
  }

  render() {
    const { __schema } = this.props;

    if (!isSchema(__schema, true) || __schema.componentName !== 'Addon') {
      return '插件schema结构异常！';
    }

    debug(`addon.render - ${__schema.fileName}`);
    this.__generateCtx({
      component: this
    });
    this.__render();

    const { id, className, style } = this.__parseData(__schema.props);
    return (
      <div
        ref={this.__getRef}
        className={classnames('luna-addon', getFileCssName(__schema.fileName), className, this.props.className)}
        id={this.props.id || id}
        style={{ ...style, ...this.props.style }}
      >
        <AppContext.Provider
          value={{
            ...this.context,
            compContext: this,
            blockContext: this
          }}
        >
          {this.__createDom()}
        </AppContext.Provider>
      </div>
    );
  }
}
