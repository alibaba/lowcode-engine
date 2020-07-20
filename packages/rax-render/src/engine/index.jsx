import { Component, createElement } from 'rax';
import PropTypes from 'prop-types';
import Debug from 'debug';
import * as isEmpty from 'lodash/isEmpty';
import findDOMNode from 'rax-find-dom-node';
import { isFileSchema, goldlog } from '../utils';
import AppContext from '../context/appContext';
import Page from './pageEngine';
import CustomComp from './compEngine';
import Block from './blockEngine';
import Temp from './tempEngine';

const debug = Debug('engine:entry');
const ENGINE_COMPS = {
  Page,
  Component: CustomComp,
  Block,
  Temp,
};
export default class Engine extends Component {
  static dislayName = 'engine';
  static propTypes = {
    appHelper: PropTypes.object,
    components: PropTypes.object,
    componentsMap: PropTypes.object,
    designMode: PropTypes.string,
    suspended: PropTypes.bool,
    schema: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    onCompGetRef: PropTypes.func,
    onCompGetCtx: PropTypes.func
  };
  static defaultProps = {
    appHelper: null,
    components: {},
    componentsMap: {},
    designMode: '',
    suspended: false,
    schema: {},
    onCompGetRef: () => {},
    onCompGetCtx: () => {}
  };

  constructor(props, context) {
    super(props, context);
    this.state = {};
    debug(`entry.constructor - ${props.schema && props.schema.componentName}`);
  }

  async componentDidMount() {
    goldlog(
      'EXP',
      {
        action: 'appear',
        value: !!this.props.designMode
      },
      'engine'
    );
    debug(`entry.componentDidMount - ${this.props.schema && this.props.schema.componentName}`);
  }

  async componentDidUpdate() {
    debug(`entry.componentDidUpdate - ${this.props.schema && this.props.schema.componentName}`);
  }

  async componentWillUnmount() {
    debug(`entry.componentWillUnmount - ${this.props.schema && this.props.schema.componentName}`);
  }

  async componentDidCatch(e) {
    console.warn(e);
  }

  shouldComponentUpdate(nextProps) {
    return !nextProps.suspended;
  }

  __getRef = ref => {
    this.__ref = ref;
    if (ref) {
      this.props.onCompGetRef(this.props.schema, ref, true);
    }
  };

  render() {
    const { schema, designMode, appHelper, components, componentsMap } = this.props;
    if (isEmpty(schema)) {
      return null;
    }
    if (!isFileSchema(schema)) {
      return '模型结构异常';
    }
    debug('entry.render');
    const allComponents = { ...ENGINE_COMPS, ...components };
    const Comp = allComponents[schema.componentName];
    if (Comp) {
      return (
        <AppContext.Provider
          value={{
            appHelper,
            components: allComponents,
            componentsMap,
            engine: this
          }}
        >
          <Comp
            key={schema.__ctx && `${schema.__ctx.lunaKey}_${schema.__ctx.idx || '0'}`}
            ref={this.__getRef}
            __appHelper={appHelper}
            __components={allComponents}
            __componentsMap={componentsMap}
            __schema={schema}
            __designMode={designMode}
            {...this.props}
          />
        </AppContext.Provider>
      );
    }
    return null;
  }
}

Engine.findDOMNode = findDOMNode;
