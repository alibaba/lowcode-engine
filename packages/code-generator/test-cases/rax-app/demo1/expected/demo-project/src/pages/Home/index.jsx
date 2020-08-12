import { createElement, Component } from 'rax';

import Page from 'rax-view';

import Text from 'rax-text';

import { createDataSourceEngine } from '@ali/lowcode-datasource-engine';

import './index.css';

class Home$$Page extends Component {
  _context = this._createContext();

  _dataSourceList = this._defineDataSourceList();
  _dataSourceEngine = createDataSourceEngine(this._dataSourceList, this._context);

  _utils = this._defineUtils();

  componentDidMount() {
    this._dataSourceEngine.reloadDataSource();
  }

  render() {
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
        return self._dataSourceEngine?.dataSourceMap || {};
      },
      async reloadDataSource() {
        self._dataSourceEngine?.reloadDataSource();
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
    return {};
  }
}

export default Home$$Page;
