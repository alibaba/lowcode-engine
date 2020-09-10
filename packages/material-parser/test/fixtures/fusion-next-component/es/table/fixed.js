import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { dom } from '../util';
import HeaderComponent from './fixed/header';
import BodyComponent from './fixed/body';
import WrapperComponent from './fixed/wrapper';
import { statics } from './util';

export default function fixed(BaseComponent) {
    var _class, _temp2;

    /** Table */
    var FixedTable = (_temp2 = _class = function (_React$Component) {
        _inherits(FixedTable, _React$Component);

        function FixedTable() {
            var _temp, _this, _ret;

            _classCallCheck(this, FixedTable);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.getNode = function (type, node, lockType) {
                lockType = lockType ? lockType.charAt(0).toUpperCase() + lockType.substr(1) : '';
                _this['' + type + lockType + 'Node'] = node;
            }, _this.onFixedScrollSync = function () {
                var current = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                if (current.currentTarget !== current.target) {
                    return;
                }
                var target = current.target,
                    headerNode = _this.headerNode,
                    bodyNode = _this.bodyNode;

                var scrollLeft = target.scrollLeft;

                if (target === bodyNode) {
                    if (headerNode && scrollLeft !== headerNode.scrollLeft) {
                        headerNode.scrollLeft = scrollLeft;
                    }
                } else if (target === headerNode) {
                    if (bodyNode && scrollLeft !== bodyNode.scrollLeft) {
                        bodyNode.scrollLeft = scrollLeft;
                    }
                }
            }, _temp), _possibleConstructorReturn(_this, _ret);
        }

        FixedTable.prototype.getChildContext = function getChildContext() {
            return {
                fixedHeader: this.props.fixedHeader,
                maxBodyHeight: this.props.maxBodyHeight,
                onFixedScrollSync: this.onFixedScrollSync,
                getNode: this.getNode
            };
        };

        FixedTable.prototype.componentDidMount = function componentDidMount() {
            this.adjustFixedHeaderSize();
        };

        FixedTable.prototype.componentDidUpdate = function componentDidUpdate() {
            this.adjustFixedHeaderSize();
        };

        // for fixed header scroll left


        FixedTable.prototype.adjustFixedHeaderSize = function adjustFixedHeaderSize() {
            var _props = this.props,
                hasHeader = _props.hasHeader,
                rtl = _props.rtl;

            var paddingName = rtl ? 'paddingLeft' : 'paddingRight';
            var marginName = rtl ? 'marginLeft' : 'marginRight';
            var body = this.bodyNode;

            if (hasHeader && !this.props.lockType && body) {
                var _style;

                var scrollBarSize = +dom.scrollbar().width || 0;
                var hasVerScroll = body.scrollHeight > body.clientHeight,
                    hasHozScroll = body.scrollWidth > body.clientWidth;
                var style = (_style = {}, _style[paddingName] = scrollBarSize, _style[marginName] = scrollBarSize, _style);

                if (!hasVerScroll) {
                    style[paddingName] = 0;
                    style[marginName] = 0;
                }

                if (+scrollBarSize) {
                    style.marginBottom = -scrollBarSize;
                    if (hasHozScroll) {
                        style.paddingBottom = scrollBarSize;
                    } else {
                        style.paddingBottom = scrollBarSize;
                        style[marginName] = 0;
                    }
                }

                dom.setStyle(this.headerNode, style);
            }
        };

        FixedTable.prototype.render = function render() {
            /* eslint-disable no-unused-vars, prefer-const */
            var _props2 = this.props,
                components = _props2.components,
                className = _props2.className,
                prefix = _props2.prefix,
                fixedHeader = _props2.fixedHeader,
                lockType = _props2.lockType,
                dataSource = _props2.dataSource,
                maxBodyHeight = _props2.maxBodyHeight,
                others = _objectWithoutProperties(_props2, ['components', 'className', 'prefix', 'fixedHeader', 'lockType', 'dataSource', 'maxBodyHeight']);

            if (fixedHeader) {
                var _classnames;

                components = _extends({}, components);
                if (!components.Header) {
                    components.Header = HeaderComponent;
                }
                if (!components.Body) {
                    components.Body = BodyComponent;
                }
                if (!components.Wrapper) {
                    components.Wrapper = WrapperComponent;
                }
                className = classnames((_classnames = {}, _classnames[prefix + 'table-fixed'] = true, _classnames[prefix + 'table-wrap-empty'] = !dataSource.length, _classnames[className] = className, _classnames));
            }

            return React.createElement(BaseComponent, _extends({}, others, {
                dataSource: dataSource,
                lockType: lockType,
                components: components,
                className: className,
                prefix: prefix
            }));
        };

        return FixedTable;
    }(React.Component), _class.FixedHeader = HeaderComponent, _class.FixedBody = BodyComponent, _class.FixedWrapper = WrapperComponent, _class.propTypes = _extends({
        /**
         * 是否具有表头
         */
        hasHeader: PropTypes.bool,
        /**
         * 表头是否固定，该属性配合maxBodyHeight使用，当内容区域的高度超过maxBodyHeight的时候，在内容区域会出现滚动条
         */
        fixedHeader: PropTypes.bool,
        /**
         * 最大内容区域的高度,在`fixedHeader`为`true`的时候,超过这个高度会出现滚动条
         */
        maxBodyHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    }, BaseComponent.propTypes), _class.defaultProps = _extends({}, BaseComponent.defaultProps, {
        hasHeader: true,
        fixedHeader: false,
        maxBodyHeight: 200,
        components: {},
        refs: {},
        prefix: 'next-'
    }), _class.childContextTypes = {
        fixedHeader: PropTypes.bool,
        getNode: PropTypes.func,
        onFixedScrollSync: PropTypes.func,
        maxBodyHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    }, _temp2);
    FixedTable.displayName = 'FixedTable';

    statics(FixedTable, BaseComponent);
    return FixedTable;
}