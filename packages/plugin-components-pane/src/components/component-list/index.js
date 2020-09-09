import Base, { AdditiveType } from "../base/index.js";
import Snippet from "../snippet";
import "./index.less";

// 滚动事件触发灵敏度
const OFFSET_ACCURCY = 25;

const categoryMap = {
  General: "常用",
  Navigation: "导航",
  DataEntry: "输入",
  DataDisplay: "展示",
  Feedback: "反馈",
  Util: "工具",
  Chart: "图表",
  Others: "其他",
};

export default class ComponentList extends Base {
  static displayName = "ComponentList";

  descRefList = new Map();
  navRefList = new Map();
  descHeightList = new Map();
  snippetMap = new Map();
  currentScrollHeight = 0;
  scrollFlag = true;
  scroll;
  scrollTimer;
  state = {
    selected: "",
    searchText: "",
    currentCard: null,
    currentCardImage: ''
  };

  componentDidMount() {
    setTimeout(() => {
      this.calDescHeightList();

      // mock 滚动结束事件
      if (this.scroll) {
        this.scroll.addEventListener("scroll", this.handleScrollEnd);
      }
    }, 20);
    const bundle = this.normalizeBundle();
    if (!bundle) {
      return;
    }
    const cats = Object.keys(bundle);
    if (cats.length > 0) {
      const k = cats[0];
      const comps = bundle[k];
      if (!comps || !Array.isArray(comps) || !comps.length) {
        return;
      }
      this.setState({ selected: comps[0].id });
    }
  }

  componentWillUnmount() {
    if (this.scroll) {
      this.scroll.removeEventListener("scroll", this.handleScrollEnd);
    }
  }

  handleScrollEnd = () => {
    clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(() => {
      // 滚动结束时归位
      this.scrollFlag = true;
    }, 100);
  };

  toggleComponent(id) {
    const element = this.descRefList.get(id);
    // 切换组件时滚动事件回调不可用
    this.scrollFlag = false;
    element.scrollIntoView();
    this.setState({ selected: id });
  }

  handleScroll(e) {
    // 清空卡片
    if (this.state.currentCard) {
      this.setState({ currentCard: null });
    }
    clearTimeout(this.timer);
    this.timer = null;

    if (!this.scrollFlag) {
      return;
    }
    const element = e.target;
    const { scrollTop } = element;

    // 延迟处理
    if (Math.abs(scrollTop - this.currentScrollHeight) < OFFSET_ACCURCY) {
      return;
    }
    this.currentScrollHeight = scrollTop;

    // 处理导航块滚动高亮效果
    const heightList = [...this.descHeightList.entries()];
    let selected;
    // 当在顶部
    if (scrollTop >= 0 && scrollTop < heightList[0][1]) {
      selected = heightList[0][0];
    } else if (scrollTop >= heightList[heightList.length - 1][1]) {
      // 底部
      selected = heightList[heightList.length - 1][0];
    } else {
      // 当在中部
      for (let i = 0; i < heightList.length - 2; i++) {
        const height1 = heightList[i][1];
        const height2 = heightList[i + 1][1];
        if (scrollTop > height1 && scrollTop < height2) {
          selected = heightList[i + 1][0];
        }
      }
    }
    this.fixSideBarView(selected);
    this.setState({ selected });
  }

  // 导航高亮块超出视口时滚动
  fixSideBarView(selected) {
    const nav = this.navRefList.get(selected);
    if (nav) {
      nav.scrollIntoView({ block: "center" });
    }
  }

  calDescHeightList() {
    let height = 0;
    this.descRefList.forEach((ele, key) => {
      if (!ele) {
        return;
      }
      height += ele.clientHeight;
      this.descHeightList.set(key, height);
    });
  }

  renderNavigator(bundle) {
    return (
      <div className="ve-component-list-navigator">
        {Object.keys(bundle).map((c) => {
          const catTitle = categoryMap[c] || c;
          const catData = bundle[c];
          return this.renderNavigatorGroup(catTitle, catData);
        })}
      </div>
    );
  }

  renderNavigatorGroup(title, metaData) {
    const { selected } = this.state;
    if (!metaData) {
      return null;
    }
    return (
      <div className="navigator-group" key={title}>
        <div className="navigator-group-head">
          <div className="navigator-group-title">{title}</div>
        </div>
        {metaData.map((comp) => (
          <div
            className={`navigator-group-item ${AdditiveType.Draggable} ${
              selected === comp.id ? "active" : ""
            }`}
            key={comp.id}
            data-id={
              (comp.snippets && comp.snippets[0] && comp.snippets[0].id) || ""
            }
            ref={(item) => {
              this.navRefList.set(comp.id, item);
            }}
            onClick={() => this.toggleComponent(comp.id)}
          >
            <span className="navigator-group-item-title">{comp.title}</span>
          </div>
        ))}
      </div>
    );
  }

  renderComponentDescriptionList(bundle) {
    const { renderCustomSnippet = "", enableCard = true } = this.props;
    return (
      <div className="component-description-list">
        {Object.keys(bundle).map((cat) => {
          const catData = bundle[cat];
          if (!catData) {
            return null;
          }
          return catData.map((comp) => (
            <div
              className="component-description-item"
              key={comp.id}
              ref={(item) => {
                this.descRefList.set(comp.id, item);
              }}
            >
              <div className="component-description-item-header">
                {comp.title ? (
                  <div className="component-description-item-title">
                    {comp.title}
                  </div>
                ) : null}
                <div className="component-description-item-icon-group">
                </div>
              </div>
              <div className="component-description-item-snippets">
                {comp.snippets &&
                  comp.snippets.map((snippet, idx) => (
                    <div
                      key={`${comp.id}-${idx}`}
                      ref={(i) => {
                        this.snippetMap.set(`${comp.id}-${idx}`, i);
                      }}
                      onMouseEnter={() => {
                        if (!enableCard) {
                          return;
                        }
                        this.timer = setTimeout(() => {
                          this.setState({
                            currentCard: comp,
                            target: this.snippetMap.get(`${comp.id}-${idx}`),
                            currentCardImage: snippet.thumbnail
                          });
                          this.timer = null;
                        }, 1000);
                      }}
                      onMouseLeave={() => {
                        if (!enableCard) {
                          return;
                        }
                        clearTimeout(this.timer);
                        this.timer = null;
                        setTimeout(() => {
                          if (this.isMouseEnterCard) {
                            return;
                          }
                          this.setState({currentCard: null});
                        }, 200);
                      }}
                    >
                      <Snippet
                        key={idx}
                        snippet={snippet}
                        renderCustomSnippet={renderCustomSnippet}
                      />
                    </div>
                  ))}
              </div>
            </div>
          ));
        })}
      </div>
    );
  }

  getBundle(bundle) {
    return [
      <div className="ve-component-list-sidebar" key="sidebar">
        {this.renderNavigator(bundle)}
      </div>,
      <div
        key="content"
        className="ve-component-list-content"
        onScroll={(e) => this.handleScroll(e)}
        ref={(scroll) => (this.scroll = scroll)}
      >
        {this.renderComponentDescriptionList(bundle)}
      </div>,
    ];
  }
}
