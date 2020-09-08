import React from 'react';
import PropTypes from 'prop-types';
import Debug from 'debug';
import classnames from 'classnames';
import Loading from '@alifd/next/lib/loading';
import '@alifd/next/lib/loading/style';
import AppContext from '../context/appContext';
import BaseRenderer from './base';
import { isSchema, getFileCssName } from '../utils';

const debug = Debug('renderer:comp');

export default class CompRenderer extends BaseRenderer {
  static dislayName = 'comp-renderer';
  static propTypes = {
    __schema: PropTypes.object,
  };
  static defaultProps = {
    __schema: {},
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
      component: this,
    });
    const schema = props.__schema || {};
    this.state = this.__parseData(schema.state || {});
    this.__initDataSource(props);
    this.__setLifeCycleMethods('constructor', arguments);
    debug(`comp.constructor - ${schema.fileName}`);
  }

  async getSnapshotBeforeUpdate() {
    super.getSnapshotBeforeUpdate(...arguments);
    debug(`comp.getSnapshotBeforeUpdate - ${this.props.__schema.fileName}`);
  }
  async componentDidMount() {
    super.componentDidMount(...arguments);
    debug(`comp.componentDidMount - ${this.props.__schema.fileName}`);
  }
  async componentDidUpdate() {
    super.componentDidUpdate(...arguments);
    debug(`comp.componentDidUpdate - ${this.props.__schema.fileName}`);
  }
  async componentWillUnmount() {
    super.componentWillUnmount(...arguments);
    debug(`comp.componentWillUnmount - ${this.props.__schema.fileName}`);
  }
  async componentDidCatch(e) {
    super.componentDidCatch(...arguments);
    debug(`comp.componentDidCatch - ${this.props.__schema.fileName}`);
  }

  render() {
    const { __schema } = this.props;

    if (!isSchema(__schema, true) || __schema.componentName !== 'Component') {
      return '自定义组件schema结构异常！';
    }

    debug(`comp.render - ${__schema.fileName}`);
    this.__generateCtx({
      component: this,
    });
    this.__render();

    const { id, className, style, noContainer, autoLoading, defaultHeight = 300, loading } = this.__parseData(
      __schema.props,
    );
    const renderContent = () => (
      <AppContext.Provider
        value={{
          ...this.context,
          compContext: this,
          blockContext: this,
        }}
      >
        {this.__createDom()}
      </AppContext.Provider>
    );

    if (noContainer) {
      return renderContent();
    }
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
          className={classnames('luna-comp', getFileCssName(__schema.fileName), className, this.props.className)}
          id={this.props.id || id}
        >
          {!this.__showPlaceholder && renderContent()}
        </Loading>
      );
    }
    return (
      <div
        ref={this.__getRef}
        className={classnames('luna-comp', getFileCssName(__schema.fileName), className, this.props.className)}
        id={this.props.id || id}
        style={{ ...style, ...this.props.style }}
      >
        {renderContent()}
      </div>
    );
  }
}
