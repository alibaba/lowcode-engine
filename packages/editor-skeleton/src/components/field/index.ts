import { ReactNode, createElement } from 'react';
import { IPublicTypeTitleContent } from '@alilc/lowcode-types';
import { Field, PopupField, EntryField, PlainField } from './fields';

import './index.less';

export interface FieldProps {
  className?: string;
  title?: IPublicTypeTitleContent | null;
  display?: 'accordion' | 'inline' | 'block' | 'plain' | 'popup' | 'entry';
  collapsed?: boolean;
  valueState?: number;
  onExpandChange?: (collapsed: boolean) => void;
  onClear?: () => void;
  [extra: string]: any;
}

export function createField(
  props: FieldProps,
  children:ReactNode,
  type?: 'accordion' | 'inline' | 'block' | 'plain' | 'popup' | 'entry'
): ReactNode {
  if (type === 'popup') {
    return createElement(PopupField, props, children);
  }
  if (type === 'entry') {
    return createElement(EntryField, props, children);
  }
  if (type === 'plain' || !props.title) {
    return createElement(PlainField, props, children);
  }
  return createElement(Field, { ...props, defaultDisplay: type }, children);
}

export { Field, PopupField, EntryField, PlainField };
