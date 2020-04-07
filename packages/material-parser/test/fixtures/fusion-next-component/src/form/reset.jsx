import React from 'react';
import PropTypes from 'prop-types';
import Button from '../button';
import { func, obj } from '../util';

/**
 * Form.Reset
 * @description 继承 Button API
 * @order 3
 */
class Reset extends React.Component {
    static propTypes = {
        /**
         * 自定义重置的字段
         */
        names: PropTypes.array,
        /**
         * 点击提交后触发
         */
        onClick: PropTypes.func,
        /**
         * 返回默认值
         */
        toDefault: PropTypes.bool,
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
        const { names, toDefault, onClick } = this.props;
        const field = this.context._formField || this.props.field;

        if (!field) {
            onClick();
            return;
        }

        if (toDefault) {
            field.resetToDefault(names);
        } else {
            field.reset(names);
        }

        onClick();
    };

    render() {
        const { children } = this.props;

        return (
            <Button
                {...obj.pickOthers(Reset.propTypes, this.props)}
                onClick={this.handleClick}
            >
                {children}
            </Button>
        );
    }
}

export default Reset;
