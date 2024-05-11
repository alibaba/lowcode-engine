import { type NpmInfo, type ComponentMetaData, signal, Signal } from '@alilc/lowcode-shared';
import type { ComponentConfigure } from './types';

export interface NormalizedComponentMetaData extends ComponentMetaData<ComponentConfigure> {
  configure: ComponentConfigure;
}

export interface ComponentMeta {
  /**
   * 组件名
   * component name
   */
  readonly componentName: string;
  /**
   * 标题
   * title for this component
   */
  readonly title: string;
  /**
   * 图标
   * icon config for this component
   */
  readonly icon: string | undefined;
  /**
   * 组件 npm 信息
   * npm informations
   */
  readonly npm: NpmInfo | undefined;

  /**
   * 是否是「容器型」组件
   * is container node or not
   */
  readonly isContainer: boolean;
  /**
   * 是否为「模态框」组件
   * check if this is a modal component or not.
   */
  readonly isModal: boolean;

  /**
   * 获取用于设置面板显示用的配置
   * get configs for Settings Panel
   */
  // readonly configure: IPublicTypeFieldConfig[];

  /**
   * 当前组件的可用 Action
   * available actions
   */
  // readonly availableActions: IPublicTypeComponentAction[];

  /**
   * 设置 npm 信息
   * set method for npm inforamtion
   * @param npm
   */
  setNpm(npm: NpmInfo): void;
  /**
   * 获取元数据
   * get component metadata
   */
  getMetadata(): Signal<NormalizedComponentMetaData>;
  /**
   * 设置组件元数据
   * @param metadata 组件元数据
   */
  setMetadata(metadata: ComponentMetaData): void;
  /**
   * 刷新元数据，会触发元数据的重新解析和刷新
   * refresh metadata
   */
  // refreshMetadata(): void;

  // /**
  //  * 检测当前对应节点是否可被放置在父节点中
  //  * check if the current node could be placed in parent node
  //  * @param my 当前节点
  //  * @param parent 父节点
  //  */
  // checkNestingUp(my: Node | IPublicTypeNodeData, parent: any): boolean;

  // /**
  //  * 检测目标节点是否可被放置在父节点中
  //  * check if the target node(s) could be placed in current node
  //  * @param my 当前节点
  //  * @param parent 父节点
  //  */
  // checkNestingDown(
  //   my: Node | IPublicTypeNodeData,
  //   target: IPublicTypeNodeSchema | Node | IPublicTypeNodeSchema[],
  // ): boolean;
}

/**
 * todo: resolve lowCode schema
 */
export function createComponentMeta(
  metaData: ComponentMetaData<ComponentConfigure>,
): ComponentMeta {
  const signal = signal<NormalizedComponentMetaData>(resolve(metaData));

  function resolve(metaData: ComponentMetaData<ComponentConfigure>): NormalizedComponentMetaData {
    const result: NormalizedComponentMetaData = {
      ...metaData,
      configure: metaData?.configure ?? {},
    };

    // const { component } = result.configure;
    // if (component) {
    // this._isContainer = !!component.isContainer;
    // this._isModal = !!component.isModal;
    //   if (component.nestingRule) {
    //     const { parentWhitelist, childWhitelist } = component.nestingRule;
    //     this.parentWhitelist = buildFilter(parentWhitelist);
    //     this.childWhitelist = buildFilter(childWhitelist);
    //   }
    // } else {
    //   this._isContainer = false;
    //   this._isModal = false;
    // }

    return result;
  }

  const meta: ComponentMeta = {
    get componentName() {
      return signal.value.componentName;
    },
    get title() {
      return signal.value.title;
    },
    get icon() {
      return signal.value.icon;
    },
    get npm() {
      return signal.value.npm;
    },

    get isContainer() {
      return signal.value.configure?.component?.isContainer;
    },
    get isModal() {
      return signal.value.configure?.component?.isModal;
    },

    getMetadata() {
      return signal;
    },
    setNpm(npm) {
      signal.value.npm = npm;
    },
    setMetadata(metadata) {
      signal.value = resolve(metadata);
    },
  };

  Object.defineProperty(meta, '__isComponentMeta__', {
    writable: false,
    enumerable: false,
    value: true,
  });

  return meta;
}

export function isComponentmeta(obj: unknown): obj is ComponentMeta {
  return (obj as any)?.__isComponentMeta__;
}
