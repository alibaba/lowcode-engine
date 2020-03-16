import { PureComponent } from 'react';
import './index.scss';
export default class TopPlugin extends PureComponent {
    static displayName: string;
    static defaultProps: {
        active: boolean;
        config: {};
        disabled: boolean;
        dotted: boolean;
        locked: boolean;
        onClick: () => void;
    };
    constructor(props: any, context: any);
    componentDidMount(): void;
    componentWillUnmount(): void;
    handleShow: () => void;
    handleClose: () => void;
    handleOpen: () => void;
    renderIcon: (clickCallback: any) => JSX.Element;
    render(): JSX.Element;
}
