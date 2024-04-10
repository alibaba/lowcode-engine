import { IPublicTypeHotkeyCallback } from './';

export interface IPublicTypeHotkeyCallbackConfig {
  callback: IPublicTypeHotkeyCallback;
  modifiers: string[];
  action: string;
  seq?: string;
  level?: number;
  combo?: string;
}
