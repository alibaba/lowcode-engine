import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Checkbox from '../../checkbox';
import Search from '../../search';
import Menu from '../../menu';
import { func, htmlId } from '../../util';
import TransferItem from './transfer-item';

const { bindCtx } = func;

export default class TransferPanel extends Component {
    static propTypes = {
        prefix: PropTypes.string,
        position: PropTypes.oneOf(['left', 'right']),
        mode: PropTypes.oneOf(['normal', 'simple']),
        dataSource: PropTypes.array,
        value: PropTypes.array,
        onChange: PropTypes.func,
        onMove: PropTypes.func,
        onMoveAll: PropTypes.func,
        disabled: PropTypes.bool,
        locale: PropTypes.object,
        title: PropTypes.node,
        showSearch: PropTypes.bool,
        filter: PropTypes.func,
        onSearch: PropTypes.func,
        searchPlaceholder: PropTypes.string,
        notFoundContent: PropTypes.node,
        listClassName: PropTypes.string,
        listStyle: PropTypes.object,
        itemRender: PropTypes.func,
        sortable: PropTypes.bool,
        onSort: PropTypes.func,
        baseId: PropTypes.string,
        customerList: PropTypes.func,
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            searchedValue: '',
            dragValue: null,
            dragOverValue: null,
        };
        this.footerId = props.baseId
            ? htmlId.escapeForId(
                  `${props.baseId}-panel-footer-${props.position}`
              )
            : '';
        this.headerId = props.baseId
            ? htmlId.escapeForId(
                  `${props.baseId}-panel-header-${props.position}`
              )
            : '';

        bindCtx(this, [
            'handleCheck',
            'handleAllCheck',
            'handleSearch',
            'handleItemDragStart',
            'handleItemDragOver',
            'handleItemDragEnd',
            'handleItemDrop',
            'getListDOM',
        ]);
        this.firstRender = true;
    }

    componentDidMount() {
        this.firstRender = false;
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.dataSource.length !== this.props.dataSource.length &&
            this.list
        ) {
            if (this.list.scrollTop > 0) {
                this.list.scrollTop = 0;
            }
        }

        this.searched = false;
    }

    getListDOM(ref) {
        this.list = ref;
    }

    handleAllCheck(allChecked) {
        const { position, onChange } = this.props;

        let newValue;
        if (allChecked) {
            newValue = this.enabledDatasource.map(item => item.value);
        } else {
            newValue = [];
        }

        onChange && onChange(position, newValue);
    }

    handleCheck(itemValue, checked) {
        const { position, value, onChange } = this.props;

        const newValue = [...value];
        const index = value.indexOf(itemValue);
        if (checked && index === -1) {
            newValue.push(itemValue);
        } else if (!checked && index > -1) {
            newValue.splice(index, 1);
        }

        onChange && onChange(position, newValue);
    }

    handleSearch(searchedValue) {
        this.setState({
            searchedValue,
        });
        this.searched = true;

        const { onSearch, position } = this.props;
        onSearch(searchedValue, position);
    }

    handleItemDragStart(position, value) {
        this.setState({
            dragPosition: position,
            dragValue: value,
        });
    }

    handleItemDragOver(value) {
        this.setState({
            dragOverValue: value,
        });
    }

    handleItemDragEnd() {
        this.setState({
            dragOverValue: null,
        });
    }

    handleItemDrop(...args) {
        this.setState({
            dragOverValue: null,
        });

        this.props.onSort(...args);
    }

    renderHeader() {
        const { title, prefix } = this.props;

        return (
            <div
                id={this.headerId}
                className={`${prefix}transfer-panel-header`}
            >
                {title}
            </div>
        );
    }

    renderSearch() {
        const { prefix, searchPlaceholder, locale } = this.props;
        return (
            <Search
                aria-labelledby={this.headerId}
                shape="simple"
                className={`${prefix}transfer-panel-search`}
                placeholder={searchPlaceholder || locale.searchPlaceholder}
                onChange={this.handleSearch}
            />
        );
    }

    renderList(dataSource) {
        const {
            prefix,
            position,
            mode,
            value,
            onMove,
            disabled,
            listClassName,
            listStyle,
            itemRender,
            sortable,
            customerList,
        } = this.props;
        const { dragPosition, dragValue, dragOverValue } = this.state;
        const newClassName = cx({
            [`${prefix}transfer-panel-list`]: true,
            [listClassName]: !!listClassName,
        });

        const customerPanel = customerList && customerList(this.props);
        if (customerPanel) {
            return (
                <div
                    className={newClassName}
                    style={listStyle}
                    ref={this.getListDOM}
                >
                    {customerPanel}
                </div>
            );
        }

        return dataSource.length ? (
            <Menu
                className={newClassName}
                style={listStyle}
                ref={this.getListDOM}
            >
                {dataSource.map(item => (
                    <TransferItem
                        key={item.value}
                        prefix={prefix}
                        mode={mode}
                        checked={value.indexOf(item.value) > -1}
                        disabled={disabled || item.disabled}
                        item={item}
                        onCheck={this.handleCheck}
                        onClick={onMove}
                        needHighlight={!this.firstRender && !this.searched}
                        itemRender={itemRender}
                        draggable={sortable}
                        onDragStart={this.handleItemDragStart}
                        onDragOver={this.handleItemDragOver}
                        onDragEnd={this.handleItemDragEnd}
                        onDrop={this.handleItemDrop}
                        dragPosition={dragPosition}
                        dragValue={dragValue}
                        dragOverValue={dragOverValue}
                        panelPosition={position}
                    />
                ))}
            </Menu>
        ) : (
            <div className={newClassName} style={listStyle}>
                {this.renderNotFoundContent()}
            </div>
        );
    }

    renderNotFoundContent() {
        const { prefix, notFoundContent } = this.props;

        return (
            <div className={`${prefix}transfer-panel-not-found-container`}>
                <div className={`${prefix}transfer-panel-not-found`}>
                    {notFoundContent}
                </div>
            </div>
        );
    }

    renderFooter() {
        const { prefix, position, mode, disabled, locale } = this.props;
        if (mode === 'simple') {
            const { onMoveAll } = this.props;
            const classNames = cx({
                [`${prefix}transfer-panel-move-all`]: true,
                [`${prefix}disabled`]: disabled,
            });
            return (
                <div className={`${prefix}transfer-panel-footer`}>
                    <a
                        className={classNames}
                        onClick={onMoveAll.bind(
                            this,
                            position === 'left' ? 'right' : 'left'
                        )}
                    >
                        {locale.moveAll}
                    </a>
                </div>
            );
        }

        const { value, dataSource } = this.props;
        const checkedCount = value.length;
        const totalCount = dataSource.length;
        const totalEnabledCount = this.enabledDatasource.length;
        const checked = checkedCount > 0 && checkedCount >= totalEnabledCount;
        const indeterminate =
            checkedCount > 0 && checkedCount < totalEnabledCount;
        const items = totalCount > 1 ? locale.items : locale.item;
        const countLabel =
            checkedCount === 0
                ? `${totalCount} ${items}`
                : `${checkedCount}/${totalCount} ${items}`;

        return (
            <div className={`${prefix}transfer-panel-footer`}>
                <Checkbox
                    disabled={disabled}
                    checked={checked}
                    indeterminate={indeterminate}
                    onChange={this.handleAllCheck}
                    aria-labelledby={this.footerId}
                />
                <span
                    className={`${prefix}transfer-panel-count`}
                    id={this.footerId}
                >
                    {countLabel}
                </span>
            </div>
        );
    }

    render() {
        const { prefix, title, showSearch, filter } = this.props;
        const { searchedValue } = this.state;
        let dataSource = this.props.dataSource;
        this.enabledDatasource = dataSource.filter(item => !item.disabled);
        if (showSearch && searchedValue) {
            dataSource = dataSource.filter(item => filter(searchedValue, item));
        }

        return (
            <div className={`${prefix}transfer-panel`}>
                {title ? this.renderHeader() : null}
                {showSearch ? this.renderSearch() : null}
                {this.renderList(dataSource)}
                {this.renderFooter()}
            </div>
        );
    }
}
