import React from 'react';
import PropTypes from 'prop-types';
import Header from './fixed/header';
import StickyHeader from './sticky/header';
import { statics } from './util';

export default function sticky(BaseComponent) {
    /** Table */
    class StickyTable extends React.Component {
        static StickyHeader = StickyHeader;
        static propTypes = {
            /**
             * 表头是否是sticky
             */
            stickyHeader: PropTypes.bool,
            /**
             * 距离窗口顶部达到指定偏移量后触发
             */
            offsetTop: PropTypes.number,
            /**
             * affix组件的的属性
             */
            affixProps: PropTypes.object,
            components: PropTypes.object,
            ...BaseComponent.propTypes,
        };

        static defaultProps = {
            components: {},
            ...BaseComponent.defaultProps,
        };

        static childContextTypes = {
            Header: PropTypes.any,
            offsetTop: PropTypes.number,
            affixProps: PropTypes.object,
        };

        getChildContext() {
            return {
                Header: this.props.components.Header || Header,
                offsetTop: this.props.offsetTop,
                affixProps: this.props.affixProps,
            };
        }

        render() {
            /* eslint-disable no-unused-vars */
            const {
                stickyHeader,
                offsetTop,
                affixProps,
                ...others
            } = this.props;
            let { components, maxBodyHeight, fixedHeader } = this.props;
            if (stickyHeader) {
                components = { ...components };
                components.Header = StickyHeader;
                fixedHeader = true;
                maxBodyHeight = Math.max(maxBodyHeight, 10000);
            }
            return (
                <BaseComponent
                    {...others}
                    components={components}
                    fixedHeader={fixedHeader}
                    maxBodyHeight={maxBodyHeight}
                />
            );
        }
    }
    statics(StickyTable, BaseComponent);
    return StickyTable;
}
