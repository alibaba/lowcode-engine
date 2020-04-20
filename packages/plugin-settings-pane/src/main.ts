import { EventEmitter } from 'events';
import { uniqueId, DynamicSetter, isDynamicSetter } from '@ali/lowcode-globals';
import { ComponentMeta, Node, Designer, Selection } from '@ali/lowcode-designer';
import { TitleContent, FieldExtraProps, SetterType, CustomView, FieldConfig, isCustomView } from '@ali/lowcode-globals';
import { getTreeMaster } from '@ali/lowcode-plugin-outline-pane';
import Editor from '@ali/lowcode-editor-core';
import { Transducer } from './utils';

export interface SettingTarget {
  // 所设置的节点集，至少一个
  readonly nodes: Node[];

  readonly componentMeta: ComponentMeta | null;

  readonly items: Array<SettingField | CustomView>;

  /**
   * 同样的
   */
  readonly isSame: boolean;

  /**
   * 一个
   */
  readonly isOne: boolean;

  /**
   * 多个
   */
  readonly isMulti: boolean;

  /**
   * 无
   */
  readonly isNone: boolean;

  /**
   * 编辑器引用
   */
  readonly editor: object;

  readonly designer?: Designer;

  readonly path: string[];

  readonly top: SettingTarget;

  // 响应式自动运行
  onEffect(action: () => void): () => void;

  // 获取属性值
  getPropValue(propName: string | number): any;

  // 设置属性值
  setPropValue(propName: string | number, value: any): void;

  // 获取附属属性值
  getExtraPropValue(propName: string): any;

  // 设置附属属性值
  setExtraPropValue(propName: string, value: any): void;
}

export class SettingField implements SettingTarget {
  readonly isSettingField = true;
  readonly id = uniqueId('field');
  readonly type: 'field' | 'group';
  readonly isRequired: boolean = false;
  readonly isGroup: boolean;
  private _name: string | number;
  get name() {
    return this._name;
  }
  readonly title: TitleContent;
  readonly editor: any;
  readonly extraProps: FieldExtraProps;
  private _setter?: SetterType | DynamicSetter;
  get setter(): SetterType | null {
    if (!this._setter) {
      return null;
    }
    if (isDynamicSetter(this._setter)) {
      return this._setter(this);
    }
    return this._setter;
  }
  readonly isSame: boolean;
  readonly isMulti: boolean;
  readonly isOne: boolean;
  readonly isNone: boolean;
  readonly nodes: Node[];
  readonly componentMeta: ComponentMeta | null;
  readonly designer: Designer;
  readonly top: SettingTarget;
  readonly transducer: Transducer;
  get path() {
    const path = this.parent.path.slice();
    if (this.type === 'field') {
      path.push(String(this.name));
    }
    return path;
  }

  constructor(readonly parent: SettingTarget, config: FieldConfig) {
    const { type, title, name, items, setter, extraProps, ...rest } = config;

    if (type == null) {
      const c = typeof name === 'string' ? name.substr(0, 1) : '';
      if (c === '#') {
        this.type = 'group';
      } else {
        this.type = 'field';
      }
    } else {
      this.type = type;
    }
    // initial self properties
    this._name = name;
    // make this reactive
    this.title = title || (typeof name === 'number' ? `项目 ${name}` : name);
    this._setter = setter;
    this.extraProps = {
      ...rest,
      ...extraProps,
    };
    this.isRequired = config.isRequired || (setter as any)?.isRequired;
    this.isGroup = this.type === 'group';

    // copy parent properties
    this.editor = parent.editor;
    this.nodes = parent.nodes;
    this.componentMeta = parent.componentMeta;
    this.isSame = parent.isSame;
    this.isMulti = parent.isMulti;
    this.isOne = parent.isOne;
    this.isNone = parent.isNone;
    this.designer = parent.designer!;
    this.top = parent.top;

    // initial items
    if (this.type === 'group' && items) {
      this.initItems(items);
    }

    this.transducer = new Transducer(this, { setter });
  }

  onEffect(action: () => void): () => void {
    return this.designer.autorun(action, true);
  }

  private _items: Array<SettingField | CustomView> = [];
  private initItems(items: Array<FieldConfig | CustomView>) {
    this._items = items.map((item) => {
      if (isCustomView(item)) {
        return item;
      }
      return new SettingField(this, item);
    });
  }

  private disposeItems() {
    this._items.forEach(item => isSettingField(item) && item.purge());
    this._items = [];
  }

  createField(config: FieldConfig): SettingField {
    return new SettingField(this, config);
  }

  get items() {
    return this._items;
  }

  // ====== 当前属性读写 =====

  /**
   * 判断当前属性值是否一致
   * 0 无值/多种值
   * 1 类似值，比如数组长度一样
   * 2 单一植
   */
  get valueState(): number {
    if (this.type !== 'field') {
      return 0;
    }
    const propName = this.path.join('.');
    const first = this.nodes[0].getProp(propName)!;
    let l = this.nodes.length;
    let state = 2;
    while (l-- > 1) {
      const next = this.nodes[l].getProp(propName, false);
      const s = first.compare(next);
      if (s > 1) {
        return 0;
      }
      if (s === 1) {
        state = 1;
      }
    }
    return state;
  }

  /**
   * 获取当前属性值
   */
  getValue(): any {
    let val: any = null;
    if (this.type === 'field') {
      val = this.parent.getPropValue(this.name);
    }
    const { getValue } = this.extraProps;
    return getValue ? getValue(this, val) : val;
  }

  /**
   * 设置当前属性值
   */
  setValue(val: any) {
    if (this.type === 'field') {
      this.parent.setPropValue(this.name, val);
    }
    const { setValue } = this.extraProps;
    if (setValue) {
      setValue(this, val);
    }
  }

  setKey(key: string | number) {
    if (this.type !== 'field') {
      return;
    }
    const propName = this.path.join('.');
    let l = this.nodes.length;
    while (l-- > 1) {
      this.nodes[l].getProp(propName, true)!.key = key;
    }
    this._name = key;
  }

  remove() {
    if (this.type !== 'field') {
      return;
    }
    const propName = this.path.join('.');
    let l = this.nodes.length;
    while (l-- > 1) {
      this.nodes[l].getProp(propName)?.remove()
    }
  }

  /**
   * 设置子级属性值
   */
  setPropValue(propName: string | number, value: any) {
    const path = this.type === 'field' ? `${this.name}.${propName}` : propName;
    this.parent.setPropValue(path, value);
  }

  /**
   * 获取子级属性值
   */
  getPropValue(propName: string | number): any {
    const path = this.type === 'field' ? `${this.name}.${propName}` : propName;
    return this.parent.getPropValue(path);
  }

  getExtraPropValue(propName: string) {
    return this.top.getExtraPropValue(propName);
  }

  setExtraPropValue(propName: string, value: any) {
    this.top.setExtraPropValue(propName, value);
  }

  purge() {
    this.disposeItems();
  }

  // ======= compatibles ====
  getHotValue(): any {
    return this.transducer.toHot(this.getValue());
  }

  setHotValue(data: any) {
    this.setValue(this.transducer.toNative(data));
  }

  getNode() {
    return this.nodes[0];
  }

  getProps() {
    return this.parent;
  }

  onValueChange() {
    return () => {};
  }
}

export function isSettingField(obj: any): obj is SettingField {
  return obj && obj.isSettingField;
}

export class SettingsMain implements SettingTarget {
  private emitter = new EventEmitter();

  private _nodes: Node[] = [];
  private _items: Array<SettingField | CustomView> = [];
  private _sessionId = '';
  private _componentMeta: ComponentMeta | null = null;
  private _isSame: boolean = true;
  readonly path = [];
  readonly top: SettingTarget = this;

  get nodes(): Node[] {
    return this._nodes;
  }

  get componentMeta() {
    return this._componentMeta;
  }

  get items() {
    return this._items;
  }

  /**
   * 同样的
   */
  get isSame(): boolean {
    return this._isSame;
  }

  /**
   * 一个
   */
  get isOne(): boolean {
    return this.nodes.length === 1;
  }

  /**
   * 多个
   */
  get isMulti(): boolean {
    return this.nodes.length > 1;
  }

  /**
   * 无
   */
  get isNone() {
    return this.nodes.length < 1;
  }

  private disposeListener: () => void;

  private _designer?: Designer;
  get designer() {
    return this._designer || this.editor.get(Designer);
  }

  constructor(readonly editor: Editor) {
    const setupSelection = (selection?: Selection) => {
      if (selection) {
        if (!this._designer) {
          this._designer = selection.doc.designer;
        }
        this.setup(selection.getNodes());
      } else {
        this.setup([]);
      }
    };
    editor.on('designer.selection.change', setupSelection);
    this.disposeListener = () => {
      editor.removeListener('designer.selection.change', setupSelection);
    };
    (async () => {
      const designer = await editor.onceGot(Designer);
      getTreeMaster(designer).onceEnableBuiltin(() => {
        this.emitter.emit('outline-visible');
      });
      setupSelection(designer.currentSelection);
    })();
  }

  onEffect(action: () => void): () => void {
    action();
    return this.onNodesChange(action);
  }

  onceOutlineVisible(fn: () => void): () => void {
    this.emitter.on('outline-visible', fn);
    return () => {
      this.emitter.removeListener('outline-visible', fn);
    };
  }

  /**
   * 获取属性值
   */
  getPropValue(propName: string): any {
    if (this.nodes.length < 1) {
      return null;
    }
    return this.nodes[0].getProp(propName, true)?.getValue();
  }

  /**
   * 设置属性值
   */
  setPropValue(propName: string, value: any) {
    this.nodes.forEach(node => {
      node.setPropValue(propName, value);
    });
  }

  getExtraPropValue(propName: string) {
    if (this.nodes.length < 1) {
      return null;
    }
    return this.nodes[0].getExtraProp(propName, false)?.getValue();
  }

  setExtraPropValue(propName: string, value: any) {
    this.nodes.forEach(node => {
      node.getExtraProp(propName, true)?.setValue(value);
    });
  }

  // 设置多个属性值，替换原有值
  setProps(data: object) {
    this.nodes.forEach(node => {
      node.setProps(data as any);
    });
  }

  // 设置多个属性值，和原有值合并
  mergeProps(data: object) {
    this.nodes.forEach(node => {
      node.mergeProps(data as any);
    });
  }

  private setup(nodes: Node[]) {
    this._nodes = nodes;

    // check nodes change
    const sessionId = this.nodes
      .map(node => node.id)
      .sort()
      .join(',');
    if (sessionId === this._sessionId) {
      return;
    }
    this._sessionId = sessionId;

    // setups
    this.setupComponentMeta();

    // todo: enhance when componentType not changed do merge
    // clear fields
    this.setupItems();

    // emit change
    this.emitter.emit('nodeschange');
  }

  private disposeItems() {
    this._items.forEach(item => isSettingField(item) && item.purge());
    this._items = [];
  }

  private setupComponentMeta() {
    if (this.nodes.length < 1) {
      this._isSame = false;
      this._componentMeta = null;
      return;
    }
    const first = this.nodes[0];
    const meta = first.componentMeta;
    const l = this.nodes.length;
    let theSame = true;
    for (let i = 1; i < l; i++) {
      const other = this.nodes[i];
      if (other.componentMeta !== meta) {
        theSame = false;
        break;
      }
    }
    if (theSame) {
      this._isSame = true;
      this._componentMeta = meta;
    } else {
      this._isSame = false;
      this._componentMeta = null;
    }
  }

  private setupItems() {
    this.disposeItems();
    if (this.componentMeta) {
      this._items = this.componentMeta.configure.map(item => {
        if (isCustomView(item)) {
          return item;
        }
        return new SettingField(this, item as any);
      });
    }
  }

  onNodesChange(fn: () => void): () => void {
    this.emitter.on('nodeschange', fn);
    return () => {
      this.emitter.removeListener('nodeschange', fn);
    };
  }

  purge() {
    this.disposeListener();
    this.disposeItems();
    this.emitter.removeAllListeners();
  }
}
