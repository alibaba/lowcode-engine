/* istanbul ignore file */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import Menu from '../../menu';

export default class SelectMenu extends Component {
    static isNextMenu = true;
    static propTypes = {
        dataSource: PropTypes.arrayOf(PropTypes.object),
        value: PropTypes.number,
        prefix: PropTypes.string,
        onChange: PropTypes.func,
        children: PropTypes.node,
    };

    componentDidMount() {
        this.scrollToSelectedItem();
    }

    scrollToSelectedItem() {
        const { prefix, dataSource, value } = this.props;

        const selectedIndex = dataSource.findIndex(
            item => item.value === value
        );

        if (selectedIndex === -1) {
            return;
        }

        const itemSelector = `.${prefix}menu-item`;
        const menu = findDOMNode(this.refs.menu);
        const targetItem = menu.querySelectorAll(itemSelector)[selectedIndex];
        if (targetItem) {
            menu.scrollTop =
                targetItem.offsetTop -
                Math.floor(
                    (menu.clientHeight / targetItem.clientHeight - 1) / 2
                ) *
                    targetItem.clientHeight;
        }
    }

    render() {
        const {
            prefix,
            dataSource,
            onChange,
            value,
            className,
            ...others
        } = this.props;
        return (
            <Menu
                {...others}
                ref="menu"
                selectMode="single"
                selectedKeys={[String(value)]}
                onSelect={selectKeys => onChange(Number(selectKeys[0]))}
                role="listbox"
                className={`${prefix}calendar-panel-menu ${className}`}
            >
                {dataSource.map(({ label, value }) => (
                    <Menu.Item key={value}>{label}</Menu.Item>
                ))}
            </Menu>
        );
    }
}
