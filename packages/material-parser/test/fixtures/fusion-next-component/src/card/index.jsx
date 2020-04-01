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
    transform: /* istanbul ignore next */ (props, deprecated) => {
        if ('titlePrefixLine' in props) {
            deprecated('titlePrefixLine', 'showTitleBullet', 'Card');
            const { titlePrefixLine, ...others } = props;
            props = { showTitleBullet: titlePrefixLine, ...others };
        }
        if ('titleBottomLine' in props) {
            deprecated('titleBottomLine', 'showHeadDivider', 'Card');
            const { titleBottomLine, ...others } = props;
            props = { showHeadDivider: titleBottomLine, ...others };
        }
        if ('bodyHeight' in props) {
            deprecated('bodyHeight', 'contentHeight', 'Card');
            const { bodyHeight, ...others } = props;
            props = { contentHeight: bodyHeight, ...others };
        }

        return props;
    },
});
