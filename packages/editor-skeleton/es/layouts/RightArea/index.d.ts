import React, { PureComponent } from 'react';
import Editor from '@ali/lowcode-editor-framework';
import { PluginConfig } from '@ali/lowcode-editor-framework/lib/definitions';
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
    renderTabTitle: (config: PluginConfig) => any;
    renderTabPanels: (list: PluginConfig[], height: string) => any;
    renderPanels: (list: PluginConfig[], height: string) => any;
    render(): React.ReactNode;
}
