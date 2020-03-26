import React, { PureComponent } from 'react';
import Editor from '@ali/lowcode-editor-core';
import './index.scss';
export interface CenterAreaProps {
    editor: Editor;
}
export default class CenterArea extends PureComponent<CenterAreaProps> {
    static displayName: string;
    private editor;
    private areaManager;
    constructor(props: any);
    componentDidMount(): void;
    componentWillUnmount(): void;
    handleSkeletonUpdate: () => void;
    render(): React.ReactNode;
}
