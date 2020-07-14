import { createElement } from 'rax';
import PropTypes from 'prop-types';
import Debug from 'debug';
import classnames from 'classnames';
import { isSchema, getFileCssName } from '../utils';
import BaseEngine from './base';

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
    debug('block.getDerivedStateFromProps');
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
    const { __schema } = this.props;

    if (!isSchema(__schema, true) || __schema.componentName !== 'Block') {
      return '区块schema结构异常！';
    }

    debug(`block.render - ${__schema.fileName}`);

    const { id, className, style } = this.__parseData(__schema.props);

    return (
      <div
        // ref={this.__getRef}
        className={classnames('luna-block', getFileCssName(__schema.fileName), className, this.props.className)}
        id={id}
        style={style}
      >
        {this.__createContextDom({
          blockContext: this,
        })}
      </div>
    );
  }
}
