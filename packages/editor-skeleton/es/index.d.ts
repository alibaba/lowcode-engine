import React, { PureComponent } from 'react';
import Editor from '@ali/lowcode-editor-framework';
import { EditorConfig, Utils, PluginClassSet } from '@ali/lowcode-editor-framework/lib/definitions';
import './global.scss';
declare global {
    interface Window {
        __ctx: {
            editor: Editor;
            appHelper: Editor;
        };
    }
}
export interface SkeletonProps {
    components: PluginClassSet;
    config: EditorConfig;
    history: object;
    location: object;
    match: object;
    utils: Utils;
}
export interface SkeletonState {
    initReady?: boolean;
    skeletonKey?: string;
    __hasError?: boolean;
}
export declare class Skeleton extends PureComponent<SkeletonProps, SkeletonState> {
    static displayName: string;
    static getDerivedStateFromError(): SkeletonState;
    private editor;
    constructor(props: any);
    componentWillUnmount(): void;
    componentDidCatch(err: any): void;
    init: (isReset?: boolean) => void;
    render(): React.ReactNode;
}
export interface SkeletonWithRouterProps {
    components: PluginClassSet;
    config: EditorConfig;
    utils: Utils;
}
declare const SkeletonWithRouter: React.FC<SkeletonWithRouterProps>;
export default SkeletonWithRouter;
