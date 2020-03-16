import { EventEmitter } from 'events';
import { uniqueId } from '../../utils/unique-id';
import { ComponentMeta } from '../../designer/src/designer/component-meta';
import Node from '../../designer/src/designer/document/node/node';
import { TitleContent } from './title';
import { ReactElement, ComponentType as ReactComponentType, isValidElement } from 'react';
import { isReactComponent } from '../../utils/is-react';
import Designer from '../../designer/src/designer/designer';
import { Selection } from '../../designer/src/designer/document/selection';

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

  /*
  // 所有属性值数据
  readonly props: object;
  // 设置多个属性值，替换原有值
  setProps(data: object): void;
  // 设置多个属性值，和原有值合并
  mergeProps(data: object): void;
  // 绑定属性值发生变化时
  onPropsChange(fn: () => void): () => void;
  */
}

export type CustomView = ReactElement | ReactComponentType<any>;

export function isCustomView(obj: any): obj is CustomView {
  return obj && (isValidElement(obj) || isReactComponent(obj));
}

export type DynamicProps = (field: SettingField) => object;

export interface SetterConfig {
  /**
   * if *string* passed must be a registered Setter Name
   */
  componentName: string | CustomView;
  /**
   * the props pass to Setter Component
   */
  props?: object | DynamicProps;
  children?: any;
  isRequired?: boolean;
  initialValue?: any | ((field: SettingField) => any);
}

/**
 * if *string* passed must be a registered Setter Name, future support blockSchema
 */
export type SetterType = SetterConfig | string | CustomView;

export interface FieldExtraProps {
  /**
   * 是否必填参数
   */
  isRequired?: boolean;
  /**
   * default value of target prop for setter use
   */
  defaultValue?: any;
  getValue?: (field: SettingField, fieldValue: any) => any;
  setValue?: (field: SettingField, value: any) => void;
  /**
   * the field conditional show, is not set always true
   * @default undefined
   */
  condition?: (field: SettingField) => boolean;
  /**
   * default collapsed when display accordion
   */
  defaultCollapsed?: boolean;
  /**
   * important field
   */
  important?: boolean;
  /**
   * internal use
   */
  forceInline?: number;
}

export interface FieldConfig extends FieldExtraProps {
  type?: 'field' | 'group';
  /**
   * the name of this setting field, which used in quickEditor
   */
  name: string | number;
  /**
   * the field title
   * @default sameas .name
   */
  title?: TitleContent;
  /**
   * the field body contains when .type = 'field'
   */
  setter?: SetterType;
  /**
   * the setting items which group body contains when .type = 'group'
   */
  items?: FieldConfig[];
  /**
   * extra props for field
   */
  extraProps?: FieldExtraProps;
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
  readonly setter?: SetterType;
  readonly isSame: boolean;
  readonly isMulti: boolean;
  readonly isOne: boolean;
  readonly isNone: boolean;
  readonly nodes: Node[];
  readonly componentMeta: ComponentMeta | null;
  readonly designer: Designer;
  readonly top: SettingTarget;
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
    this.setter = setter;
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
    return this._designer || this.editor.designer;
  }

  constructor(readonly editor: any) {
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
    editor.on('designer.selection-change', setupSelection);
    if (editor.designer) {
      setupSelection(editor.designer.currentSelection);
    }
    this.disposeListener = () => {
      editor.removeListener('designer.selection-change', setupSelection);
    };
  }

  onEffect(action: () => void): () => void {
    action();
    return this.onNodesChange(action);
  }

  /**
   * 获取属性值
   */
  getPropValue(propName: string): any {
    if (this.nodes.length < 1) {
      return null;
    }
    return this.nodes[0].getProp(propName, false)?.value;
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
    return this.nodes[0].getExtraProp(propName, false)?.value;
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
      if ((other as any).componentType !== meta) {
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
