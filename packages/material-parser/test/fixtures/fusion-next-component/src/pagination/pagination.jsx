import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import cx from 'classnames';
import ConfigProvider from '../config-provider';
import Icon from '../icon';
import Button from '../button';
import Input from '../input';
import Select from '../select';
import { KEYCODE, str, obj } from '../util';
import zhCN from '../locale/zh-cn.js';

const { Option } = Select;
const noop = () => {};

function correctCurrent(currentPage, total, currentPageSize) {
    const totalPage = getTotalPage(total, currentPageSize);
    return currentPage > totalPage ? totalPage : currentPage;
}

function getTotalPage(total, currentPageSize) {
    const totalPage = Math.ceil(total / currentPageSize);
    return totalPage <= 0 ? 1 : totalPage;
}

/**
 * Pagination
 */
class Pagination extends Component {
    static propTypes = {
        ...ConfigProvider.propTypes,
        prefix: PropTypes.string,
        pure: PropTypes.bool,
        rtl: PropTypes.bool,
        device: PropTypes.oneOf(['desktop', 'tablet', 'phone']),
        className: PropTypes.string,
        /**
         * 自定义国际化文案对象
         */
        locale: PropTypes.object,
        /**
         * 分页组件类型
         */
        type: PropTypes.oneOf(['normal', 'simple', 'mini']),
        /**
         * 前进后退按钮样式
         */
        shape: PropTypes.oneOf([
            'normal',
            'arrow-only',
            'arrow-prev-only',
            'no-border',
        ]),
        /**
         * 分页组件大小
         */
        size: PropTypes.oneOf(['small', 'medium', 'large']),
        /**
         * （受控）当前页码
         */
        current: PropTypes.number,
        /**
         * （非受控）初始页码
         */
        defaultCurrent: PropTypes.number,
        /**
         * 页码发生改变时的回调函数
         * @param {Number} current 改变后的页码数
         * @param {Object} e 点击事件对象
         */
        onChange: PropTypes.func,
        /**
         * 总记录数
         */
        total: PropTypes.number,
        /**
         * 总数的渲染函数
         * @param {Number} total 总数
         * @param {Array} range 当前数据在总数中的区间
         */
        totalRender: PropTypes.func,
        /**
         * 页码显示的数量，更多的使用...代替
         */
        pageShowCount: PropTypes.number,
        /**
         * 一页中的记录数
         */
        pageSize: PropTypes.number,
        /**
         * 每页显示选择器类型
         */
        pageSizeSelector: PropTypes.oneOf([false, 'filter', 'dropdown']),
        /**
         * 每页显示选择器可选值
         */
        pageSizeList: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.number),
            PropTypes.arrayOf(
                PropTypes.shape({
                    label: PropTypes.string,
                    value: PropTypes.number,
                })
            ),
        ]),
        /**
         * 自定义页码渲染函数，函数作用于页码button以及当前页/总页数的数字渲染
         * @param {Number} index 分页的页码，从1开始
         * @return {ReactNode} 返回渲染结果
         */
        pageNumberRender: PropTypes.func,
        /**
         * 每页显示选择器在组件中的位置
         */
        pageSizePosition: PropTypes.oneOf(['start', 'end']),
        /**
         * 存在每页显示选择器时是否使用浮动布局
         */
        useFloatLayout: PropTypes.bool,
        /**
         * 每页显示记录数量改变时的回调函数
         * @param {Number} pageSize 改变后的每页显示记录数
         */
        onPageSizeChange: PropTypes.func,
        /**
         * 当分页数为1时，是否隐藏分页器
         */
        hideOnlyOnePage: PropTypes.bool,
        /**
         * type 设置为 normal 时，在页码数超过5页后，会显示跳转输入框与按钮，当设置 showJump 为 false 时，不再显示该跳转区域
         */
        showJump: PropTypes.bool,
        /**
         * 设置页码按钮的跳转链接，它的值为一个包含 {page} 的模版字符串，如：http://www.taobao.com/{page}
         */
        link: PropTypes.string,
        selectPopupContiner: PropTypes.any,
        /**
         * 弹层组件属性，透传给Popup
         */
        popupProps: PropTypes.object,
    };

    static defaultProps = {
        prefix: 'next-',
        pure: false,
        rtl: false,
        locale: zhCN.Pagination,
        type: 'normal',
        shape: 'normal',
        size: 'medium',
        defaultCurrent: 1,
        onChange: noop,
        pageSize: 10,
        pageSizeSelector: false,
        pageSizeList: [5, 10, 20],
        pageSizePosition: 'start',
        onPageSizeChange: noop,
        useFloatLayout: false,
        total: 100,
        pageShowCount: 5,
        hideOnlyOnePage: false,
        showJump: true,
        pageNumberRender: index => index,
        selectPopupContiner: node => node.parentNode,
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            current: props.defaultCurrent || 1,
            currentPageSize: 0,
        };
    }

    static getDerivedStateFromProps(props, state) {
        const { current, total, pageSize } = props;
        const st = {};
        const newCurrent = correctCurrent(
            current || state.current,
            total,
            pageSize
        );
        if (state.current !== newCurrent) {
            st.current = newCurrent;
        }
        if (state.currentPageSize !== pageSize) {
            st.currentPageSize = pageSize;
        }

        return st;
    }

    handleJump = e => {
        const { total } = this.props;
        const { current, currentPageSize } = this.state;
        const totalPage = getTotalPage(total, currentPageSize);
        const value = parseInt(this.inputValue, 10);
        if (
            typeof value === 'number' &&
            value >= 1 &&
            value <= totalPage &&
            value !== current
        ) {
            this.onPageItemClick(value, e);
        }
    };
    onPageItemClick(page, e) {
        if (!('current' in this.props)) {
            this.setState({
                current: page,
            });
        }
        this.props.onChange(page, e);
    }

    onInputChange(value) {
        this.inputValue = value;
    }

    onSelectSize(pageSize) {
        const newState = {
            currentPageSize: pageSize,
        };

        const totalPage = getTotalPage(this.props.total, pageSize);
        if (this.state.current > totalPage) {
            newState.current = totalPage;
        }

        this.setState(newState);
        this.props.onPageSizeChange(pageSize);
    }

    renderPageTotal() {
        const { prefix, total, totalRender } = this.props;
        const { currentPageSize, current } = this.state;
        const range = [
            (current - 1) * currentPageSize + 1,
            current * currentPageSize,
        ];

        return (
            <div className={`${prefix}pagination-total`}>
                {totalRender(total, range)}
            </div>
        );
    }

    renderPageItem(index) {
        const {
            prefix,
            size,
            link,
            pageNumberRender,
            total,
            pageSize,
            locale,
        } = this.props;
        const { current } = this.state;

        const totalPage = getTotalPage(total, pageSize);
        const isCurrent = parseInt(index, 10) === current;
        const props = {
            size,
            className: cx({
                [`${prefix}pagination-item`]: true,
                [`${prefix}current`]: isCurrent,
            }),
            onClick: isCurrent ? noop : this.onPageItemClick.bind(this, index),
        };
        if (link) {
            props.component = 'a';
            props.href = link.replace('{page}', index);
        }

        return (
            <Button
                aria-label={str.template(locale.total, {
                    current: index,
                    total: totalPage,
                })}
                {...props}
                key={index}
            >
                {pageNumberRender(index)}
            </Button>
        );
    }

    renderPageFirst(current) {
        const { prefix, size, shape, locale } = this.props;

        const isFirst = current <= 1;
        const props = {
            disabled: isFirst,
            size,
            className: cx({
                [`${prefix}pagination-item`]: true,
                [`${prefix}prev`]: true,
            }),
            onClick: this.onPageItemClick.bind(this, current - 1),
        };

        const icon = <Icon type="arrow-left" />;

        return (
            <Button
                {...props}
                aria-label={str.template(locale.labelPrev, { current })}
            >
                {icon}
                {shape === 'arrow-only' ||
                shape === 'arrow-prev-only' ||
                shape === 'no-border'
                    ? ''
                    : locale.prev}
            </Button>
        );
    }

    renderPageLast(current, totalPage) {
        const { prefix, size, shape, locale } = this.props;

        const isLast = current >= totalPage;
        const props = {
            disabled: isLast,
            size,
            className: cx({
                [`${prefix}pagination-item`]: true,
                [`${prefix}next`]: true,
            }),
            onClick: this.onPageItemClick.bind(this, current + 1),
        };

        const icon = <Icon type="arrow-right" />;

        return (
            <Button
                {...props}
                aria-label={str.template(locale.labelNext, { current })}
            >
                {shape === 'arrow-only' || shape === 'no-border'
                    ? ''
                    : locale.next}
                {icon}
            </Button>
        );
    }

    renderPageEllipsis(idx) {
        const { prefix } = this.props;

        return (
            <Icon
                className={`${prefix}pagination-ellipsis`}
                type="ellipsis"
                key={`ellipsis-${idx}`}
            />
        );
    }

    renderPageJump() {
        const { prefix, size, locale } = this.props;

        /* eslint-disable react/jsx-key */
        return [
            <span className={`${prefix}pagination-jump-text`}>
                {locale.goTo}
            </span>,
            <Input
                className={`${prefix}pagination-jump-input`}
                type="text"
                aria-label={locale.inputAriaLabel}
                size={size}
                onChange={this.onInputChange.bind(this)}
                onKeyDown={e => {
                    if (e.keyCode === KEYCODE.ENTER) {
                        this.handleJump(e);
                    }
                }}
            />,
            <span className={`${prefix}pagination-jump-text`}>
                {locale.page}
            </span>,
            <Button
                className={`${prefix}pagination-jump-go`}
                size={size}
                onClick={this.handleJump}
            >
                {locale.go}
            </Button>,
        ];
        /* eslint-enable react/jsx-key */
    }

    renderPageDisplay(current, totalPage) {
        const { prefix, pageNumberRender } = this.props;

        return (
            <span className={`${prefix}pagination-display`}>
                <em>{pageNumberRender(current)}</em>/
                {pageNumberRender(totalPage)}
            </span>
        );
    }

    renderPageList(current, totalPage) {
        const { prefix, pageShowCount } = this.props;
        const pages = [];

        if (totalPage <= pageShowCount) {
            for (let i = 1; i <= totalPage; i++) {
                pages.push(this.renderPageItem(i));
            }
        } else {
            // 除去第一页，最后一页以及当前页，剩下的页数
            const othersCount = pageShowCount - 3;
            const halfCount = parseInt(othersCount / 2, 10);
            let start, end;

            pages.push(this.renderPageItem(1));

            start = current - halfCount;
            end = current + halfCount;
            if (start <= 1) {
                start = 2;
                end = start + othersCount;
            }
            if (start > 2) {
                pages.push(this.renderPageEllipsis(1));
            }
            if (end >= totalPage - 1) {
                end = totalPage - 1;
                start = totalPage - 1 - othersCount;
            }
            for (let j = start; j <= end; j++) {
                pages.push(this.renderPageItem(j));
            }
            if (end < totalPage - 1) {
                pages.push(this.renderPageEllipsis(2));
            }

            pages.push(this.renderPageItem(totalPage));
        }

        return <div className={`${prefix}pagination-list`}>{pages}</div>;
    }

    renderPageSizeSelector() {
        const { prefix, pageSizeSelector, locale } = this.props;
        const pageSizeSpan = (
            <span className={`${prefix}pagination-size-selector-title`}>
                {locale.pageSize}
            </span>
        );

        switch (pageSizeSelector) {
            case 'filter':
                return (
                    <div className={`${prefix}pagination-size-selector`}>
                        {pageSizeSpan}
                        {this.renderPageSizeFilter()}
                    </div>
                );
            case 'dropdown':
                return (
                    <div className={`${prefix}pagination-size-selector`}>
                        {pageSizeSpan}
                        {this.renderPageSizeDropdown()}
                    </div>
                );
            default:
                return null;
        }
    }

    renderPageSizeFilter() {
        const { prefix, size, pageSizeList } = this.props;
        const { currentPageSize } = this.state;

        return (
            <div className={`${prefix}pagination-size-selector-filter`}>
                {pageSizeList.map((item, index) => {
                    let label;
                    let pageSize;
                    if (item.value) {
                        // {label: '', value: 5}
                        label = item.label;
                        pageSize = item.value;
                    } else {
                        // number
                        label = pageSize = item;
                    }
                    const classes = cx({
                        [`${prefix}pagination-size-selector-btn`]: true,
                        [`${prefix}current`]: pageSize === currentPageSize,
                    });

                    return (
                        <Button
                            key={index}
                            text
                            size={size}
                            className={classes}
                            onClick={
                                pageSize !== currentPageSize
                                    ? this.onSelectSize.bind(this, pageSize)
                                    : null
                            }
                        >
                            {label}
                        </Button>
                    );
                })}
            </div>
        );
    }

    renderPageSizeDropdown() {
        const {
            prefix,
            size,
            pageSizeList,
            selectPopupContiner,
            locale,
            popupProps,
        } = this.props;
        const { currentPageSize } = this.state;

        return (
            <Select
                className={`${prefix}pagination-size-selector-dropdown`}
                popupClassName={`${prefix}pagination-size-selector-popup`}
                popupContainer={selectPopupContiner}
                popupProps={popupProps}
                aria-label={locale.selectAriaLabel}
                autoWidth
                size={size}
                value={currentPageSize}
                onChange={this.onSelectSize.bind(this)}
            >
                {pageSizeList.map((item, index) => {
                    let label;
                    let pageSize;
                    if (item.value) {
                        // {label: '', value: 5}
                        label = item.label;
                        pageSize = item.value;
                    } else {
                        // number
                        label = pageSize = item;
                    }
                    return (
                        <Option key={index} value={pageSize}>
                            {label}
                        </Option>
                    );
                })}
            </Select>
        );
    }

    render() {
        /* eslint-disable no-unused-vars */
        const {
            prefix,
            pure,
            rtl,
            device,
            type: paginationType,
            size,
            shape,
            className,
            total,
            totalRender,
            pageSize,
            pageSizeSelector,
            pageSizeList,
            pageSizePosition,
            useFloatLayout,
            onPageSizeChange,
            hideOnlyOnePage,
            showJump,
            locale,
            current,
            defaultCurrent,
            pageShowCount,
            pageNumberRender,
            link,
            onChange,
            selectPopupContiner,
            popupProps,
            ...others
        } = this.props;
        /* eslint-enable */
        const { current: currentPage, currentPageSize } = this.state;
        const totalPage = getTotalPage(total, currentPageSize);
        const pageFirst = this.renderPageFirst(currentPage);
        const pageLast = this.renderPageLast(currentPage, totalPage);
        const sizeSelector = this.renderPageSizeSelector();
        const isStart = pageSizePosition === 'start';

        let type = paginationType;

        if (device === 'phone' && type === 'normal') {
            type = 'simple';
        }

        const classes = cx({
            [`${prefix}pagination`]: true,
            [`${prefix}${size}`]: size,
            [`${prefix}${type}`]: type,
            [`${prefix}${shape}`]: shape,
            [`${prefix}start`]: !!pageSizeSelector && isStart && useFloatLayout,
            [`${prefix}end`]: !!pageSizeSelector && !isStart && useFloatLayout,
            [`${prefix}hide`]: totalPage <= 1 && hideOnlyOnePage,
            [className]: !!className,
        });

        if (rtl) {
            others.dir = 'rtl';
        }

        const buildComponent = (...coms) => (
            <div
                className={classes}
                {...obj.pickOthers(Object.keys(Pagination.propTypes), others)}
            >
                {isStart && sizeSelector}
                {totalRender ? this.renderPageTotal() : null}
                <div className={`${prefix}pagination-pages`}>
                    {coms.map(
                        (com, index) =>
                            com && React.cloneElement(com, { key: index })
                    )}
                </div>
                {!isStart && sizeSelector}
            </div>
        );

        switch (type) {
            case 'mini':
                return buildComponent(pageFirst, pageLast);
            case 'simple': {
                const pageDisplay = this.renderPageDisplay(
                    currentPage,
                    totalPage
                );
                return buildComponent(pageFirst, pageDisplay, pageLast);
            }
            case 'normal': {
                const pageList = this.renderPageList(currentPage, totalPage);
                const pageDisplay =
                    showJump && total > pageSize * pageShowCount
                        ? this.renderPageDisplay(currentPage, totalPage)
                        : null;
                const pageJump =
                    showJump && total > pageSize * pageShowCount
                        ? this.renderPageJump(currentPage, totalPage)
                        : null;
                return buildComponent(
                    pageFirst,
                    pageList,
                    pageLast,
                    pageDisplay,
                    ...pageJump
                );
            }
            default:
                return null;
        }
    }
}

export default ConfigProvider.config(polyfill(Pagination));
