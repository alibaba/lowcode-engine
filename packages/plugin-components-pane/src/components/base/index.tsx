import React from 'react';
import PropTypes from 'prop-types';
import { Search, Box } from '@alifd/next';
import Button from '../button';
import Card from '../card';
import $i18n from '../../i18n/index';
import { searchComponent, builtinSearchMap } from '../../utils';
import './index.less';

/**
 * 配置元素的操作类型
 * Draggable：可拖拽
 * Clickable：可点击
 * All：可拖拽也可点击
 */
export const AdditiveType = {
  Draggable: 'additive-drag',
  Clickable: 'additive-click',
  All: 'additive',
};

class Base extends React.Component {
  static propTypes = {
    metaData: PropTypes.array,
    className: PropTypes.string,
    registerAdditive: PropTypes.func,
    actions: PropTypes.array,
    getComponentInfo: PropTypes.func,
    enableSearch: PropTypes.bool,
    placeholder: PropTypes.string,
  };

  static defaultProps = {
    metaData: [],
    registerAdditive: () => {},
    className: '',
    renderCustomSnippet: null,
    actions: [],
    getComponentInfo: null,
    enableSearch: false,
    enableCard: true,
    enableReport: true,
    placeholder: '',
  };

  state = {
    searchText: '',
    currentCard: null,
    target: null,
    currentCardImage: '',
  };

  shell = null;
  isEmpty = false;
  mode = 'advance';
  searchMap = {};
  timer = null;
  isMouseEnterCard = false;


  UNSAFE_componentWillMount() {
    // TODO get remote search map
    this.searchMap = builtinSearchMap;
  }

  hasActions() {
    const { actions } = this.props;
    if (!actions || !Array.isArray(actions) || !actions.length) {
      return false;
    }
    return true;
  }

  onSearch(val) {
    this.setState({
      searchText: val,
      currentCard: null, // 清空卡片
    });
  }

  normalizeBundle(mode) {
    const { metaData } = this.props;
    const { searchText = '' } = this.state;
    const groupList = metaData.filter((comp, index) => {
      const { title = '', componentName = '', id = '' } = comp;
      if (!id) {
        comp.id = `${comp.componentName}_${index}`;
      }
      const query = searchText.toLowerCase();
      return (
        !![title, componentName].find(
          (it) => it.toLowerCase().indexOf(query) > -1
        ) || !!searchComponent(title, query, this.searchMap)
      );
    });

    if (mode === 'simple') {
      return groupList;
    }

    const bundle = {};
    // 按一定顺序排列
    groupList.forEach((m) => {
      const c = m.category || 'Others';
      if (!bundle[c]) {
        bundle[c] = [];
      }
      bundle[c].push(m);
    });
    return bundle;
  }

  renderEmptyData() {
    this.isEmpty = true;
    return (
      <Box direction="column" justify="center" align="center" className="ve-component-list-empty">
        <img src="//g.alicdn.com/uxcore/pic/empty.png" style={{ height: 100, width: 100 }} />
        <div style={{ lineHeight: 2 }}>
          <div>暂无组件，请在物料站点添加</div>
        </div>
      </Box>
    );
  }

  renderHeader() {
    const { placeholder } = this.props;
    return (
      <Search
        style={{ width: '100%' }}
        placeholder={placeholder || $i18n.get({ id: 'trunkPaneSearchComponent', dm: '搜索组件' })}
        shape="simple"
        size="medium"
        hasClear
        defaultValue={this.state.searchText}
        onChange={this.onSearch.bind(this)}
        onSearch={this.onSearch.bind(this)}
      />
    );
  }

  renderActions() {
    const { actions = [] } = this.props;
    if (!this.hasActions()) {
      return null;
    }
    // const len = actions.length;
    // TODO:len = 1：只有一个主按钮；len = 2：一个主按钮、一个次按钮；len >=3：一个主按钮、一个次按钮、其余放在按钮组里；
    return actions.map((action, idx) => {
      return (
        <Button
          key={idx}
          action={action}
          className="btn"
          type={idx === 0 ? 'primary' : 'outline'}
        >
          {action.title}
        </Button>
      );
    });
  }

  renderBundle() {
    const { metaData } = this.props;
    if (!metaData || !Array.isArray(metaData) || !metaData.length) {
      return this.renderEmptyData();
    }
    const bundle = this.normalizeBundle(this.mode);
    if (!Object.keys(bundle).length || (Array.isArray(bundle) && bundle.length === 0)) {
      return this.renderEmptyData();
    }
    this.isEmpty = false;
    return this.getBundle ? this.getBundle(bundle) : this.renderEmptyData();
  }

  renderCard() {
    const { currentCard, target, currentCardImage } = this.state;
    const { getComponentInfo } = this.props;

    if (!currentCard || !getComponentInfo) return null;

    return (
      <Card
        componentPrototype={currentCard}
        target={target}
        customImage={currentCardImage}
        subTitle={target ? target.innerText : ''}
        position="right top"
        visible={!!currentCard}
        showClose
        getComponentInfo={getComponentInfo}
        onHide={() => {
          this.setState({ currentCard: null });
          this.isMouseEnterCard = false;
        }}
        offset={{
          top: 10,
          left: 10,
        }}
        onMouseEnter={() => {
          this.isMouseEnterCard = true;
        }}
      />
    );
  }

  render() {
    const {
      enableSearch,
      className,
      registerAdditive = () => {

      },
    } = this.props;
    let bodyExtraClass = '';
    if (this.hasActions() && enableSearch) {
      bodyExtraClass = 'small';
    } else if (!this.hasActions() && enableSearch) {
      bodyExtraClass = 'medium';
    } else if (this.hasActions() && !enableSearch) {
      bodyExtraClass = 'large';
    } else {
      bodyExtraClass = '';
    }

    return (
      <div className={`ve-component-list ${className}`}>
        {enableSearch ? (
          <div className="ve-component-list-head">
            {this.renderHeader()}
          </div>
        ) : null}
        <div
          className={`ve-component-list-body ${bodyExtraClass}`}
          ref={(shell) => {
            if (this.shell || !shell || this.isEmpty) {
              return;
            }
            if (!this.shell) {
              this.shell = shell;
            }
            registerAdditive(shell);
          }}
        >
          {this.renderBundle()}
        </div>
        <div
          className={`ve-component-list-foot ${
            this.hasActions() ? 'exist' : ''
          }`}
        >
          {this.renderActions()}
        </div>
        {this.renderCard ? this.renderCard() : null}
      </div>
    );
  }
}

export default Base;
