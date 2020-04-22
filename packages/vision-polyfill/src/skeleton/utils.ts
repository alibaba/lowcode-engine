import { IconType, TitleContent, isI18nData, TipContent } from '@ali/lowcode-globals';
import { isValidElement } from 'react';

export function composeTitle(title?: TitleContent, icon?: IconType, tip?: TipContent, tipAsTitle?: boolean) {
  if (!title) {
    title = {};
    if (!icon || tipAsTitle) {
      title.label = tip;
      tip = undefined;
    }
  }
  if (icon || tip) {
    if (typeof title !== 'object' || isValidElement(title) || isI18nData(title)) {
      title = {
        label: title,
        icon,
        tip,
      };
    } else {
      title = {
        ...title,
        icon,
        tip
      };
    }
  }
  return title;
}
