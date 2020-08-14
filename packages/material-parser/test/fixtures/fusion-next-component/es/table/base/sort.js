import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp2;

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from '../../icon';
import { KEYCODE } from '../../util';

/* eslint-disable react/prefer-stateless-function */
var Sort = (_temp2 = _class = function (_React$Component) {
    _inherits(Sort, _React$Component);

    function Sort() {
        var _temp, _this, _ret;

        _classCallCheck(this, Sort);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.handleClick = function () {
            var _this$props = _this.props,
                sort = _this$props.sort,
                dataIndex = _this$props.dataIndex;

            _this.onSort(dataIndex, sort[dataIndex] === 'desc' ? 'asc' : 'desc');
        }, _this.keydownHandler = function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (e.keyCode === KEYCODE.ENTER) {
                _this.handleClick();
            }
        }, _this.onSort = function (dataIndex, order) {
            var sort = {};
            sort[dataIndex] = order;

            _this.props.onSort(dataIndex, order, sort);
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    // 渲染排序
    Sort.prototype.renderSort = function renderSort() {
        var _classnames;

        var _props = this.props,
            prefix = _props.prefix,
            sort = _props.sort,
            sortIcons = _props.sortIcons,
            className = _props.className,
            dataIndex = _props.dataIndex,
            locale = _props.locale,
            rtl = _props.rtl,
            sortStatus = sort[dataIndex],
            map = {
            desc: 'descending',
            asc: 'ascending'
        };


        var icons = ['asc', 'desc'].map(function (sortOrder) {
            return React.createElement(
                'a',
                {
                    key: sortOrder,
                    className: sortStatus === sortOrder ? 'current' : ''
                },
                sortIcons ? sortIcons[sortOrder] : React.createElement(Icon, { rtl: rtl, type: map[sortOrder], size: 'small' })
            );
        });

        var cls = classnames((_classnames = {}, _classnames[prefix + 'table-sort'] = true, _classnames[className] = className, _classnames));

        return React.createElement(
            'span',
            {
                role: 'button',
                tabIndex: '0',
                'aria-label': locale[sortStatus],
                className: cls,
                onClick: this.handleClick.bind(this),
                onKeyDown: this.keydownHandler
            },
            icons
        );
    };

    Sort.prototype.render = function render() {
        return this.renderSort();
    };

    return Sort;
}(React.Component), _class.propTypes = {
    prefix: PropTypes.string,
    rtl: PropTypes.bool,
    className: PropTypes.string,
    sort: PropTypes.object,
    sortIcons: PropTypes.object,
    onSort: PropTypes.func,
    dataIndex: PropTypes.string,
    locale: PropTypes.object
}, _class.defaultProps = {
    sort: {}
}, _temp2);
Sort.displayName = 'Sort';
export { Sort as default };