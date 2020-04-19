import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Debug from 'debug';
import AppContext from '../context/appContext';
import { isFileSchema, goldlog } from '../utils';
import Page from './pageEngine';
import Component from './compEngine';
import Block from './blockEngine';
import Addon from './addonEngine';
import Temp from './tempEngine';
import { isEmpty } from '@ali/b3-one/lib/obj';

window.React = React;
window.ReactDom = ReactDOM;

const debug = Debug('engine:entry');
const ENGINE_COMPS = {
  Page,
  Component,
  Block,
  Addon,
  Temp,
};
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
    const Comp = allComponents[schema.componentName];
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
