import { computed, obx } from '../../globals';
import Designer from '../../designer/src/designer/designer';
import { ISensor, LocateEvent } from '../../designer/src/designer/helper/dragon';
import { Tree } from './tree';
import Location from '../../designer/src/designer/helper/location';

class TreeMaster {
  constructor(readonly designer: Designer) {}

  private treeMap = new Map<string, Tree>();
  @computed get currentTree(): Tree | null {
    const doc = this.designer?.currentDocument;
    if (doc) {
      const id = doc.id;
      if (this.treeMap.has(id)) {
        return this.treeMap.get(id)!;
      }
      const tree = new Tree(doc);
      // TODO: listen purge event to remove
      this.treeMap.set(id, tree);
      return tree;
    }
    return null;
  }
}

const mastersMap = new Map<Designer, TreeMaster>();
function getTreeMaster(designer: Designer): TreeMaster {
  let master = mastersMap.get(designer);
  if (!master) {
    master = new TreeMaster(designer);
    mastersMap.set(designer, master);
  }
  return master;
}

export class OutlineMain implements ISensor {
  private _designer?: Designer;
  @obx.ref private _master?: TreeMaster;
  get master() {
    return this._master;
  }

  constructor(readonly editor: any) {
    if (editor.designer) {
      this.setupDesigner(editor.designer);
    } else {
      editor.once('designer.ready', (designer: Designer) => {
        this.setupDesigner(designer);
      });
    }
  }

  fixEvent(e: LocateEvent): LocateEvent {
    throw new Error("Method not implemented.");
  }

  locate(e: LocateEvent): Location | undefined {
    throw new Error("Method not implemented.");
  }

  isEnter(e: LocateEvent): boolean {
    throw new Error("Method not implemented.");
  }

  deactiveSensor(): void {
    throw new Error("Method not implemented.");
  }

  private setupDesigner(designer: Designer) {
    this._designer = designer;
    this._master = getTreeMaster(designer);
    designer.dragon.addSensor(this);
  }

  purge() {
    this._designer?.dragon.removeSensor(this);
    // todo purge treeMaster if needed
  }

  private _sensorAvailable: boolean = false;
  /**
   * @see ISensor
   */
  get sensorAvailable() {
    return this._sensorAvailable;
  }

  private _shell: HTMLDivElement | null = null;
  mount(shell: HTMLDivElement | null) {
    if (this._shell === shell) {
      return;
    }
    this._shell = shell;
    if (shell) {
      this._sensorAvailable = true;
    }
  }
}


