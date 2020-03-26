import React from 'react';
import { PluginProps, PluginClass } from './definitions';
export default function pluginFactory(Comp: PluginClass): React.ComponentType<PluginProps>;
