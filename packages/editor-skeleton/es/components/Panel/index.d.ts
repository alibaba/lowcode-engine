import React, { PureComponent } from 'react';
import './index.scss';
export interface PanelProps {
    align: 'left' | 'right';
    defaultWidth: number;
    minWidth: number;
    draggable: boolean;
    floatable: boolean;
    children: Plugin;
    visible: boolean;
}
export interface PanelState {
    width: number;
}
export default class Panel extends PureComponent<PanelProps, PanelState> {
    static displayName: string;
    static defaultProps: {
        align: string;
        defaultWidth: number;
        minWidth: number;
        draggable: boolean;
        floatable: boolean;
        visible: boolean;
    };
    constructor(props: any);
    render(): React.ReactNode;
}
