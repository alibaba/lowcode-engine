import React from 'react';
import Layer from '@ali/vu-layer';
import { Icon } from '@alifd/next';
import $i18n from '../../i18n/index';
import Button from '../button';
import './index.less';

export default class Card extends React.Component {
  static propTypes = {};

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      errorMsg: false,
      componentInfo: {},
    };
  }

  componentDidMount() {
    if (!this.props.getComponentInfo) return;
    this.loadComponentInfo(this.props.componentPrototype);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.componentPrototype !== this.props.componentPrototype) {
      // 延迟执行数据加载和渲染，等 props 更新之后
      this.loadComponentInfo(nextProps.componentPrototype);
    }
  }

  loadComponentInfo(componentPrototype) {
    if (!this.props.getComponentInfo) return;
    this.setState({ isLoading: true });
    this.props
      .getComponentInfo(componentPrototype)
      .then((componentInfo) => {
        this.setState({
          componentInfo,
          isLoading: false,
        });
      })
      .catch((e) => {
        this.setState({ errorMsg: e.message });
        console.error(e);
      });
  }

  render() {
    const { componentPrototype, subTitle, customImage } = this.props;
    const { componentInfo } = this.state;

    const loadingContent = this.state.errorMsg ? (
      <div>
        <div className="ve-loading-content">{this.state.errorMsg}</div>
      </div>
    ) : (
      <div>
        <Icon type="loading" className="ve-loading-icon" size="large" />
        <div className="ve-loading-content">
          {$i18n.get({ id: 'trunkPaneLoading', dm: '加载中...' })}
        </div>
      </div>
    );

    const {
      title,
      version,
      image = 'https://img.alicdn.com/tfs/TB1XHG6ehrI8KJjy0FpXXb5hVXa-740-608.png',
      desc,
      detailUrl,
      actions,
    } = componentInfo;

    let layerContent = null;
    const cardTitle = subTitle && !subTitle.includes(title) ? `${title}（${subTitle}）` : title;

    if (this.state.isLoading) {
      layerContent = (
        <div className="ve-card-wrapper ve-card-wrapper-loading" onMouseEnter={this.props.onMouseEnter}>
          {loadingContent}
        </div>
      );
    } else {
      layerContent = (
        <div className="ve-card-wrapper" onMouseEnter={this.props.onMouseEnter}>
          <div className="ve-card-top">
            <div className="ve-card-title">
              <span className="title">{cardTitle}</span>
              <span className="version">{version}</span>
            </div>
            <div className="ve-card-image-wrapper">
              <img src={customImage && typeof customImage === 'string' ? customImage : image} alt={cardTitle} className="ve-card-image" />
            </div>
          </div>
          <div className="ve-card-bottom">
            <div className="ve-card-description">
              <p>{desc}</p>
            </div>
            <div className="ve-operation-container">
              {detailUrl ? (
                <a
                  href={detailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ve-operation-item"
                >
                  {$i18n.get({
                    id: 'trunkPaneDetailedDocumentation',
                    dm: '详细文档',
                  })}
                </a>
              ) : null}
              <div className="actions">
                {
                  actions ? actions.map((action, idx) => {
                    return (
                      <Button
                        key={idx}
                        className="ve-card-action"
                        action={action}
                        componentPrototype={componentPrototype}
                      />
                    );
                  }) : null
                }
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <Layer {...this.props} noLimitOnMaxHeight>
        {layerContent}
      </Layer>
    );
  }
}
