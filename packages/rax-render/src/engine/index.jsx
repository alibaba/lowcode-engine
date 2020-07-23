/* eslint-disable */
import { Component, createElement } from 'rax';
import PropTypes from 'prop-types';
import Debug from 'debug';
import isEmpty from 'lodash/isEmpty';
import findDOMNode from 'rax-find-dom-node';
import { isFileSchema, goldlog } from '../utils';
import AppContext from '../context/appContext';
import PageEngine from './pageEngine';
import ComponentEngine from './compEngine';
import BlockEngine from './blockEngine';
import TempEngine from './tempEngine';
import BaseEngine from './base';
import compWrapper from '../hoc/compWrapper';

const debug = Debug('engine:entry');
const ENGINE_COMPS = {
  PageEngine,
  ComponentEngine,
  BlockEngine,
  TempEngine,
};

const raxCreateElement = createElement;

class FaultComponent extends Component {
  render() {
    // FIXME: errorlog
    console.error('render error', this.props);
    return <div>RenderError</div>;
  }
}

class NotFoundComponent extends Component {
  render() {
    console.error('component not found', this.props);
    return <div {...this.props} />;
  }
}

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
    onCompGetCtx: PropTypes.func,
    customCreateElement: PropTypes.func,
    notFoundComponent: PropTypes.element,
    faultComponent: PropTypes.element,
  };

  static defaultProps = {
    appHelper: null,
    components: {},
    componentsMap: {},
    designMode: '',
    suspended: false,
    schema: {},
    onCompGetRef: () => {},
    onCompGetCtx: () => {},
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
        value: !!this.props.designMode,
      },
      'engine',
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

  getNotFoundComponent() {
    const { notFoundComponent } = this.props;
    return notFoundComponent || NotFoundComponent;
  }

  getFaultComponent() {
    const { faultComponent } = this.props;
    return faultComponent || FaultComponent;
  }

  __getRef = (ref) => {
    const { schema, onCompGetRef } = this.props;
    this.__ref = ref;
    if (ref) {
      onCompGetRef(schema, ref, true);
    }
  };

  patchDidCatch(Comp) {
    if (Comp.patchedCatch) {
      return;
    }
    Comp.patchedCatch = true;// eslint-disable-line
    Comp.getDerivedStateFromError = (error) => ({ engineRenderError: true, error });// eslint-disable-line
    // const engine = this;
    const originRender = Comp.prototype.render;
    Comp.prototype.render = function() {
      if (this.state && this.state.engineRenderError) {
        this.state.engineRenderError = false;
        return engine.createElement(engine.getFaultComponent(), {
          ...this.props,
          error: this.state.error,
        });
      }
      return originRender.call(this);
    };
    const originShouldComponentUpdate = Comp.prototype.shouldComponentUpdate;
    Comp.prototype.shouldComponentUpdate = (nextProps, nextState) => {// eslint-disable-line
      if (nextState && nextState.engineRenderError) {
        return true;
      }
      return originShouldComponentUpdate ? originShouldComponentUpdate.call(this, nextProps, nextState) : true;// eslint-disable-line
    };
  }

  createElement(Comp, props, children) {
    const { customCreateElement } = this.props;
    // TODO: enable in runtime mode?
    this.patchDidCatch(Component);
    return (customCreateElement || raxCreateElement)(Comp, props, children);
  }

  render() {
    const { schema, designMode, appHelper, components } = this.props;
    if (isEmpty(schema)) {
      return null;
    }
    if (!isFileSchema(schema)) {
      return '模型结构异常';
    }
    debug('entry.render');
    const allComponents = { ...ENGINE_COMPS, ...components };
    const { componentName } = schema;
    // const Comp = allComponents[schema.componentName];
    let Comp = allComponents[componentName] || ENGINE_COMPS[`${componentName}Engine`];
    if (Comp && Comp.prototype) {
      // const proto = Comp.prototype;
      if (!(Comp.prototype instanceof BaseEngine)) {
        Comp = ENGINE_COMPS[`${componentName}Engine`];
      }
    }

    return (
      Comp
      ? <AppContext.Provider
          value={{
            appHelper,
            components: allComponents,
            engine: this,
          }}
        >
          <Comp
            key={schema.__ctx && `${schema.__ctx.lunaKey}_${schema.__ctx.idx || '0'}`}
            ref={this.__getRef}
            __appHelper={appHelper}
            __components={allComponents}
            __schema={schema}
            __designMode={designMode}
            // __id={schema.id}
            {...this.props}
          />
        </AppContext.Provider>
      : null
    );
  }
}

Engine.findDOMNode = findDOMNode;
