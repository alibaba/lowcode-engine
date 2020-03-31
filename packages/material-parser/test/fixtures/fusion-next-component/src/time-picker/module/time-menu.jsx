import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { checkMomentObj } from '../utils';

function scrollTo(element, to, duration) {
    const requestAnimationFrame =
        window.requestAnimationFrame ||
        function requestAnimationFrameTimeout(...params) {
            return setTimeout(params[0], 10);
        };

    if (duration <= 0) {
        element.scrollTop = to;
        return;
    }

    const difference = to - element.scrollTop;
    const perTick = (difference / duration) * 10;

    requestAnimationFrame(() => {
        element.scrollTop = element.scrollTop + perTick;

        if (element.scrollTop === to) {
            return;
        }

        scrollTo(element, to, duration - 10);
    });
}

const noop = () => {};

class TimeMenu extends React.Component {
    static propTypes = {
        prefix: PropTypes.string,
        title: PropTypes.node,
        mode: PropTypes.oneOf(['hour', 'minute', 'second']),
        step: PropTypes.number,
        activeIndex: PropTypes.number,
        value: checkMomentObj,
        disabledItems: PropTypes.func,
        renderTimeMenuItems: PropTypes.func,
        onSelect: PropTypes.func,
        disabled: PropTypes.bool,
    };

    static defaultProps = {
        step: 1,
        disabledItems: () => false,
        renderTimeMenuItems: list => list,
        onSelect: () => {},
        disabled: false,
    };

    componentDidMount() {
        this.scrollToSelected(0);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.activeIndex !== this.props.activeIndex) {
            this.scrollToSelected(120);
        }
    }

    scrollToSelected(duration = 0) {
        const { activeIndex, step } = this.props;
        const targetIndex = Math.floor((activeIndex || 0) / step);
        const firstItem = this.menu.children[targetIndex];
        const offsetTo = firstItem.offsetTop;
        scrollTo(this.menu, offsetTo, duration);
    }

    _menuRefHandler = ref => {
        this.menu = ref;
    };

    createMenuItems = list => {
        const {
            prefix,
            mode,
            disabled,
            disabledItems,
            activeIndex,
            onSelect,
            renderTimeMenuItems,
            value: timeValue,
        } = this.props;
        list = renderTimeMenuItems(list, mode, timeValue) || list;

        return list.map(({ label, value }) => {
            const isDisabled = disabled || disabledItems(value);
            const itemCls = classnames({
                [`${prefix}time-picker-menu-item`]: true,
                [`${prefix}disabled`]: isDisabled,
                [`${prefix}selected`]: value === activeIndex,
            });
            const onClick = isDisabled ? noop : () => onSelect(value, mode);
            return (
                <li
                    role="option"
                    aria-selected={String(value === activeIndex)}
                    key={value}
                    title={value}
                    className={itemCls}
                    onClick={onClick}
                >
                    {label}
                </li>
            );
        });
    };

    render() {
        const { prefix, title, mode, step } = this.props;
        const total = mode === 'hour' ? 24 : 60;
        const list = [];
        for (let i = 0; i < total; i++) {
            if (i % step === 0) {
                list.push({
                    label: i,
                    value: i,
                });
            }
        }

        const menuTitle = title ? (
            <div className={`${prefix}time-picker-menu-title`}>{title}</div>
        ) : null;

        return (
            <div className={`${prefix}time-picker-menu`}>
                {menuTitle}
                <ul
                    role="listbox"
                    className={`${prefix}time-picker-menu-${mode}`}
                    ref={this._menuRefHandler}
                >
                    {this.createMenuItems(list)}
                </ul>
            </div>
        );
    }
}

export default TimeMenu;
