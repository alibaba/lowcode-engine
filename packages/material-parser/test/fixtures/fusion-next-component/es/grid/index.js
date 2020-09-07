import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import ConfigProvider from '../config-provider';
import Row from './row';
import Col from './col';

var Grid = {
    Row: ConfigProvider.config(Row, {
        transform: /* istanbul ignore next */function transform(props, deprecated) {
            if ('type' in props) {
                deprecated('type', 'fixed | wrap | gutter', 'Row');

                var _props = props,
                    type = _props.type,
                    others = _objectWithoutProperties(_props, ['type']);

                var types = Array.isArray(type) ? type : [type];
                var fixed = void 0;
                if (types.indexOf('fixed') > -1) {
                    fixed = true;
                }
                var wrap = void 0;
                if (types.indexOf('wrap') > -1) {
                    wrap = true;
                }
                props = _extends({ fixed: fixed, wrap: wrap }, others);
            }

            return props;
        }
    }),
    Col: ConfigProvider.config(Col)
};

export default Grid;