import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import ConfigProvider from '../config-provider';
import Slider from './slider';

export default ConfigProvider.config(Slider, {
    exportNames: ['resize'],
    transform: /* istanbul ignore next */function transform(props, deprecated) {
        if ('fade' in props) {
            deprecated('fade', 'animation', 'Slider');

            var _props = props,
                fade = _props.fade,
                others = _objectWithoutProperties(_props, ['fade']);

            if (fade) {
                props = _extends({ animation: 'fade' }, others);
            } else {
                props = others;
            }
        }
        if ('arrowPos' in props) {
            if (props.arrowPos === 'inline') {
                deprecated('arrowPos=inline', 'arrowPosition=inner', 'Slider');

                props.arrowPos = 'inner';
            } else {
                deprecated('arrowPos', 'arrowPosition', 'Slider');
            }

            var _props2 = props,
                arrowPos = _props2.arrowPos,
                _others = _objectWithoutProperties(_props2, ['arrowPos']);

            props = _extends({ arrowPosition: arrowPos }, _others);
        }
        ['arrowDirection', 'dotsDirection', 'slideDirection'].forEach(function (propName) {
            if (props[propName] === 'horizontal') {
                deprecated(propName + '=horizontal', propName + '=hoz', 'Slider');

                props[propName] = 'hoz';
            } else if (props[propName] === 'vertical') {
                deprecated(propName + '=vertical', propName + '=ver', 'Slider');

                props[propName] = 'ver';
            }
        });
        if ('initialSlide' in props) {
            deprecated('initialSlide', 'defaultActiveIndex', 'Slider');

            var _props3 = props,
                initialSlide = _props3.initialSlide,
                _others2 = _objectWithoutProperties(_props3, ['initialSlide']);

            props = _extends({ defaultActiveIndex: initialSlide }, _others2);
        }
        if ('slickGoTo' in props) {
            deprecated('slickGoTo', 'activeIndex', 'Slider');

            var _props4 = props,
                slickGoTo = _props4.slickGoTo,
                _others3 = _objectWithoutProperties(_props4, ['slickGoTo']);

            props = _extends({ activeIndex: slickGoTo }, _others3);
        }
        if ('afterChange' in props) {
            deprecated('afterChange', 'onChange', 'Slider');

            var _props5 = props,
                afterChange = _props5.afterChange,
                _others4 = _objectWithoutProperties(_props5, ['afterChange']);

            props = _extends({ onChange: afterChange }, _others4);
        }

        if ('beforeChange' in props) {
            deprecated('beforeChange', 'onBeforeChange', 'Slider');

            var _props6 = props,
                beforeChange = _props6.beforeChange,
                _others5 = _objectWithoutProperties(_props6, ['beforeChange']);

            props = _extends({ onBeforeChange: beforeChange }, _others5);
        }

        return props;
    }
});