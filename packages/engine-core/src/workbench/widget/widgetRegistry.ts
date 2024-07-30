import { type Event, type EventListener, Emitter } from '@alilc/lowcode-shared';
import { IWidget } from './widget';
import { Extensions, Registry } from '../../extension/registry';

export interface IWidgetRegistry<View> {
  onDidRegister: Event<IWidget<View>[]>;

  registerWidget(widget: IWidget<View>): string;

  registerWidgets(widgets: IWidget<View>[]): string[];

  getWidgets(): IWidget<View>[];
}

export class WidgetRegistryImpl<View> implements IWidgetRegistry<View> {
  private _widgets: Map<string, IWidget<View>> = new Map();

  private emitter = new Emitter<IWidget<View>[]>();

  onDidRegister(fn: EventListener<IWidget<View>[]>) {
    return this.emitter.on(fn);
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
