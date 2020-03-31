import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../config-provider';

/**
 * Form.Error
 * @description 自定义错误展示
 * @order 4
 */
class Error extends React.Component {
    static propTypes = {
        /**
         * 表单名
         */
        name: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        /**
         * 自定义 field (在 Form 内不需要设置)
         */
        field: PropTypes.object,
        style: PropTypes.object,
        className: PropTypes.string,
        /**
         * 自定义错误渲染, 可以是 node 或者 function(errors, state)
         */
        children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
        prefix: PropTypes.string,
    };

    static defaultProps = {
        prefix: 'next-',
    };

    static contextTypes = {
        _formField: PropTypes.object,
    };

    static _typeMark = 'form_error';

    itemRender = errors => {
        return errors.length ? errors : null;
    };

    render() {
        const {
            children,
            name,
            prefix,
            style,
            className,
            field: _field,
            ...others
        } = this.props;

        if (children && typeof children !== 'function') {
            return <div className={`${prefix}form-item-help`}>{children}</div>;
        }

        const field = this.context._formField || _field;

        if (!field || !name) {
            return null;
        }

        const isSingle = typeof name === 'string';

        const names = isSingle ? [name] : name;
        const errorArr = [];

        if (names.length) {
            const errors = field.getErrors(names);
            Object.keys(errors).forEach(key => {
                if (errors[key]) {
                    errorArr.push(errors[key]);
                }
            });
        }

        let result = null;
        if (typeof children === 'function') {
            result = children(
                errorArr,
                isSingle ? field.getState(name) : undefined
            );
        } else {
            result = this.itemRender(errorArr);
        }

        if (!result) {
            return null;
        }

        const cls = classNames({
            [`${prefix}form-item-help`]: true,
            [className]: className,
        });

        return (
            <div {...others} className={cls} style={style}>
                {result}
            </div>
        );
    }
}

export default ConfigProvider.config(Error);
