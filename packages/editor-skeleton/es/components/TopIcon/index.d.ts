import { PureComponent } from 'react';
import './index.scss';
export default class TopIcon extends PureComponent {
    static displayName: string;
    static propTypes: {
        active: any;
        className: any;
        disabled: any;
        icon: any;
        id: any;
        locked: any;
        onClick: any;
        showTitle: any;
        style: any;
        title: any;
    };
    static defaultProps: {
        active: boolean;
        className: string;
        disabled: boolean;
        icon: string;
        id: string;
        locked: boolean;
        onClick: () => void;
        showTitle: boolean;
        style: {};
        title: string;
    };
    render(): JSX.Element;
}
