import React from 'react';
import './index.scss';
import { PluginProps } from '@ali/lowcode-types';

export interface IProps {
  logo?: string;
  href?: string;
}

const Logo: React.FC<IProps & PluginProps> = (props): React.ReactElement => {
  return (
    <div className="lowcode-plugin-logo">
      <a className="logo" target="blank" href={props.href || '/'} style={{ backgroundImage: `url(${props.logo})` }} />
    </div>
  );
};

export default Logo;
