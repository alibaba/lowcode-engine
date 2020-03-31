import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { polyfill } from 'react-lifecycles-compat';

import Input from '../input';
import Select from '../select';
import Button from '../button';
import Icon from '../icon';
import { obj, func, KEYCODE } from '../util';
import zhCN from '../locale/zh-cn';

const Group = Input.Group;
const AutoComplete = Select.AutoComplete;

/**
 * Search
 * @description 输入框部分继承 Select.AutoComplete 的能力，可以直接用AutoComplete 的 api
 */
class Search extends React.Component {
    static propTypes = {
        /**
         * 样式前缀
         */
        prefix: PropTypes.string,
        /**
         * 形状
         */
        shape: PropTypes.oneOf(['normal', 'simple']),
        /**
         * 类型 shape=normal: primary/secondary; shape=simple: normal/dark;
         */
        type: PropTypes.oneOf(['primary', 'secondary', 'normal', 'dark']),
        /**
         * 大小
         * @enumdesc '大', '小'
         */
        size: PropTypes.oneOf(['large', 'medium']),
        /**
         * 搜索框默认值
         */
        defaultValue: PropTypes.string,
        /**
         * 搜索框数值
         */
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        /**
         * 输入关键字时的回掉
         * @param {Object} value 输入值
         */
        onChange: PropTypes.func,
        /**
         * 点击搜索按钮触发的回调
         * @param {String} value 输入值
         * @param {String} filterValue 选项值
         */
        onSearch: PropTypes.func,
        /**
         * 选择器默认值
         */
        defaultFilterValue: PropTypes.string,
        /**
         * 选择器
         */
        filter: PropTypes.array,
        /**
         * 选择器值
         */
        filterValue: PropTypes.string,
        /**
         * 选择器发生变化时回调
         * @param {Object} filter value
         */
        onFilterChange: PropTypes.func,
        /**
         * 搜索框下拉联想列表
         */
        dataSource: PropTypes.array,
        /**
         * 默认提示
         */
        placeholder: PropTypes.string,
        /**
         * button 的内容
         */
        searchText: PropTypes.node,
        /**
         * 自定义样式
         */
        style: PropTypes.object,
        /**
         * 样式名称
         */
        className: PropTypes.string,
        /**
         * 选择器的props
         */
        filterProps: PropTypes.object,
        /**
         * 按钮的额外属性
         */
        buttonProps: PropTypes.object,
        /**
         * 自定义渲染的的下拉框
         */
        popupContent: PropTypes.node,
        /**
         * 是否跟随滚动
         */
        followTrigger: PropTypes.bool,
        /**
         * 自定义渲染的的下拉框
         */
        visible: PropTypes.bool,
        /**
         * 是否显示清除按钮
         */
        hasClear: PropTypes.bool,
        /**
         * 是否显示搜索按钮
         */
        hasIcon: PropTypes.bool,
        /**
         * 是否禁用
         */
        disabled: PropTypes.bool,
        locale: PropTypes.object,
        rtl: PropTypes.bool,
    };

    static defaultProps = {
        prefix: 'next-',
        shape: 'normal',
        type: 'normal',
        size: 'medium',
        hasIcon: true,
        filter: [],
        locale: zhCN.Search,
        buttonProps: {},
        onChange: func.noop,
        onSearch: func.noop,
        onFilterChange: func.noop,
        hasClear: false,
        disabled: false,
    };

    constructor(props) {
        super(props);

        const value = 'value' in props ? props.value : props.defaultValue;
        const filterValue =
            'filterValue' in props
                ? props.filterValue
                : props.defaultFilterValue;

        this.state = {
            value: typeof value === 'undefined' ? '' : value,
            filterValue,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const nextState = {};
        if ('value' in nextProps && nextProps.value !== prevState.value) {
            const value = nextProps.value;
            nextState.value =
                value === undefined || value === null ? '' : nextProps.value;
        }

        if (
            'filterValue' in nextProps &&
            nextProps.filterValue !== prevState.filterValue
        ) {
            const filterValue = nextProps.filterValue;
            nextState.filterValue =
                filterValue === undefined ? '' : filterValue;
        }

        if (Object.keys(nextState).length > 0) {
            return nextState;
        }

        return null;
    }

    onChange = (value, ...argv) => {
        if (!('value' in this.props)) {
            this.setState({ value });
        }

        this.props.onChange(value, ...argv);
    };

    onSearch = () => {
        if (this.props.disabled) {
            return;
        }
        this.props.onSearch(this.state.value, this.state.filterValue);
    };

    onFilterChange = filterValue => {
        if (!('filterValue' in this.props)) {
            this.setState({ filterValue });
        }

        this.props.onFilterChange(filterValue);
    };

    onKeyDown = e => {
        if (this.props.disabled) {
            return;
        }
        if (e.keyCode !== KEYCODE.ENTER) {
            return;
        }
        this.onSearch();
    };
    render() {
        const {
            shape,
            filter,
            hasIcon,
            disabled,
            placeholder,
            type,
            className,
            style,
            size,
            prefix,
            searchText,
            dataSource,
            filterProps,
            buttonProps,
            popupContent,
            followTrigger,
            hasClear,
            visible,
            locale,
            rtl,
            ...others
        } = this.props;

        const cls = classNames({
            [`${prefix}search`]: true,
            [`${prefix}search-${shape}`]: true,
            [`${prefix}${type}`]: type,
            [`${prefix}${size}`]: size,
            [className]: !!className,
        });

        let searchIcon = null,
            filterSelect = null,
            searchBtn = null;

        if (shape === 'simple') {
            const cls = classNames({
                [`${prefix}search-icon`]: true,
                [buttonProps.className]: !!buttonProps.className,
            });
            hasIcon &&
                (searchIcon = (
                    <Icon
                        type="search"
                        tabIndex="0"
                        role="button"
                        aria-disabled={disabled}
                        aria-label={locale.buttonText}
                        {...buttonProps}
                        className={cls}
                        onClick={this.onSearch}
                        onKeyDown={this.onKeyDown}
                    />
                ));
        } else {
            const cls = classNames({
                [`${prefix}search-btn`]: true,
                [buttonProps.className]: !!buttonProps.className,
            });
            searchBtn = (
                <Button
                    tabIndex="0"
                    aria-disabled={disabled}
                    aria-label={locale.buttonText}
                    className={cls}
                    disabled={disabled}
                    {...buttonProps}
                    onClick={this.onSearch}
                    onKeyDown={this.onKeyDown}
                >
                    {hasIcon ? <Icon type="search" /> : null}
                    {searchText ? (
                        <span className={`${prefix}search-btn-text`}>
                            {searchText}
                        </span>
                    ) : null}
                </Button>
            );
        }

        if (filter.length > 0) {
            filterSelect = (
                <Select
                    {...filterProps}
                    followTrigger={followTrigger}
                    hasBorder={false}
                    dataSource={filter}
                    size={size}
                    disabled={disabled}
                    value={this.state.filterValue}
                    onChange={this.onFilterChange}
                />
            );
        }

        const othersAttributes = obj.pickOthers(Search.propTypes, others);
        if (visible !== undefined) {
            // 受控属性 visible 不能直接写在组件上
            othersAttributes.visible = Boolean(visible);
        }
        const dataAttr = obj.pickAttrsWith(others, 'data-');

        const left = (
            <Group
                addonBefore={filterSelect}
                className={`${prefix}search-left`}
                addonBeforeClassName={`${prefix}search-left-addon`}
            >
                <AutoComplete
                    aria-label={locale.buttonText}
                    {...othersAttributes}
                    followTrigger={followTrigger}
                    role="searchbox"
                    hasClear={hasClear}
                    className={`${prefix}search-input`}
                    size={size}
                    placeholder={placeholder}
                    dataSource={dataSource}
                    innerAfter={searchIcon}
                    onPressEnter={this.onSearch}
                    value={this.state.value}
                    onChange={this.onChange}
                    popupContent={popupContent}
                    disabled={disabled}
                />
            </Group>
        );

        return (
            <span
                className={cls}
                style={style}
                {...dataAttr}
                dir={rtl ? 'rtl' : undefined}
            >
                {searchBtn ? (
                    <Group addonAfter={searchBtn}>{left}</Group>
                ) : (
                    left
                )}
            </span>
        );
    }
}

export default polyfill(Search);
