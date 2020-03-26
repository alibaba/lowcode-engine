import React, { PureComponent } from 'react';
import Editor from '@ali/lowcode-editor-core';
import './index.scss';
export interface LeftAreaNavProps {
    editor: Editor;
}
export interface LeftAreaNavState {
    activeKey: string;
}
export default class LeftAreaNav extends PureComponent<LeftAreaNavProps, LeftAreaNavState> {
    static displayName: string;
    private editor;
    private areaManager;
    constructor(props: any);
    componentDidMount(): void;
    componentWillUnmount(): void;
    handleSkeletonUpdate: () => void;
    handlePluginChange: (key: string) => void;
    handlePluginClick: (item: any) => void;
    updateActiveKey: (key: string) => void;
    renderPluginList: (list?: any[]) => any[];
    render(): React.ReactNode;
}
