import React from 'react';
import './index.scss';
import { PluginProps } from '@ali/lowcode-editor-framework/lib/definitions';
export interface IProps {
    logo?: string;
    href?: string;
}
declare const Logo: React.FC<IProps & PluginProps>;
export default Logo;
