import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Grid from '../grid';
import RGrid from '../responsive-grid';
import { obj } from '../util';
import Error from './error';
import { getFieldInitCfg } from './enhance';

const { Row, Col } = Grid;
const { Cell } = RGrid;

const { isNil } = obj;

/** Form.Item
 *  @description 手动传递了 wrapCol labelCol 会使用 Grid 辅助布局; labelAlign='top' 会强制禁用 Grid
 *  @order 1
 */
export default class Item extends React.Component {
    static propTypes = {
        /**
         * 样式前缀
         */
        prefix: PropTypes.string,
        rtl: PropTypes.bool,
        /**
         * label 标签的文本
         */
        label: PropTypes.node,
        /**
         * label 标签布局，通 `<Col>` 组件，设置 span offset 值，如 {span: 8, offset: 16}，该项仅在垂直表单有效
         */
        labelCol: PropTypes.object,
        /**
         * 需要为输入控件设置布局样式时，使用该属性，用法同 labelCol
         */
        wrapperCol: PropTypes.object,
        /**
         * 自定义提示信息，如不设置，则会根据校验规则自动生成.
         */
        help: PropTypes.node,
        /**
         * 额外的提示信息，和 help 类似，当需要错误信息和提示文案同时出现时，可以使用这个。 位于错误信息后面
         */
        extra: PropTypes.node,
        /**
         * 校验状态，如不设置，则会根据校验规则自动生成
         * @enumdesc 失败, 成功, 校验中, 警告
         */
        validateState: PropTypes.oneOf([
            'error',
            'success',
            'loading',
            'warning',
        ]),
        /**
         * 配合 validateState 属性使用，是否展示 success/loading 的校验状态图标, 目前只有Input支持
         */
        hasFeedback: PropTypes.bool, //TODO: hasFeedback => validateStatus=[error,success,loading]
        /**
         * 自定义内联样式
         */
        style: PropTypes.object,
        id: PropTypes.string,
        /**
         * node 或者 function(values)
         */
        children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
        /**
         * 单个 Item 的 size 自定义，优先级高于 Form 的 size, 并且当组件与 Item 一起使用时，组件自身设置 size 属性无效。
         */
        size: PropTypes.oneOf(['large', 'small', 'medium']),
        /**
         * 单个 Item 中表单类组件宽度是否是100%
         */
        fullWidth: PropTypes.bool,
        /**
         * 标签的位置
         * @enumdesc 上, 左, 内
         */
        labelAlign: PropTypes.oneOf(['top', 'left', 'inset']),
        /**
         * 标签的左右对齐方式
         * @enumdesc 左, 右
         */
        labelTextAlign: PropTypes.oneOf(['left', 'right']),
        /**
         * 扩展class
         */
        className: PropTypes.string,
        /**
         * [表单校验] 不能为空
         */
        required: PropTypes.bool,
        /**
         * required 的星号是否显示
         */
        asterisk: PropTypes.bool,
        /**
         * required 自定义错误信息
         */
        requiredMessage: PropTypes.string,
        /**
         * required 自定义触发方式
         */
        requiredTrigger: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array,
        ]),
        /**
         * [表单校验] 最小值
         */
        min: PropTypes.number,
        /**
         * [表单校验] 最大值
         */
        max: PropTypes.number,
        /**
         * min/max 自定义错误信息
         */
        minmaxMessage: PropTypes.string,
        /**
         * min/max 自定义触发方式
         */
        minmaxTrigger: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        /**
         * [表单校验] 字符串最小长度 / 数组最小个数
         */
        minLength: PropTypes.number,
        /**
         * [表单校验] 字符串最大长度 / 数组最大个数
         */
        maxLength: PropTypes.number,
        /**
         * minLength/maxLength 自定义错误信息
         */
        minmaxLengthMessage: PropTypes.string,
        /**
         * minLength/maxLength 自定义触发方式
         */
        minmaxLengthTrigger: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array,
        ]),
        /**
         * [表单校验] 字符串精确长度 / 数组精确个数
         */
        length: PropTypes.number,
        /**
         * length 自定义错误信息
         */
        lengthMessage: PropTypes.string,
        /**
         * length 自定义触发方式
         */
        lengthTrigger: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        /**
         * 正则校验
         */
        pattern: PropTypes.any,
        /**
         * pattern 自定义错误信息
         */
        patternMessage: PropTypes.string,
        /**
         * pattern 自定义触发方式
         */
        patternTrigger: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array,
        ]),
        /**
         * [表单校验] 四种常用的 pattern
         */
        format: PropTypes.oneOf(['number', 'email', 'url', 'tel']),
        /**
         * format 自定义错误信息
         */
        formatMessage: PropTypes.string,
        /**
         * format 自定义触发方式
         */
        formatTrigger: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        /**
         * [表单校验] 自定义校验函数
         */
        validator: PropTypes.func,
        /**
         * validator 自定义触发方式
         */
        validatorTrigger: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array,
        ]),
        /**
         * 是否修改数据时自动触发校验
         */
        autoValidate: PropTypes.bool,
        /**
         * 预设屏幕宽度
         */
        device: PropTypes.oneOf(['phone', 'tablet', 'desktop']),
        responsive: PropTypes.bool,
        /**
         * 在响应式布局模式下，表单项占多少列
         */
        colSpan: PropTypes.number,
        /**
         * 在响应式布局下，且label在左边时，label的宽度是多少
         */
        labelWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        /**
         * 是否开启预览态
         */
        isPreview: PropTypes.bool,
        /**
         * 预览态模式下渲染的内容
         * @param {any} value 根据包裹的组件的 value 类型而决定
         */
        renderPreview: PropTypes.func,
    };

    static defaultProps = {
        prefix: 'next-',
        hasFeedback: false,
        labelWidth: 100,
    };

    static contextTypes = {
        _formField: PropTypes.object,
        _formSize: PropTypes.oneOf(['large', 'small', 'medium']),
        _formPreview: PropTypes.bool,
        _formFullWidth: PropTypes.bool,
    };

    static _typeMark = 'form_item';

    /**
     * 从子元素里面提取表单组件
     */
    getNames() {
        const children = React.Children.toArray(this.props.children);
        return children
            .filter(c => {
                return c.props && ('name' in c.props || 'data-meta' in c.props);
            })
            .map(c => {
                return c.props.name || c.props.id;
            });
    }

    getHelper() {
        const help = this.props.help;
        const _formField = this.context._formField;

        return (
            <Error
                name={help === undefined ? this.getNames() : undefined}
                field={_formField}
            >
                {help}
            </Error>
        );
    }

    getState() {
        const { validateState } = this.props;
        if (validateState) {
            return validateState;
        }

        if (this.context._formField) {
            const { getState } = this.context._formField;
            const names = this.getNames();
            if (!names.length) {
                return '';
            }

            // get first name
            return getState(names[0]);
        }

        return undefined;
    }

    getSize() {
        return this.props.size || this.context._formSize;
    }

    getIsPreview() {
        return 'isPreview' in this.props
            ? this.props.isPreview
            : this.context._formPreview;
    }

    getFullWidth() {
        return isNil(this.props.fullWidth)
            ? !!this.context._formFullWidth
            : this.props.fullWidth;
    }

    getItemLabel() {
        const {
            id,
            required,
            asterisk = required,
            label,
            labelCol,
            wrapperCol,
            prefix,
            responsive,
            labelWidth,
            labelTextAlign,
        } = this.props;

        const labelAlign = this.getLabelAlign(
            this.props.labelAlign,
            this.props.device
        );

        if (!label) {
            return null;
        }

        const ele = (
            <label
                htmlFor={id || this.getNames()[0]}
                required={asterisk}
                key="label"
            >
                {label}
            </label>
        );

        const cls = classNames({
            [`${prefix}form-item-label`]: true,
            [`${prefix}left`]: labelTextAlign === 'left',
        });

        if (responsive && labelWidth && labelAlign !== 'top') {
            return (
                <div className={cls} style={{ width: labelWidth }}>
                    {ele}
                </div>
            );
        }

        if ((wrapperCol || labelCol) && labelAlign !== 'top') {
            return (
                <Col {...labelCol} className={cls}>
                    {ele}
                </Col>
            );
        }

        return <div className={cls}>{ele}</div>;
    }

    getItemWrapper() {
        const {
            hasFeedback,
            labelCol,
            wrapperCol,
            children,
            extra,
            prefix,
            renderPreview,
        } = this.props;

        const labelAlign = this.getLabelAlign(
            this.props.labelAlign,
            this.props.device
        );

        const state = this.getState();

        const isPreview = this.getIsPreview();
        const childrenProps = {
            size: this.getSize(),
        };

        if (isPreview) {
            childrenProps.isPreview = true;
        }

        if (
            'renderPreview' in this.props &&
            typeof renderPreview === 'function'
        ) {
            childrenProps.renderPreview = renderPreview;
        }

        if (state && (state === 'error' || hasFeedback)) {
            childrenProps.state = state;
        }

        if (labelAlign === 'inset') {
            childrenProps.label = this.getItemLabel();
        }

        let childrenNode = children;
        if (typeof children === 'function' && this.context._formField) {
            childrenNode = children(this.context._formField.getValues());
        }

        const ele = React.Children.map(childrenNode, child => {
            if (
                child &&
                typeof child.type === 'function' &&
                child.type._typeMark !== 'form_item' &&
                child.type._typeMark !== 'form_error'
            ) {
                let extraProps = childrenProps;
                if (
                    this.context._formField &&
                    'name' in child.props &&
                    !('data-meta' in child.props)
                ) {
                    extraProps = this.context._formField.init(
                        child.props.name,
                        {
                            ...getFieldInitCfg(
                                this.props,
                                child.type.displayName
                            ),
                            props: { ...child.props, ref: child.ref },
                        },
                        childrenProps
                    );
                } else {
                    extraProps = Object.assign({}, child.props, extraProps);
                }

                return React.cloneElement(child, extraProps);
            }

            return child;
        });

        const help = this.getHelper();

        if ((wrapperCol || labelCol) && labelAlign !== 'top') {
            return (
                <Col
                    {...wrapperCol}
                    className={`${prefix}form-item-control`}
                    key="item"
                >
                    {ele} {help} {extra}
                </Col>
            );
        }

        return (
            <div className={`${prefix}form-item-control`}>
                {ele} {help} {extra}
            </div>
        );
    }

    getLabelAlign(labelAlign, device) {
        if (device === 'phone') {
            return 'top';
        }

        return labelAlign;
    }

    render() {
        const {
            className,
            style,
            prefix,
            wrapperCol,
            labelCol,
            responsive,
        } = this.props;

        const labelAlign = this.getLabelAlign(
            this.props.labelAlign,
            this.props.device
        );

        const state = this.getState();
        const size = this.getSize();
        const fullWidth = this.getFullWidth();

        const itemClassName = classNames({
            [`${prefix}form-item`]: true,
            [`${prefix}${labelAlign}`]: labelAlign,
            [`has-${state}`]: !!state,
            [`${prefix}${size}`]: !!size,
            [`${prefix}form-item-fullwidth`]: fullWidth,
            [`${className}`]: !!className,
        });

        // 垂直模式并且左对齐才用到
        const Tag = responsive
            ? Cell
            : (wrapperCol || labelCol) && labelAlign !== 'top'
            ? Row
            : 'div';
        const label = labelAlign === 'inset' ? null : this.getItemLabel();

        return (
            <Tag
                {...obj.pickOthers(Item.propTypes, this.props)}
                className={itemClassName}
                style={style}
            >
                {label}
                {this.getItemWrapper()}
            </Tag>
        );
    }
}
