import React, { Component, PureComponent, createElement as reactCreateElement } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Debug from 'debug';
import AppContext from '../context/appContext';
import { isFileSchema, goldlog } from '../utils';
import PageEngine from './pageEngine';
import ComponentEngine from './compEngine';
import BlockEngine from './blockEngine';
import AddonEngine from './addonEngine';
import TempEngine from './tempEngine';
import { isEmpty } from '@ali/b3-one/lib/obj';
import BaseEngine from './base';
import Div from '@ali/iceluna-comp-div';

window.React = React;
window.ReactDom = ReactDOM;

const debug = Debug('engine:entry');
const ENGINE_COMPS = {
  PageEngine,
  ComponentEngine,
  BlockEngine,
  AddonEngine,
  TempEngine,
  DivEngine: BlockEngine,
};

class FaultComponent extends PureComponent {
  render() {
    // FIXME: errorlog
    console.error('render error', this.props);
    return <Div>RenderError</Div>;
  }
}

class NotFoundComponent extends PureComponent {
  render() {
    console.error('component not found', this.props);
    return <Div {...this.props} />;
  }
}

function isReactClass(obj) {
  return obj && obj.prototype && (obj.prototype.isReactComponent || obj.prototype instanceof Component);
}

export default class Engine extends PureComponent {
  static dislayName = 'engine';
  static propTypes = {
    appHelper: PropTypes.object,
    components: PropTypes.object,
    designMode: PropTypes.string,
    suspended: PropTypes.bool,
    schema: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    onCompGetRef: PropTypes.func,
    onCompGetCtx: PropTypes.func,
    customCreateElement: PropTypes.func,
  };
  static defaultProps = {
    appHelper: null,
    components: {},
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

  __getRef = (ref) => {
    this.__ref = ref;
    if (ref) {
      this.props.onCompGetRef(this.props.schema, ref, true);
    }
  };

  patchDidCatch(Component) {
    if (!isReactClass(Component)) {
      return;
    }
    if (Component.patchedCatch) {
      return;
    }
    Component.patchedCatch = true;
    Component.getDerivedStateFromError = (error) => {
      return { engineRenderError: true, error };
    };
    const engine = this;
    const originRender = Component.prototype.render;
    Component.prototype.render = function () {
      if (this.state && this.state.engineRenderError) {
        this.state.engineRenderError = false;
        return engine.createElement(engine.getFaultComponent(), {
          ...this.props,
          error: this.state.error,
        });
      }
      return originRender.call(this);
    };
    const originShouldComponentUpdate = Component.prototype.shouldComponentUpdate;
    Component.prototype.shouldComponentUpdate = function (nextProps, nextState) {
      if (nextState && nextState.engineRenderError) {
        return true;
      }
      return originShouldComponentUpdate ? originShouldComponentUpdate.call(this, nextProps, nextState) : true;
    };
  }

  createElement(Component, props, children) {
    // TODO: enable in runtime mode?s
    this.patchDidCatch(Component);
    return (this.props.customCreateElement || reactCreateElement)(Component, props, children);
  }
  getNotFoundComponent() {
    return this.props.notFoundComponent || NotFoundComponent;
  }
  getFaultComponent() {
    return this.props.faultComponent || FaultComponent;
  }

  render() {
    const { schema, designMode, appHelper, components, customCreateElement } = this.props;
    if (isEmpty(schema)) {
      return null;
    }
    // 兼容乐高区块模板
    if (schema.componentName !== 'Div' && !isFileSchema(schema)) {
      return '模型结构异常';
    }
    debug('entry.render');
    const { componentName } = schema;
    const allComponents = { ...ENGINE_COMPS, ...components };
    let Comp = allComponents[componentName] || ENGINE_COMPS[`${componentName}Engine`];
    if (Comp && Comp.prototype) {
      const proto = Comp.prototype;
      if (!(Comp.prototype instanceof BaseEngine)) {
        Comp = ENGINE_COMPS[`${componentName}Engine`];
      }
    }
    if (Comp) {
      return (
        <AppContext.Provider
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
            {...this.props}
          />
        </AppContext.Provider>
      );
    }
    return null;
  }
}

Engine.findDOMNode = ReactDOM.findDOMNode;
