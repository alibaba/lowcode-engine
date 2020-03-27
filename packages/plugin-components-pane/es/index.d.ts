import React, { PureComponent } from 'react';
import { PluginProps } from '@ali/lowcode-editor-core/lib/definitions';
import './index.scss';
export interface LibrayInfo {
    label: string;
    value: string;
}
export interface IState {
    loading: boolean;
    libs: LibrayInfo[];
    searchKey: string;
    currentLib: string;
    componentList: object[];
}
export default class ComponentListPlugin extends PureComponent<PluginProps, IState> {
    static displayName: string;
    constructor(props: any);
    componentDidMount(): void;
    transformMaterial: (componentList: any) => any;
    initComponentList: () => void;
    searchAction: (value: string) => void;
    filterMaterial: () => any;
    render(): React.ReactNode;
}
