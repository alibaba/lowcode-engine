import ConfigProvider from '../config-provider';
import Overlay from './overlay';
import Gateway from './gateway';
import Position from './position';
import Popup from './popup';

Overlay.Gateway = Gateway;
Overlay.Position = Position;
Overlay.Popup = ConfigProvider.config(Popup, {
    exportNames: ['overlay']
});

export default ConfigProvider.config(Overlay, {
    exportNames: ['getContent', 'getContentNode']
});