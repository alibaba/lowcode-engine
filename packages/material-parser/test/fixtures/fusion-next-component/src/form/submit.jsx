import React from 'react';
import PropTypes from 'prop-types';
import Button from '../button';
import { func, obj } from '../util';

/**
 * Form.Submit
 * @description 继承 Button API
 * @order 2
 */
class Submit extends React.Component {
    static propTypes = {
        /**
         * 点击提交后触发
         * @param {Object} value 数据
         * @param {Object} errors 错误数据
         * @param {class} field 实例
         */
        onClick: PropTypes.func,
        /**
         * 是否校验/需要校验的 name 数组
         */
        validate: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
        /**
         * 自定义 field (在 Form 内不需要设置)
         */
        field: PropTypes.object,
        children: PropTypes.node,
    };

    static defaultProps = {
        onClick: func.noop,
    };

    static contextTypes = {
        _formField: PropTypes.object,
    };

    handleClick = () => {
        const { onClick, validate } = this.props;
        const field = this.context._formField || this.props.field;

        if (!field) {
            onClick();
            return;
        }

        if (validate === true) {
            field.validate(errors => {
                onClick(field.getValues(), errors, field);
            });
        } else if (Array.isArray(validate)) {
            field.validate(validate, errors => {
                onClick(field.getValues(), errors, field);
            });
        } else {
            onClick(field.getValues(), null, field);
        }
    };

    render() {
        const { children } = this.props;

        return (
            <Button
                {...obj.pickOthers(Submit.propTypes, this.props)}
                onClick={this.handleClick}
            >
                {children}
            </Button>
        );
    }
}

export default Submit;
