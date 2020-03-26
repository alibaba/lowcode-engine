import React, { PureComponent } from 'react';
import Editor from '@ali/lowcode-editor-core';
import { PluginConfig, PluginClass } from '@ali/lowcode-editor-core/lib/definitions';
import './index.scss';
export interface TopPluginProps {
    active?: boolean;
    config: PluginConfig;
    disabled?: boolean;
    editor: Editor;
    locked?: boolean;
    marked?: boolean;
    onClick?: () => void;
    pluginClass: PluginClass | undefined;
}
export interface TopPluginState {
    dialogVisible: boolean;
}
export default class TopPlugin extends PureComponent<TopPluginProps, TopPluginState> {
    static displayName: string;
    static defaultProps: {
        active: boolean;
        config: {};
        disabled: boolean;
        marked: boolean;
        locked: boolean;
        onClick: () => void;
    };
    constructor(props: any, context: any);
    componentDidMount(): void;
    componentWillUnmount(): void;
    handleShow: () => void;
    handleClose: () => void;
    handleOpen: () => void;
    renderIcon: (clickCallback: any) => any;
    render(): React.ReactNode;
}
