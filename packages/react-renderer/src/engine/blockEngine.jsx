import React from 'react';
import PropTypes from 'prop-types';
import Debug from 'debug';
import classnames from 'classnames';
import Loading from '@alifd/next/lib/loading';
import '@alifd/next/lib/loading/style';

import BaseEngine from './base';
import AppContext from '../context/appContext';
import { isSchema, getFileCssName } from '../utils';
const debug = Debug('engine:block');
export default class BlockEngine extends BaseEngine {
  static dislayName = 'block-engine';
  static propTypes = {
    __schema: PropTypes.object,
  };
  static defaultProps = {
    __schema: {},
  };

  static getDerivedStateFromProps(props, state) {
    debug(`block.getDerivedStateFromProps`);
    const func = props.__schema.lifeCycles && props.__schema.lifeCycles.getDerivedStateFromProps;
    if (func) {
      return func(props, state);
    }
    return null;
  }

  constructor(props, context) {
    super(props, context);
    this.__generateCtx();
    const schema = props.__schema || {};
    this.state = this.__parseData(schema.state || {});
    this.__initDataSource(props);
    this.__setLifeCycleMethods('constructor', arguments);
    debug(`block.constructor - ${schema.fileName}`);
  }

  async getSnapshotBeforeUpdate() {
    super.getSnapshotBeforeUpdate(...arguments);
    debug(`block.getSnapshotBeforeUpdate - ${this.props.__schema.fileName}`);
  }
  async componentDidMount() {
    super.componentDidMount(...arguments);
    debug(`block.componentDidMount - ${this.props.__schema.fileName}`);
  }
  async componentDidUpdate() {
    super.componentDidUpdate(...arguments);
    debug(`block.componentDidUpdate - ${this.props.__schema.fileName}`);
  }
  async componentWillUnmount() {
    super.componentWillUnmount(...arguments);
    debug(`block.componentWillUnmount - ${this.props.__schema.fileName}`);
  }
  async componentDidCatch() {
    await super.componentDidCatch(...arguments);
    debug(`block.componentDidCatch - ${this.props.__schema.fileName}`);
  }

  render() {
    const { __schema, __components } = this.props;

    if (!isSchema(__schema, true) || (__schema.componentName !== 'Block' && __schema.componentName !== 'Div')) {
      return '区块schema结构异常！';
    }

    debug(`block.render - ${__schema.fileName}`);
    this.__generateCtx();
    this.__render();

    const props = this.__parseData(__schema.props);
    const { id, className, style, autoLoading, defaultHeight = 300, loading } = props;

    const { Block } = __components;
    if (Block) {
      const { engine } = this.context || {};
      return (
        <AppContext.Provider
          value={{
            ...this.context,
            blockContext: this,
          }}
        >
          {engine.createElement(
            Block,
            {
              ...props,
              ref: this.__getRef,
              className: classnames(getFileCssName(__schema.fileName), className, this.props.className),
              __id: __schema.id,
            },
            this.__createDom(),
          )}
        </AppContext.Provider>
      );
    }
    
    const renderContent = () => (
      <AppContext.Provider
        value={{
          ...this.context,
          blockContext: this,
        }}
      >
        {this.__createDom()}
      </AppContext.Provider>
    );

    if (autoLoading || loading !== undefined) {
      return (
        <Loading
          size="medium"
          visible={!!(this.__showPlaceholder || loading)}
          style={{
            height: this.__showPlaceholder ? defaultHeight : 'auto',
            display: 'block',
            ...style,
          }}
          className={classnames('luna-block', getFileCssName(__schema.fileName), className, this.props.className)}
          id={id}
        >
          {!this.__showPlaceholder && renderContent()}
        </Loading>
      );
    }

    return (
      <div
        ref={this.__getRef}
        className={classnames('luna-block', getFileCssName(__schema.fileName), className, this.props.className)}
        id={id}
        style={style}
      >
        {renderContent()}
      </div>
    );
  }
}
