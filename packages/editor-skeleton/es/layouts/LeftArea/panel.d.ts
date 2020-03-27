import React, { PureComponent } from 'react';
import Editor from '@ali/lowcode-editor-core';
import './index.scss';
export interface LeftAreaPanelProps {
    editor: Editor;
}
export interface LeftAreaPanelState {
    activeKey: string;
}
export default class LeftAreaPanel extends PureComponent<LeftAreaPanelProps, LeftAreaPanelState> {
    static displayName: string;
    private editor;
    private areaManager;
    constructor(props: any);
    componentDidMount(): void;
    componentWillUnmount(): void;
    handleSkeletonUpdate: () => void;
    handlePluginChange: (key: string) => void;
    render(): React.ReactNode;
}
