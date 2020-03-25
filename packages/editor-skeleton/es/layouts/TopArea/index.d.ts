import React, { PureComponent } from 'react';
import Editor from '@ali/lowcode-editor-framework';
import { PluginConfig } from '@ali/lowcode-editor-framework/lib/definitions';
import './index.scss';
export interface TopAreaProps {
    editor: Editor;
}
export default class TopArea extends PureComponent<TopAreaProps> {
    static displayName: string;
    private areaManager;
    private editor;
    constructor(props: any);
    componentDidMount(): void;
    componentWillUnmount(): void;
    handleSkeletonUpdate: () => void;
    renderPluginList: (list?: PluginConfig[]) => any[];
    render(): React.ReactNode;
}
