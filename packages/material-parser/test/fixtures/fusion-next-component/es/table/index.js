import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import ConfigProvider from '../config-provider';
import Base from './base';
import tree from './tree';
import fixed from './fixed';
import selection from './selection';
import expanded from './expanded';
import virtual from './virtual';
import lock from './lock';
import list from './list';
import sticky from './sticky';
import ListHeader from './list-header';
import ListFooter from './list-footer';

var ORDER_LIST = [fixed, lock, selection, expanded, tree, virtual, list, sticky];
var Table = ORDER_LIST.reduce(function (ret, current) {
    ret = current(ret);
    return ret;
}, Base);
Table.Base = Base;
Table.fixed = fixed;
Table.lock = lock;
Table.selection = selection;
Table.expanded = expanded;
Table.tree = tree;
Table.virtual = virtual;
Table.list = list;
Table.sticky = sticky;

Table.GroupHeader = ListHeader;
Table.GroupFooter = ListFooter;

export default ConfigProvider.config(Table, {
    componentName: 'Table',
    transform: /* istanbul ignore next */function transform(props, deprecated) {
        if ('expandedRowKeys' in props) {
            deprecated('expandedRowKeys', 'openRowKeys', 'Table');

            var _props = props,
                expandedRowKeys = _props.expandedRowKeys,
                others = _objectWithoutProperties(_props, ['expandedRowKeys']);

            props = _extends({ openRowKeys: expandedRowKeys }, others);
        }
        if ('onExpandedChange' in props) {
            deprecated('onExpandedChange', 'onRowOpen', 'Table');

            var _props2 = props,
                onExpandedChange = _props2.onExpandedChange,
                _others = _objectWithoutProperties(_props2, ['onExpandedChange']);

            props = _extends({ onRowOpen: onExpandedChange }, _others);
        }
        if ('isLoading' in props) {
            deprecated('isLoading', 'loading', 'Table');

            var _props3 = props,
                isLoading = _props3.isLoading,
                _others2 = _objectWithoutProperties(_props3, ['isLoading']);

            props = _extends({ loading: isLoading }, _others2);
        }
        if ('indentSize' in props) {
            deprecated('indentSize', 'indent', 'Table');

            var _props4 = props,
                indentSize = _props4.indentSize,
                _others3 = _objectWithoutProperties(_props4, ['indentSize']);

            props = _extends({ indent: indentSize }, _others3);
        }
        if ('optimization' in props) {
            deprecated('optimization', 'pure', 'Table');

            var _props5 = props,
                optimization = _props5.optimization,
                _others4 = _objectWithoutProperties(_props5, ['optimization']);

            props = _extends({ pure: optimization }, _others4);
        }

        if ('getRowClassName' in props) {
            deprecated('getRowClassName', 'getRowProps', 'Table');

            var _props6 = props,
                getRowClassName = _props6.getRowClassName,
                getRowProps = _props6.getRowProps,
                _others5 = _objectWithoutProperties(_props6, ['getRowClassName', 'getRowProps']);

            if (getRowClassName) {
                var newGetRowProps = function newGetRowProps() {
                    return _extends({
                        className: getRowClassName.apply(undefined, arguments)
                    }, getRowProps ? getRowProps.apply(undefined, arguments) : {});
                };

                props = _extends({ getRowProps: newGetRowProps }, _others5);
            } else {
                props = _extends({ getRowProps: getRowProps }, _others5);
            }
        }

        if ('getRowProps' in props) {
            deprecated('getRowProps', 'rowProps', 'Table in 1.15.0');

            var _props7 = props,
                _getRowProps = _props7.getRowProps,
                _others6 = _objectWithoutProperties(_props7, ['getRowProps']);

            props = _extends({ rowProps: _getRowProps }, _others6);
        }

        if ('getCellProps' in props) {
            deprecated('getCellProps', 'cellProps', 'Table in 1.15.0');

            var _props8 = props,
                getCellProps = _props8.getCellProps,
                _others7 = _objectWithoutProperties(_props8, ['getCellProps']);

            props = _extends({ cellProps: getCellProps }, _others7);
        }

        return props;
    }
});