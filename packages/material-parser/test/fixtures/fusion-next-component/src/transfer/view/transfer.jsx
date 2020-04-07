import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Button from '../../button';
import Icon from '../../icon';
import ConfigProvider from '../../config-provider';
import zhCN from '../../locale/zh-cn';
import { func, obj } from '../../util';
import TransferPanel from '../view/transfer-panel';

const { config } = ConfigProvider;
const { bindCtx } = func;
const { pickOthers } = obj;

/**
 * Transfer
 */
class Transfer extends Component {
    static contextTypes = {
        prefix: PropTypes.string,
    };

    static propTypes = {
        ...ConfigProvider.propTypes,
        prefix: PropTypes.string,
        pure: PropTypes.bool,
        rtl: PropTypes.bool,
        className: PropTypes.string,
        /**
         * 移动选项模式
         */
        mode: PropTypes.oneOf(['normal', 'simple']),
        /**
         * 数据源
         */
        dataSource: PropTypes.arrayOf(PropTypes.object),
        /**
         * （用于受控）当前值
         */
        value: PropTypes.arrayOf(PropTypes.string),
        /**
         * （用于非受控）初始值
         */
        defaultValue: PropTypes.arrayOf(PropTypes.string),
        /**
         * 值发生改变的时候触发的回调函数
         * @param {Array} value 右面板值
         * @param {Array} data 右面板数据
         * @param {Object} extra 额外参数
         * @param {Array} extra.leftValue 左面板值
         * @param {Array} extra.leftData 左面板数据
         * @param {Array} extra.movedValue 发生移动的值
         * @param {Object} extra.movedData 发生移动的数据
         * @param {String} extra.direction 移动的方向，值为'left'或'right'
         */
        onChange: PropTypes.func,
        /**
         * 是否禁用
         */
        disabled: PropTypes.bool,
        /**
         * 是否禁用左侧面板
         */
        leftDisabled: PropTypes.bool,
        /**
         * 是否禁用右侧面板
         */
        rightDisabled: PropTypes.bool,
        /**
         * 列表项渲染函数
         * @param {Object} data 数据
         * @return {ReactNode} 列表项内容
         */
        itemRender: PropTypes.func,
        /**
         * 是否显示搜索框
         */
        showSearch: PropTypes.bool,
        /**
         * 自定义搜索函数
         * @param {String} searchedValue 搜索的内容
         * @param {Object} data 数据
         * @return {Boolean} 是否匹配到
         * @default 根据 label 属性匹配
         */
        filter: PropTypes.func,
        /**
         * 搜索框输入时触发的回调函数
         * @param {String} searchedValue 搜索的内容
         * @param {String} position 搜索面板的位置
         */
        onSearch: PropTypes.func,
        /**
         * 搜索框占位符
         */
        searchPlaceholder: PropTypes.string,
        /**
         * 列表为空显示内容
         */
        notFoundContent: PropTypes.node,
        /**
         * 左右面板标题
         */
        titles: PropTypes.arrayOf(PropTypes.node),
        /**
         * 向右向左移动按钮显示内容
         * @default [<Icon type="arrow-right" />, <Icon type="arrow-left" />]
         */
        operations: PropTypes.arrayOf(PropTypes.node),
        /**
         * 左面板默认选中值
         */
        defaultLeftChecked: PropTypes.arrayOf(PropTypes.string),
        /**
         * 右面板默认选中值
         */
        defaultRightChecked: PropTypes.arrayOf(PropTypes.string),
        /**
         * 左右面板列表自定义样式类名
         */
        listClassName: PropTypes.string,
        /**
         * 左右面板列表自定义样式对象
         */
        listStyle: PropTypes.object,
        /**
         * 是否允许拖拽排序
         */
        sortable: PropTypes.bool,
        /**
         * 拖拽排序时触发的回调函数
         * @param {Array} value 排序后的值
         * @param {String} position 拖拽的面板位置，值为：left 或 right
         */
        onSort: PropTypes.func,
        /**
         * 自定义国际化文案对象
         */
        locale: PropTypes.object,
        /**
         * 请设置 id 以保证transfer的可访问性
         */
        id: PropTypes.string,
        /**
         * 接收 children 自定义渲染列表
         */
        children: PropTypes.func,
    };

    static defaultProps = {
        prefix: 'next-',
        pure: false,
        mode: 'normal',
        dataSource: [],
        defaultValue: [],
        disabled: false,
        leftDisabled: false,
        rightDisabled: false,
        itemRender: data => data.label,
        showSearch: false,
        filter: (searchedValue, data) => {
            let labelString = '';
            const loop = arg => {
                if (React.isValidElement(arg) && arg.props.children) {
                    React.Children.forEach(arg.props.children, loop);
                } else if (typeof arg === 'string') {
                    labelString += arg;
                }
            };
            loop(data.label);

            return (
                labelString.length >= searchedValue.length &&
                labelString.indexOf(searchedValue) > -1
            );
        },
        onSearch: () => {},
        notFoundContent: 'Not Found',
        titles: [],
        operations: [],
        defaultLeftChecked: [],
        defaultRightChecked: [],
        sortable: false,
        onSort: () => {},
        locale: zhCN.Transfer,
    };

    static normalizeValue(value) {
        if (value) {
            if (Array.isArray(value)) {
                return value;
            }
            /* istanbul ignore next */
            return [value];
        }

        return [];
    }

    constructor(props, context) {
        super(props, context);

        const {
            value,
            defaultValue,
            defaultLeftChecked,
            defaultRightChecked,
            dataSource,
            rtl,
            operations,
        } = props;
        if (operations.length === 0) {
            operations.push(<Icon rtl={rtl} type="arrow-right" />);
            operations.push(<Icon rtl={rtl} type="arrow-left" />);
        }
        const { left, right } = this.filterCheckedValue(
            Transfer.normalizeValue(defaultLeftChecked),
            Transfer.normalizeValue(defaultRightChecked),
            dataSource
        );

        this.state = {
            value: Transfer.normalizeValue(
                'value' in props ? value : defaultValue
            ),
            leftCheckedValue: left,
            rightCheckedValue: right,
        };

        this.leftValue = this.getLeftValue(dataSource, this.state.value);

        bindCtx(this, [
            'handlePanelChange',
            'handlePanelSort',
            'handleMoveItem',
            'handleSimpleMove',
            'handleSimpleMoveAll',
        ]);
    }

    componentWillReceiveProps(nextProps) {
        const st = {};

        let newValue;
        if ('value' in nextProps) {
            const value = Transfer.normalizeValue(nextProps.value);
            st.value = value;
            newValue = value;
        } else {
            /* istanbul ignore next */
            newValue = this.state.value;
        }
        this.leftValue = this.getLeftValue(nextProps.dataSource, newValue);

        const { left, right } = this.filterCheckedValue(
            this.state.leftCheckedValue,
            this.state.rightCheckedValue,
            nextProps.dataSource
        );
        st.leftCheckedValue = left;
        st.rightCheckedValue = right;

        this.setState(st);
    }

    filterCheckedValue(left, right, dataSource) {
        const result = {
            left: [],
            right: [],
        };

        if (left.length || right.length) {
            const value = dataSource.map(item => item.value);
            value.forEach(itemValue => {
                if (left.indexOf(itemValue) > -1) {
                    result.left.push(itemValue);
                } else if (right.indexOf(itemValue) > -1) {
                    result.right.push(itemValue);
                }
            });
        }

        return result;
    }

    getLeftValue(dataSource, rightValue) {
        return dataSource
            .map(item => item.value)
            .filter(itemValue => {
                return rightValue.indexOf(itemValue) === -1;
            });
    }

    groupDatasource(value, itemValues, dataSource) {
        return value.reduce((ret, itemValue) => {
            const index = itemValues.indexOf(itemValue);
            if (index > -1) {
                ret.push(dataSource[index]);
            }
            return ret;
        }, []);
    }

    handlePanelChange(position, value) {
        const valuePropName =
            position === 'left' ? 'leftCheckedValue' : 'rightCheckedValue';
        this.setState({
            [valuePropName]: value,
        });
    }

    handlePanelSort(position, dragValue, referenceValue, dragGap) {
        const value = position === 'right' ? this.state.value : this.leftValue;
        const currentIndex = value.indexOf(dragValue);
        const referenceIndex = value.indexOf(referenceValue);
        let expectIndex =
            dragGap === 'before' ? referenceIndex : referenceIndex + 1;
        if (currentIndex === expectIndex) {
            return;
        }

        value.splice(currentIndex, 1);
        if (currentIndex < expectIndex) {
            expectIndex = expectIndex - 1;
        }
        value.splice(expectIndex, 0, dragValue);

        this.setState(
            {
                value: this.state.value,
            },
            () => {
                this.props.onSort(value, position);
            }
        );
    }

    handleMoveItem(direction) {
        let rightValue;
        let leftValue;
        let movedValue;
        let valuePropName;

        const { value, leftCheckedValue, rightCheckedValue } = this.state;

        if (direction === 'right') {
            rightValue = leftCheckedValue.concat(value);
            leftValue = this.leftValue.filter(
                itemValue => leftCheckedValue.indexOf(itemValue) === -1
            );
            movedValue = leftCheckedValue;
            valuePropName = 'leftCheckedValue';
        } else {
            rightValue = value.filter(
                itemValue => rightCheckedValue.indexOf(itemValue) === -1
            );
            leftValue = rightCheckedValue.concat(this.leftValue);
            movedValue = rightCheckedValue;
            valuePropName = 'rightCheckedValue';
        }

        const st = { [valuePropName]: [] };

        this.setValueState(st, rightValue, leftValue, movedValue, direction);
    }

    handleSimpleMove(direction, v) {
        let rightValue;
        let leftValue;

        const { value } = this.state;

        if (direction === 'right') {
            rightValue = [v].concat(value);
            leftValue = this.leftValue.filter(itemValue => itemValue !== v);
        } else {
            rightValue = value.filter(itemValue => itemValue !== v);
            leftValue = [v].concat(this.leftValue);
        }

        this.setValueState({}, rightValue, leftValue, [v], direction);
    }

    handleSimpleMoveAll(direction) {
        let rightValue;
        let leftValue;
        let movedValue;

        const { dataSource } = this.props;
        const { value } = this.state;
        const disabledValue = dataSource.reduce((ret, item) => {
            if (item.disabled) {
                ret.push(item.value);
            }

            return ret;
        }, []);

        if (direction === 'right') {
            movedValue = this.leftValue.filter(
                itemValue => disabledValue.indexOf(itemValue) === -1
            );
            rightValue = movedValue.concat(value);
            leftValue = this.leftValue.filter(
                itemValue => disabledValue.indexOf(itemValue) > -1
            );
        } else {
            movedValue = value.filter(
                itemValue => disabledValue.indexOf(itemValue) === -1
            );
            rightValue = value.filter(
                itemValue => disabledValue.indexOf(itemValue) > -1
            );
            leftValue = movedValue.concat(this.leftValue);
        }

        this.setValueState({}, rightValue, leftValue, movedValue, direction);
    }

    // eslint-disable-next-line max-params
    setValueState(st, rightValue, leftValue, movedValue, direction) {
        const { dataSource } = this.props;
        const callback = () => {
            if ('onChange' in this.props) {
                const itemValues = dataSource.map(item => item.value);
                const rightData = this.groupDatasource(
                    rightValue,
                    itemValues,
                    dataSource
                );
                const leftData = this.groupDatasource(
                    leftValue,
                    itemValues,
                    dataSource
                );
                const movedData = this.groupDatasource(
                    movedValue,
                    itemValues,
                    dataSource
                );

                this.props.onChange(rightValue, rightData, {
                    leftValue,
                    leftData,
                    movedValue,
                    movedData,
                    direction,
                });
            }
        };

        if (!('value' in this.props)) {
            st.value = rightValue;
            this.leftValue = leftValue;
        }

        if (Object.keys(st).length) {
            this.setState(st, callback);
        } else {
            // eslint-disable-next-line callback-return
            callback();
        }
    }

    renderCenter() {
        const {
            prefix,
            mode,
            operations,
            disabled,
            leftDisabled,
            rightDisabled,
            locale,
        } = this.props;
        const { leftCheckedValue, rightCheckedValue } = this.state;
        return (
            <div className={`${prefix}transfer-operations`}>
                {mode === 'simple' ? (
                    <Icon
                        className={`${prefix}transfer-move`}
                        size="large"
                        type="switch"
                    />
                ) : (
                    [
                        <Button
                            aria-label={locale.moveToRight}
                            key="l2r"
                            className={`${prefix}transfer-operation`}
                            type={
                                leftCheckedValue.length ? 'primary' : 'normal'
                            }
                            disabled={
                                leftDisabled ||
                                disabled ||
                                !leftCheckedValue.length
                            }
                            onClick={this.handleMoveItem.bind(this, 'right')}
                        >
                            {operations[0]}
                        </Button>,
                        <Button
                            aria-label={locale.moveToLeft}
                            key="r2l"
                            className={`${prefix}transfer-operation`}
                            type={
                                rightCheckedValue.length ? 'primary' : 'normal'
                            }
                            disabled={
                                rightDisabled ||
                                disabled ||
                                !rightCheckedValue.length
                            }
                            onClick={this.handleMoveItem.bind(this, 'left')}
                        >
                            {operations[1]}
                        </Button>,
                    ]
                )}
            </div>
        );
    }

    render() {
        const {
            prefix,
            mode,
            disabled,
            className,
            dataSource,
            locale,
            showSearch,
            filter,
            onSearch,
            leftDisabled,
            rightDisabled,
            searchPlaceholder,
            notFoundContent,
            titles,
            listClassName,
            listStyle,
            itemRender,
            sortable,
            rtl,
            id,
            children,
        } = this.props;
        const { value, leftCheckedValue, rightCheckedValue } = this.state;
        const itemValues = dataSource.map(item => item.value);
        const leftDatasource = this.groupDatasource(
            this.leftValue,
            itemValues,
            dataSource
        );
        const rightDatasource = this.groupDatasource(
            value,
            itemValues,
            dataSource
        );
        const panelProps = {
            prefix,
            mode,
            locale,
            showSearch,
            filter,
            onSearch,
            searchPlaceholder,
            notFoundContent,
            listClassName,
            listStyle,
            itemRender,
            onMove: this.handleSimpleMove,
            onMoveAll: this.handleSimpleMoveAll,
            onChange: this.handlePanelChange,
            sortable,
            onSort: this.handlePanelSort,
            baseId: id,
            customerList: children,
        };
        const others = pickOthers(Object.keys(Transfer.propTypes), this.props);

        if (rtl) {
            others.dir = 'rtl';
        }
        return (
            <div
                className={cx(`${prefix}transfer`, className)}
                id={id}
                {...others}
            >
                <TransferPanel
                    {...panelProps}
                    position="left"
                    dataSource={leftDatasource}
                    disabled={leftDisabled || disabled}
                    value={leftCheckedValue}
                    title={titles[0]}
                />
                {this.renderCenter()}
                <TransferPanel
                    {...panelProps}
                    position="right"
                    dataSource={rightDatasource}
                    disabled={rightDisabled || disabled}
                    value={rightCheckedValue}
                    title={titles[1]}
                />
            </div>
        );
    }
}

export default config(Transfer);
