import { PureComponent } from 'react';
import './index.scss';
export default class LeftAddon extends PureComponent {
    static displayName: string;
    static propTypes: {
        active: any;
        config: any;
        disabled: any;
        dotted: any;
        locked: any;
        onClick: any;
    };
    static defaultProps: {
        active: boolean;
        config: {};
        disabled: boolean;
        dotted: boolean;
        locked: boolean;
        onClick: () => void;
    };
    static contextType: any;
    constructor(props: any, context: any);
    componentDidMount(): void;
    componentWillUnmount(): void;
    handleClose: () => void;
    handleOpen: () => void;
    handleShow: () => void;
    renderIcon: (clickCallback: any) => JSX.Element;
    render(): JSX.Element;
}
