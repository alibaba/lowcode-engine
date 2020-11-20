import React, { Component, PureComponent, createElement as reactCreateElement } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Debug from 'debug';
import { ConfigProvider } from '@alifd/next';
import { isEmpty } from '@ali/b3-one/lib/obj';
import AppContext from './context/appContext';
import { isFileSchema, goldlog } from './utils';
import PageEngine from './renderer/page';
import ComponentEngine from './renderer/component';
import BlockEngine from './renderer/block';
import AddonEngine from './renderer/addon';
import TempEngine from './renderer/temp';
import BaseEngine from './renderer/base';
import Div from './components/Div';

window.React = React;
window.ReactDom = ReactDOM;

const debug = Debug('renderer:entry');
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
    return (
      <Div style={{
        width: '100%',
        height: '50px',
        lineHeight: '50px',
        textAlign: 'center',
        fontSize: '15px',
        color: '#ff0000',
        border: '2px solid #ff0000',
      }}
      >
        组件渲染异常，请查看控制台日志
      </Div>
    );
  }
}

class NotFoundComponent extends PureComponent {
  render() {
    console.error('component not found', this.props);
    return <Div {...this.props} >{this.props.children || 'Component Not Found'}</Div>;
  }
}

function isReactClass(obj) {
  return obj && obj.prototype && (obj.prototype.isReactComponent || obj.prototype instanceof Component);
}

export default class Renderer extends Component {
  static dislayName = 'renderer';

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

  patchDidCatch(SetComponent) {
    if (!isReactClass(SetComponent)) {
      return;
    }
    if (SetComponent.patchedCatch) {
      return;
    }
    SetComponent.patchedCatch = true;
    SetComponent.getDerivedStateFromError = (error) => {
      return { engineRenderError: true, error };
    };
    const engine = this;
    const originRender = SetComponent.prototype.render;
    SetComponent.prototype.render = function () {
      if (this.state && this.state.engineRenderError) {
        this.state.engineRenderError = false;
        return engine.createElement(engine.getFaultComponent(), {
          ...this.props,
          error: this.state.error,
        });
      }
      return originRender.call(this);
    };
    const originShouldComponentUpdate = SetComponent.prototype.shouldComponentUpdate;
    SetComponent.prototype.shouldComponentUpdate = function (nextProps, nextState) {
      if (nextState && nextState.engineRenderError) {
        return true;
      }
      return originShouldComponentUpdate ? originShouldComponentUpdate.call(this, nextProps, nextState) : true;
    };
  }

  createElement(SetComponent, props, children) {
    // TODO: enable in runtime mode?
    this.patchDidCatch(SetComponent);
    return (this.props.customCreateElement || reactCreateElement)(SetComponent, props, children);
  }

  getNotFoundComponent() {
    return this.props.notFoundComponent || NotFoundComponent;
  }

  getFaultComponent() {
    return this.props.faultComponent || FaultComponent;
  }

  render() {
    const { schema, designMode, appHelper, components } = this.props;
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
          <ConfigProvider device={this.props.device}>
            <Comp
              key={schema.__ctx && `${schema.__ctx.lunaKey}_${schema.__ctx.idx || '0'}`}
              ref={this.__getRef}
              __appHelper={appHelper}
              __components={allComponents}
              __schema={schema}
              __designMode={designMode}
              {...this.props}
            />
          </ConfigProvider>
        </AppContext.Provider>
      );
    }
    return null;
  }
}

Renderer.findDOMNode = ReactDOM.findDOMNode;
