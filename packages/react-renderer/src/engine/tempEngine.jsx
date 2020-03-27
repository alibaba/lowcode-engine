import React from 'react';
import PropTypes from 'prop-types';
import Debug from 'debug';
import AppContext from '../context/appContext';
import BaseEngine from './base';
import { isSchema } from '../utils';
const debug = Debug('engine:temp');
export default class TempEngine extends BaseEngine {
  static dislayName = 'temp-engine';
  static propTypes = {
    __ctx: PropTypes.object,
    __schema: PropTypes.object,
  };
  static defaultProps = {
    __ctx: {},
    __schema: {},
  };

  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.cacheSetState = {};
    debug(`temp.constructor - ${props.__schema.fileName}`);
  }

  componentDidMount() {
    const ctx = this.props.__ctx;
    if (!ctx) return;
    const setState = ctx.setState;
    this.cacheSetState = setState;
    ctx.setState = (...args) => {
      setState.call(ctx, ...args);
      setTimeout(() => this.forceUpdate(), 0);
    };
    debug(`temp.componentDidMount - ${this.props.__schema.fileName}`);
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    debug(`temp.componentDidUpdate - ${this.props.__schema.fileName}`);
  }
  componentWillUnmount() {
    const ctx = this.props.__ctx;
    if (!ctx || !this.cacheSetState) return;
    ctx.setState = this.cacheSetState;
    delete this.cacheSetState;
    debug(`temp.componentWillUnmount - ${this.props.__schema.fileName}`);
  }
  componentDidCatch(e) {
    console.warn(e);
    debug(`temp.componentDidCatch - ${this.props.__schema.fileName}`);
  }

  render() {
    const { __schema, __ctx } = this.props;
    if (!isSchema(__schema, true) || __schema.componentName !== 'Temp') {
      return '下钻编辑schema结构异常！';
    }

    debug(`temp.render - ${__schema.fileName}`);

    return (
      <div ref={this.__getRef} className="luna-temp">
        <AppContext.Provider value={{ ...this.context, ...__ctx }}>{this.__createDom()}</AppContext.Provider>
      </div>
    );
  }
}
