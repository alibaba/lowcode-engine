import { PureComponent } from 'react';
import './index.scss';
export default class TopArea extends PureComponent {
    static displayName: string;
    constructor(props: any);
    componentDidMount(): void;
    componentWillUnmount(): void;
    handlePluginStatusChange: () => void;
    renderPluginList: (list?: any[]) => JSX.Element[];
    render(): JSX.Element;
}
