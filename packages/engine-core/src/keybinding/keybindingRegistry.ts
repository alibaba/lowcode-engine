export interface IKeybindingItem {
  keybinding: Keybinding | null;
  command: string | null;
  commandArgs?: any;
  weight1: number;
  weight2: number;
  extensionId: string | null;
  isBuiltinExtension: boolean;
}

export interface IKeybindings {
  primary?: number;
  secondary?: number[];
  win?: {
    primary: number;
    secondary?: number[];
  };
  linux?: {
    primary: number;
    secondary?: number[];
  };
  mac?: {
    primary: number;
    secondary?: number[];
  };
}
