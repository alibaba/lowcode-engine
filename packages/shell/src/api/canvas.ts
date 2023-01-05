import {
  IPublicApiCanvas,
  IPublicModelDropLocation,
  IPublicModelScrollTarget,
  IPublicModelScrollable,
  IPublicModelScroller,
  IDesigner,
  IPublicTypeLocationData,
  IPublicModelEditor,
  IPublicModelDragon,
  IPublicModelActiveTracker,
} from '@alilc/lowcode-types';
import {
  ScrollTarget as InnerScrollTarget,
} from '@alilc/lowcode-designer';
import { editorSymbol, designerSymbol, nodeSymbol } from '../symbols';
import { Dragon } from '../model';
import { DropLocation } from '../model/drop-location';
import { ActiveTracker } from '../model/active-tracker';


export class Canvas implements IPublicApiCanvas {
  private readonly [editorSymbol]: IPublicModelEditor;

  private get [designerSymbol](): IDesigner {
    return this[editorSymbol].get('designer') as IDesigner;
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

  get dragon(): IPublicModelDragon | null {
    return Dragon.create(this[designerSymbol].dragon, this.workspaceMode);
  }

  get activeTracker(): IPublicModelActiveTracker | null {
    const activeTracker = new ActiveTracker(this[designerSymbol].activeTracker);
    return activeTracker;
  }

  /**
   * @deprecated
   */
  get dropLocation() {
    return DropLocation.create((this[designerSymbol] as any).dropLocation || null);
  }
}