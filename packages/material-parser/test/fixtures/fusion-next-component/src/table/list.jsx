import React, { Children } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ListHeader from './list-header';
import ListFooter from './list-footer';
import RowComponent from './list/row';
import BodyComponent from './list/body';
import HeaderComponent from './fixed/header';
import WrapperComponent from './fixed/wrapper';
import { statics } from './util';

export default function list(BaseComponent) {
    class ListTable extends React.Component {
        static ListHeader = ListHeader;
        static ListFooter = ListFooter;
        static ListRow = RowComponent;
        static ListBody = BodyComponent;
        static propTypes = {
            ...BaseComponent.propTypes,
        };
        static defaultProps = {
            ...BaseComponent.defaultProps,
        };

        static childContextTypes = {
            listHeader: PropTypes.any,
            listFooter: PropTypes.any,
            rowSelection: PropTypes.object,
        };

        getChildContext() {
            return {
                listHeader: this.listHeader,
                listFooter: this.listFooter,
                rowSelection: this.rowSelection,
            };
        }

        normalizeDataSource(dataSource) {
            const ret = [];
            const loop = function(dataSource, level) {
                dataSource.forEach(item => {
                    item.__level = level;
                    ret.push(item);
                    if (item.children) {
                        loop(item.children, level + 1);
                    }
                });
            };
            loop(dataSource, 0);
            this.ds = ret;
            return ret;
        }

        render() {
            /* eslint-disable prefer-const */
            let {
                components,
                children,
                className,
                prefix,
                ...others
            } = this.props;
            let isList = false,
                ret = [];
            Children.forEach(children, child => {
                if (child) {
                    if (typeof child.type === 'function') {
                        if (child.type._typeMark === 'listHeader') {
                            this.listHeader = child.props;
                            isList = true;
                        } else if (child.type._typeMark === 'listFooter') {
                            this.listFooter = child.props;
                        } else {
                            ret.push(child);
                        }
                    } else {
                        ret.push(child);
                    }
                }
            });
            this.rowSelection = this.props.rowSelection;
            if (isList) {
                components = { ...components };
                components.Row = components.Row || RowComponent;
                components.Body = components.Body || BodyComponent;
                components.Header = components.Header || HeaderComponent;
                components.Wrapper = components.Wrapper || WrapperComponent;
                className = classnames({
                    [`${prefix}table-group`]: true,
                    [className]: className,
                });
            }
            return (
                <BaseComponent
                    {...others}
                    components={components}
                    children={ret}
                    className={className}
                    prefix={prefix}
                />
            );
        }
    }
    statics(ListTable, BaseComponent);
    return ListTable;
}
