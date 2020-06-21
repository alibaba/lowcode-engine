import { createElement } from 'rax';
import PropTypes from 'prop-types';
import Debug from 'debug';
import classnames from 'classnames';
import { isSchema, getFileCssName } from '@ali/iceluna-sdk/lib/utils';
import BaseEngine from './base';

const debug = Debug('engine:page');

export default class PageEngine extends BaseEngine {
  static dislayName = 'page-engine';
  static propTypes = {
    __schema: PropTypes.object
  };
  static defaultProps = {
    __schema: {}
  };

  static getDerivedStateFromProps(props, state) {
    debug(`page.getDerivedStateFromProps`);
    const func = props.__schema.lifeCycles && props.__schema.lifeCycles.getDerivedStateFromProps;
    if (func) {
      return func(props, state);
    }
    return null;
  }

  constructor(props, context) {
    super(props, context);
    this.__generateCtx({
      page: this
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
    const { __schema } = this.props;
    if (!isSchema(__schema, true) || __schema.componentName !== 'Page') {
      return '页面schema结构异常！';
    }
    debug(`page.render - ${__schema.fileName}`);

    const { id, className, style } = this.__parseData(__schema.props);

    return (
      <div
        ref={this.__getRef}
        className={classnames('luna-page', getFileCssName(__schema.fileName), className, this.props.className)}
        id={id}
        style={style}
      >
        {this.__createContextDom(
          {
            pageContext: this,
            blockContext: this
          },
          {
            page: this
          }
        )}
      </div>
    );
  }
}
