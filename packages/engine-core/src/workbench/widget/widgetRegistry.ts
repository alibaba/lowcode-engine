import { Disposable, Events } from '@alilc/lowcode-shared';
import { IWidget } from './widget';
import { Extensions, Registry } from '../../extension/registry';

export interface IWidgetRegistry<View> {
  onDidRegister: Events.Event<IWidget<View>[]>;

  registerWidget(widget: IWidget<View>): string;

  registerWidgets(widgets: IWidget<View>[]): string[];

  getWidgets(): IWidget<View>[];
}

export class WidgetRegistryImpl<View> extends Disposable implements IWidgetRegistry<View> {
  private _widgets: Map<string, IWidget<View>> = new Map();

  private _onDidRegister = this._addDispose(new Events.Emitter<IWidget<View>[]>());

  onDidRegister = this._onDidRegister.event;

  constructor() {
    super();
  }

  getWidgets(): IWidget<View>[] {
    return Array.from(this._widgets.values());
  }

  registerWidget(widget: IWidget<View>): string {
    return widget.id;
  }

  registerWidgets(widgets: IWidget<View>[]): string[] {
    return widgets.map((widget) => this.registerWidget(widget));
  }
}

export const WidgetRegistry = new WidgetRegistryImpl<any>();

Registry.add(Extensions.Widget, WidgetRegistry);
