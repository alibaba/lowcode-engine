import topBalloonIcon from '@ali/iceluna-addon-2';
import topDialogIcon from '@ali/iceluna-addon-2';
import leftPanelIcon from '@ali/iceluna-addon-2';
import leftBalloonIcon from '@ali/iceluna-addon-2';
import leftDialogIcon from '@ali/iceluna-addon-2';
import rightPanel1 from '@ali/iceluna-addon-2';
import rightPanel2 from '@ali/iceluna-addon-2';
import rightPanel3 from '@ali/iceluna-addon-2';
import rightPanel4 from '@ali/iceluna-addon-2';

import PluginFactory from '../framework/plugin';

export default {
  topBalloonIcon: PluginFactory(topBalloonIcon),
  topDialogIcon: PluginFactory(topDialogIcon),
  leftPanelIcon: PluginFactory(leftPanelIcon),
  leftBalloonIcon: PluginFactory(leftBalloonIcon),
  leftDialogIcon: PluginFactory(leftDialogIcon),
  rightPanel1: PluginFactory(rightPanel1),
  rightPanel2: PluginFactory(rightPanel2),
  rightPanel3: PluginFactory(rightPanel3),
  rightPanel4: PluginFactory(rightPanel4)
};
