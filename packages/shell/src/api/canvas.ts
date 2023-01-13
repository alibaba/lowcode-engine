import {
  IPublicApiCanvas,
  IPublicModelDropLocation,
  IPublicModelScrollTarget,
  IPublicModelScrollable,
  IPublicModelScroller,
  IPublicTypeLocationData,
  IPublicModelEditor,
  IPublicModelDragon,
  IPublicModelActiveTracker,
} from '@alilc/lowcode-types';
import {
  ScrollTarget as InnerScrollTarget,
  IDesigner,
} from '@alilc/lowcode-designer';
import { editorSymbol, designerSymbol, nodeSymbol } from '../symbols';
import {
  Dragon as ShellDragon,
  DropLocation as ShellDropLocation,
  ActiveTracker as ShellActiveTracker,
} from '../model';

export class Canvas implements IPublicApiCanvas {
  private readonly [editorSymbol]: IPublicModelEditor;

  private get [designerSymbol](): IDesigner {
    return this[editorSymbol].get('designer') as IDesigner;
  }

  get dragon(): IPublicModelDragon | null {
    return ShellDragon.create(this[designerSymbol].dragon, this.workspaceMode);
  }

  get activeTracker(): IPublicModelActiveTracker | null {
    const activeTracker = new ShellActiveTracker(this[designerSymbol].activeTracker);
    return activeTracker;
  }

  get isInLiveEditing(): boolean {
    return Boolean(this[editorSymbol].get('designer')?.project?.simulator?.liveEditing?.editing);
  }

  constructor(editor: IPublicModelEditor, readonly workspaceMode: boolean = false) {
    this[editorSymbol] = editor;
  }

  createScrollTarget(shell: HTMLDivElement): IPublicModelScrollTarget {
    return new InnerScrollTarget(shell);
  }

  createScroller(scrollable: IPublicModelScrollable): IPublicModelScroller {
    return this[designerSymbol].createScroller(scrollable);
  }

  /**
   * 创建插入位置，考虑放到 dragon 中
   */
  createLocation(locationData: IPublicTypeLocationData): IPublicModelDropLocation {
    return this[designerSymbol].createLocation({
      ...locationData,
      target: (locationData.target as any)[nodeSymbol],
    });
  }

  /**
   * @deprecated
   */
  get dropLocation() {
    return ShellDropLocation.create((this[designerSymbol] as any).dropLocation || null);
  }
}