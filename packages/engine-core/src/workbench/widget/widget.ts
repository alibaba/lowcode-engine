import { LayoutParts } from '../layout/layout';

export interface IWidget<View> {
  readonly id: string;
  content: View;
  action: any; // bind command action
  target: LayoutParts;
  metadata: IWidgetMetadata;
}

export interface IWidgetMetadata {
  title?: string;
  icon?: string;
  priority?: number;
}

export class Widget<View> implements IWidget<View> {
  constructor(
    public readonly id: string,
    public readonly target: LayoutParts,
    public readonly content: View,
    public readonly action: any,
    public readonly metadata: IWidgetMetadata = {},
  ) {}
}
