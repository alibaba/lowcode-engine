import { createElement } from 'rax';
import PropTypes from 'prop-types';
import Debug from 'debug';
import classnames from 'classnames';
import { isSchema, getFileCssName } from '@ali/iceluna-sdk/lib/utils';
import BaseEngine from './base';

const debug = Debug('engine:comp');

export default class CompEngine extends BaseEngine {
  static dislayName = 'comp-engine';
  static propTypes = {
    __schema: PropTypes.object
  };
  static defaultProps = {
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

    const { id, className, style, noContainer } = this.__parseData(__schema.props);

    if (noContainer) {
      return this.__createContextDom(
        {
          compContext: this,
          blockContext: this
        },
        {
          component: this
        }
      );
    }

    return (
      <div
        ref={this.__getRef}
        className={classnames('luna-comp', getFileCssName(__schema.fileName), className, this.props.className)}
        id={this.props.id || id}
        style={{ ...style, ...this.props.style }}
      >
        {this.__createContextDom(
          {
            compContext: this,
            blockContext: this
          },
          {
            component: this
          }
        )}
      </div>
    );
  }
}
