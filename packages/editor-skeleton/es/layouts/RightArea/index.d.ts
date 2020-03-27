import React, { PureComponent } from 'react';
import Editor from '@ali/lowcode-editor-core';
import './index.scss';
export interface RightAreaProps {
    editor: Editor;
}
export interface RightAreaState {
    activeKey: string;
}
export default class RightArea extends PureComponent<RightAreaProps, RightAreaState> {
    static displayName: string;
    private editor;
    private areaManager;
    constructor(props: any);
    componentDidMount(): void;
    componentWillUnmount(): void;
    handleSkeletonUpdate: () => void;
    handlePluginChange: (key: string, isinit?: boolean) => void;
    renderTabTitle: (config: any) => any;
    renderTabPanels: (list: any[], height: string) => any;
    renderPanels: (list: any[], height: string) => any;
    render(): React.ReactNode;
}
