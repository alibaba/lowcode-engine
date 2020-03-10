import logo from '../plugins/logo';
import designer from '../plugins/designer';
import undoRedo from '../plugins/undoRedo';
import topBalloonIcon from '@ali/iceluna-addon-2';
import topDialogIcon from '@ali/iceluna-addon-2';
import leftPanelIcon from '@ali/iceluna-addon-2';
import leftPanelIcon2 from '@ali/iceluna-addon-2';
import leftBalloonIcon from '@ali/iceluna-addon-2';
import leftDialogIcon from '@ali/iceluna-addon-2';
import rightPanel1 from '@ali/iceluna-addon-2';
import rightPanel2 from '@ali/iceluna-addon-2';
import rightPanel3 from '@ali/iceluna-addon-2';
import rightPanel4 from '@ali/iceluna-addon-2';

import PluginFactory from '../framework/pluginFactory';

export default {
  logo: PluginFactory(logo),
  designer: PluginFactory(designer),
  undoRedo: PluginFactory(undoRedo),
  topBalloonIcon: PluginFactory(topBalloonIcon),
  topDialogIcon: PluginFactory(topDialogIcon),
  leftPanelIcon: PluginFactory(leftPanelIcon),
  leftPanelIcon2: PluginFactory(leftPanelIcon2),
  leftBalloonIcon: PluginFactory(leftBalloonIcon),
  leftDialogIcon: PluginFactory(leftDialogIcon),
  rightPanel1: PluginFactory(rightPanel1),
  rightPanel2: PluginFactory(rightPanel2),
  rightPanel3: PluginFactory(rightPanel3),
  rightPanel4: PluginFactory(rightPanel4)
};
