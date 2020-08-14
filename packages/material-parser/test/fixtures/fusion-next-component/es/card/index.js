import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import ConfigProvider from '../config-provider';
import Card from './card';
import CardHeader from './header';
import CardBulletHeader from './bullet-header';
import CardMedia from './media';
import CardDivider from './divider';
import CardContent from './content';
import CollaspeContent from './collapse-content';
import CardActions from './actions';

Card.Header = CardHeader;
Card.Media = CardMedia;
Card.Divider = CardDivider;
Card.Content = CardContent;
Card.Actions = CardActions;
Card.BulletHeader = CardBulletHeader;
Card.CollaspeContent = CollaspeContent;

export default ConfigProvider.config(Card, {
    transform: /* istanbul ignore next */function transform(props, deprecated) {
        if ('titlePrefixLine' in props) {
            deprecated('titlePrefixLine', 'showTitleBullet', 'Card');

            var _props = props,
                titlePrefixLine = _props.titlePrefixLine,
                others = _objectWithoutProperties(_props, ['titlePrefixLine']);

            props = _extends({ showTitleBullet: titlePrefixLine }, others);
        }
        if ('titleBottomLine' in props) {
            deprecated('titleBottomLine', 'showHeadDivider', 'Card');

            var _props2 = props,
                titleBottomLine = _props2.titleBottomLine,
                _others = _objectWithoutProperties(_props2, ['titleBottomLine']);

            props = _extends({ showHeadDivider: titleBottomLine }, _others);
        }
        if ('bodyHeight' in props) {
            deprecated('bodyHeight', 'contentHeight', 'Card');

            var _props3 = props,
                bodyHeight = _props3.bodyHeight,
                _others2 = _objectWithoutProperties(_props3, ['bodyHeight']);

            props = _extends({ contentHeight: bodyHeight }, _others2);
        }

        return props;
    }
});