import React, {PureComponent} from '../node_modules/_@types_react@16.9.25@@types/react';
import {
  Search,
  Select
} from '../node_modules/_@alifd_next@1.19.19@@alifd/next/types';
import './index.scss';
import ComponentList from '../node_modules/_@ali_iceluna-addon-component-list@1.0.12@@ali/iceluna-addon-component-list/lib';
import { PluginProps } from './node_modules/@ali/lowcode-editor-core/lib/definitions';

export default class ComponentListPlugin extends PureComponent<PluginProps> {
  static displayName = 'LowcodeComponentListPlugin';



  render(): React.ReactNode {
    return (
      <div className="lowcode-component-list">
        
      </div>
    )
  }


}
