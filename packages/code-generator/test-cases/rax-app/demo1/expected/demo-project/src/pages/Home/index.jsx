import { createElement, Component } from 'rax';

import Page from 'rax-view';

import Text from 'rax-text';

import { createDataSourceEngine } from '@ali/lowcode-datasource-engine';

import __$$projectUtils from '../../utils';

import './index.css';

class Home$$Page extends Component {
  _methods = this._defineMethods();

  _context = this._createContext();

  _dataSourceList = this._defineDataSourceList();
  _dataSourceEngine = createDataSourceEngine(this._dataSourceList, this._context);

  _utils = this._defineUtils();

  componentDidMount() {
    this._dataSourceEngine.reloadDataSource();
  }

  render() {
    const __$$context = this._context;

    return (
      <Page>
        <Text>Hello world!</Text>
      </Page>
    );
  }

  _createContext() {
    const self = this;

    const context = {
      get state() {
        return self.state;
      },
      setState(newState) {
        self.setState(newState);
      },
      get dataSourceMap() {
        return self._dataSourceEngine.dataSourceMap || {};
      },
      async reloadDataSource() {
        self._dataSourceEngine.reloadDataSource();
      },
      get utils() {
        return self._utils;
      },
      get page() {
        return context;
      },
      get component() {
        return context;
      },
      get props() {
        return self.props;
      },
    };

    return context;
  }

  _defineDataSourceList() {
    return [];
  }

  _defineUtils() {
    const utils = {
      ...__$$projectUtils,
    };

    Object.entries(utils).forEach(([name, util]) => {
      if (typeof util === 'function') {
        utils[name] = util.bind(this._context);
      }
    });

    return utils;
  }

  _defineMethods() {
    return {};
  }
}

export default Home$$Page;

function __$$eval(expr) {
  try {
    return expr();
  } catch (err) {
    console.warn('Failed to evaluate: ', expr, err);
  }
}

function __$$evalArray(expr) {
  const res = __$$eval(expr);
  return Array.isArray(res) ? res : [];
}
