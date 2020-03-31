import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { polyfill } from 'react-lifecycles-compat';

import { obj } from '../../util';
import ConfigProvider from '../../config-provider';
import nextLocale from '../../locale/zh-cn';

/** Timeline */
class Timeline extends Component {
    static propTypes = {
        ...ConfigProvider.propTypes,
        /**
         * 样式的品牌前缀
         */
        prefix: PropTypes.string,
        rtl: PropTypes.bool,
        /**
         * 自定义折叠选项 示例`[{foldArea: [startIndex, endIndex], foldShow: boolean}]`
         */
        fold: PropTypes.array,
        /**
         * 自定义类名
         */
        className: PropTypes.string,
        children: PropTypes.any,
        locale: PropTypes.object,
        animation: PropTypes.bool,
    };

    static defaultProps = {
        prefix: 'next-',
        rtl: false,
        fold: [],
        locale: nextLocale.Timeline,
        animation: true,
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            fold: props.fold,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { innerUpdate, fold } = prevState;

        if (innerUpdate) {
            return {
                fold,
                innerUpdate: false,
            };
        }

        if ('fold' in nextProps) {
            return {
                fold: nextProps.fold,
            };
        }

        return null;
    }

    toggleFold(folderIndex, total) {
        const fold = this.state.fold.map(item => ({ ...item }));

        if (folderIndex) {
            for (let i = 0; i < fold.length; i++) {
                const { foldArea, foldShow } = fold[i];

                if (
                    (foldArea[1] && folderIndex === foldArea[1]) ||
                    (!foldArea[1] && folderIndex === total - 1)
                ) {
                    fold[i].foldShow = !foldShow;
                }
            }

            this.setState({ fold, innerUpdate: true });
        }
    }

    render() {
        const {
            prefix,
            rtl,
            className,
            children,
            locale,
            animation,
            ...others
        } = this.props;
        const { fold } = this.state;

        // 修改子节点属性
        const childrenCount = React.Children.count(children);
        const cloneChildren = Children.map(children, (child, i) => {
            let folderIndex = null;
            let foldNodeShow = false;

            fold.forEach(item => {
                const { foldArea, foldShow } = item;

                if (
                    foldArea[0] &&
                    i >= foldArea[0] &&
                    (i <= foldArea[1] || !foldArea[1])
                ) {
                    folderIndex = foldArea[1] || childrenCount - 1;
                    foldNodeShow = foldShow;
                }
            });

            return React.cloneElement(child, {
                prefix: prefix,
                locale: locale,
                total: childrenCount,
                index: i,
                folderIndex: folderIndex,
                foldShow: foldNodeShow,
                toggleFold:
                    folderIndex === i
                        ? this.toggleFold.bind(this, folderIndex, childrenCount)
                        : () => {},
                animation: animation,
            });
        });

        const timelineCls = classNames(
            {
                [`${prefix}timeline`]: true,
            },
            className
        );

        if (rtl) {
            others.dir = 'rtl';
        }

        return (
            <ul
                {...obj.pickOthers(Timeline.propTypes, others)}
                className={timelineCls}
            >
                {cloneChildren}
            </ul>
        );
    }
}

export default ConfigProvider.config(polyfill(Timeline));
