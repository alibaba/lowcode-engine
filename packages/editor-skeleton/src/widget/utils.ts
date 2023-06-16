import { IPublicTypeIconType, IPublicTypeTitleContent, TipContent } from '@alilc/lowcode-types';
import { isI18nData, isTitleConfig } from '@alilc/lowcode-utils';
import { isValidElement } from 'react';

export function composeTitle(title?: IPublicTypeTitleContent, icon?: IPublicTypeIconType, tip?: TipContent, tipAsTitle?: boolean, noIcon?: boolean) {
  let _title: IPublicTypeTitleContent | undefined;
  if (!title) {
    _title = {};
    if (!icon || tipAsTitle) {
      _title = {
        label: tip,
      };
      tip = undefined;
    }
  } else {
    _title = title;
  }

  if (icon || tip) {
    if (typeof _title !== 'object' || isValidElement(_title) || isI18nData(_title)) {
      if (isValidElement(_title)) {
        if (_title.type === 'svg' || _title.type.getIcon) {
          if (!icon) {
            icon = _title;
          }
          if (tipAsTitle) {
            _title = tip;
            tip = null;
          } else {
            _title = undefined;
          }
        }
      }
      _title = {
        label: _title,
        icon,
        tip,
      };
    } else {
      _title = {
        ..._title,
        icon,
        tip,
      };
    }
  }
  if (isTitleConfig(_title) && noIcon) {
    if (!isValidElement(_title)) {
      _title.icon = undefined;
    }
  }
  return _title;
}
