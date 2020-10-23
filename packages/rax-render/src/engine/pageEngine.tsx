// @ts-nocheck

import { createElement } from 'rax';
import PropTypes from 'prop-types';
import Debug from 'debug';
import classnames from 'classnames';
import AppContext from '../context/appContext';
import { isSchema, getFileCssName } from '../utils';
import BaseEngine from './base';

const debug = Debug('engine:page');

export default class PageEngine extends BaseEngine {
  static dislayName = 'page-engine';

  static propTypes = {
    __schema: PropTypes.object,
  };

  static defaultProps = {
    __schema: {},
  };

  static contextType = AppContext;

  static getDerivedStateFromProps(props, state) {
    debug('page.getDerivedStateFromProps');
    const func = props.__schema.lifeCycles && props.__schema.lifeCycles.getDerivedStateFromProps;
    if (func) {
      return func(props, state);
    }
    return null;
  }

  constructor(props, context) {
    super(props, context);
    this.__generateCtx({
      page: this,
    });
    const schema = props.__schema || {};
    this.state = this.__parseData(schema.state || {});

    this.__initDataSource(props);
    this.__setLifeCycleMethods('constructor', arguments);

    debug(`page.constructor - ${schema.fileName}`);
  }

  async getSnapshotBeforeUpdate() {
    super.getSnapshotBeforeUpdate(...arguments);
    debug(`page.getSnapshotBeforeUpdate - ${this.props.__schema.fileName}`);
  }

  async componentDidMount() {
    super.componentDidMount(...arguments);
    debug(`page.componentDidMount - ${this.props.__schema.fileName}`);
  }

  async componentDidUpdate() {
    super.componentDidUpdate(...arguments);
    debug(`page.componentDidUpdate - ${this.props.__schema.fileName}`);
  }

  async componentWillUnmount() {
    super.componentWillUnmount(...arguments);
    debug(`page.componentWillUnmount - ${this.props.__schema.fileName}`);
  }

  async componentDidCatch() {
    await super.componentDidCatch(...arguments);
    debug(`page.componentDidCatch - ${this.props.__schema.fileName}`);
  }

  render() {
    const { __schema, __components } = this.props;
    if (!isSchema(__schema, true) || __schema.componentName !== 'Page') {
      return '页面schema结构异常！';
    }
    debug(`page.render - ${__schema.fileName}`);

    const {
      id, className, style,
    } = this.__parseData(__schema.props);

    const { Page } = __components;
    if (Page) {
      // const { engine } = this.context || {};
      return (
        <AppContext.Consumer>
          {(context) => {
            this.context = context;
            this.__render();
            return (
              <AppContext.Provider
                value={{
                  ...this.context,
                  pageContext: this,
                  blockContext: this,
                }}
              >
                {this.context.engine.createElement(
                  Page,
                  {
                    ...this.props,
                    ref: this.__getRef,
                    className: classnames(getFileCssName(__schema.fileName), className, this.props.className),
                    __id: __schema.id,
                  },
                  this.__createDom(),
                )}
              </AppContext.Provider>
            );
          }}
        </AppContext.Consumer>
      );
    }

    const renderContent = () => (
      <AppContext.Provider
        value={{
          ...this.context,
          pageContext: this,
          blockContext: this,
        }}
      >
        {this.__createDom()}
      </AppContext.Provider>
    );

    // if (autoLoading || loading !== undefined) {
    //   return (
    //     <Loading
    //       size="medium"
    //       visible={!!(this.__showPlaceholder || loading)}
    //       style={{
    //         height: this.__showPlaceholder ? defaultHeight : 'auto',
    //         display: 'block',
    //         ...style,
    //       }}
    //       className={classnames('luna-page', getFileCssName(__schema.fileName), className, this.props.className)}
    //       id={id}
    //     >
    //       {!this.__showPlaceholder && renderContent()}
    //     </Loading>
    //   );
    // }

    return (
      <div
        ref={this.__getRef}
        className={classnames('luna-page', getFileCssName(__schema.fileName), className, this.props.className)}
        id={id}
        style={style}
      >
        {renderContent()}
      </div>
    );
  }
}
