import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Icon from '../icon';
import Button from '../button';
import ConfigProvider from '../config-provider';
import nextLocale from '../locale/zh-cn';

/**
 * Card.CollaspeContent
 * @order 3
 */
class CardCollaspeContent extends Component {
    static propTypes = {
        prefix: PropTypes.string,
        /**
         * 内容区域的固定高度
         */
        contentHeight: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        locale: PropTypes.object,
        children: PropTypes.node,
    };

    static defaultProps = {
        prefix: 'next-',
        contentHeight: 120,
        locale: nextLocale.Card,
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            needMore: false,
            expand: false,
            contentHeight: 'auto',
        };
    }

    componentDidMount() {
        this._setNeedMore();
        this._setContentHeight();
    }

    componentDidUpdate() {
        this._setContentHeight();
    }

    handleToggle = () => {
        this.setState(prevState => {
            return {
                expand: !prevState.expand,
            };
        });
    };

    // 是否展示 More 按钮
    _setNeedMore() {
        const { contentHeight } = this.props;
        const childrenHeight = this._getNodeChildrenHeight(this.content);
        this.setState({
            needMore:
                contentHeight !== 'auto' && childrenHeight > contentHeight,
        });
    }

    // 设置 Body 的高度
    _setContentHeight() {
        if (this.state.expand) {
            const childrenHeight = this._getNodeChildrenHeight(this.content);
            this.content.style.height = `${childrenHeight}px`; // get the real height
        } else {
            const el = ReactDOM.findDOMNode(this.footer);
            let height = this.props.contentHeight;

            if (el) {
                height = height - el.getBoundingClientRect().height;
            }

            this.content.style.height = `${height}px`;
        }
    }

    _getNodeChildrenHeight(node) {
        if (!node) {
            return 0;
        }

        const contentChildNodes = node.childNodes;
        const length = contentChildNodes.length;

        if (!length) {
            return 0;
        }

        const lastNode = contentChildNodes[length - 1];

        return lastNode.offsetTop + lastNode.offsetHeight;
    }

    _contentRefHandler = ref => {
        this.content = ref;
    };

    saveFooter = ref => {
        this.footer = ref;
    };

    render() {
        const { prefix, children, locale } = this.props;
        const { needMore, expand } = this.state;

        return (
            <div className={`${prefix}card-body`}>
                <div
                    className={`${prefix}card-content`}
                    ref={this._contentRefHandler}
                >
                    {children}
                </div>
                {needMore ? (
                    <div
                        className={`${prefix}card-footer`}
                        ref={this.saveFooter}
                        onClick={this.handleToggle}
                    >
                        <Button text type="primary">
                            {expand ? locale.fold : locale.expand}
                            <Icon
                                type="arrow-down"
                                size="xs"
                                className={expand ? 'expand' : ''}
                            />
                        </Button>
                    </div>
                ) : null}
            </div>
        );
    }
}

export default ConfigProvider.config(CardCollaspeContent, {
    componentName: 'Card',
});
