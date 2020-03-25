import React, { PureComponent } from 'react';
import './index.scss';
import { PluginProps } from '@ali/lowcode-editor-framework/lib/definitions';
export interface IProps {
    editor: any;
    logo?: string;
}
export interface IState {
    undoEnable: boolean;
    redoEnable: boolean;
}
export default class UndoRedo extends PureComponent<IProps & PluginProps, IState> {
    static display: string;
    private history;
    constructor(props: any);
    init: () => void;
    updateState: (state: number) => void;
    handleUndoClick: () => void;
    handleRedoClick: () => void;
    render(): React.ReactNode;
}
