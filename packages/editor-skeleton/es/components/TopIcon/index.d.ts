import React, { PureComponent } from 'react';
import './index.scss';
export interface TopIconProps {
    active?: boolean;
    className?: string;
    disabled?: boolean;
    icon: string;
    id?: string;
    locked?: boolean;
    marked?: boolean;
    onClick?: () => void;
    style?: React.CSSProperties;
    title?: string;
}
export default class TopIcon extends PureComponent<TopIconProps> {
    static displayName: string;
    static defaultProps: {
        active: boolean;
        className: string;
        disabled: boolean;
        icon: string;
        id: string;
        locked: boolean;
        onClick: () => void;
        style: {};
        title: string;
    };
    render(): React.ReactNode;
}
