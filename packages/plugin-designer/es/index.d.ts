import React, { PureComponent } from 'react';
import Editor from '@ali/lowcode-editor-core';
import { PluginConfig } from '@ali/lowcode-editor-core/lib/definitions';
import './index.scss';
export interface PluginProps {
    editor: Editor;
    config: PluginConfig;
}
export default class DesignerPlugin extends PureComponent<PluginProps> {
    displayName: 'LowcodePluginDesigner';
    componentDidMount(): void;
    componentWillUmount(): void;
    handleSchemaReset: (schema: object) => void;
    handleDesignerMount: (designer: any) => void;
    render(): React.ReactNode;
}
