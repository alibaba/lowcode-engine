import { isLocationChildrenDetail } from '@alilc/lowcode-utils';
import { IPublicModelPluginContext, IPublicTypeActiveTarget, IPublicModelNode, IPublicTypeDisposable, IPublicEnumPluginRegisterLevel } from '@alilc/lowcode-types';
import TreeNode from './tree-node';
import { Tree } from './tree';
import EventEmitter from 'events';
import { enUS, zhCN } from '../locale';
import { ReactNode } from 'react';

export interface ITreeBoard {
  readonly at: string | symbol;
  scrollToNode(treeNode: TreeNode, detail?: any): void;
}

enum EVENT_NAMES {
  pluginContextChanged = 'pluginContextChanged',
}

export interface IOutlinePanelPluginContext extends IPublicModelPluginContext {
  extraTitle?: string;
  intlNode(id: string, params?: object): ReactNode;
  intl(id: string, params?: object): string;
  getLocale(): string;
}

export class TreeMaster {
  pluginContext: IOutlinePanelPluginContext;

  private boards = new Set<ITreeBoard>();

  private treeMap = new Map<string, Tree>();

  private disposeEvents: (IPublicTypeDisposable | undefined)[] = [];

  event = new EventEmitter();

  constructor(pluginContext: IPublicModelPluginContext, readonly options: {
    extraTitle?: string;
  }) {
    this.setPluginContext(pluginContext);
    const { workspace } = this.pluginContext;
    this.initEvent();
    if (pluginContext.registerLevel === IPublicEnumPluginRegisterLevel.Workspace) {
      this.setPluginContext(workspace.window?.currentEditorView);
      workspace.onWindowRendererReady(() => {
        this.setPluginContext(workspace.window?.currentEditorView);
        let dispose: IPublicTypeDisposable | undefined;
        const windowViewTypeChangeEvent = () => {
          dispose = workspace.window?.onChangeViewType(() => {
            this.setPluginContext(workspace.window?.currentEditorView);
          });
        };

        windowViewTypeChangeEvent();

        workspace.onChangeActiveWindow(() => {
          windowViewTypeChangeEvent();
          this.setPluginContext(workspace.window?.currentEditorView);
          dispose && dispose();
        });
      });
    }
  }

  private setPluginContext(pluginContext: IPublicModelPluginContext | undefined | null) {
    if (!pluginContext) {
      return;
    }
    const { intl, intlNode, getLocale } = pluginContext.common.utils.createIntl({
      'en-US': enUS,
      'zh-CN': zhCN,
    });
    let _pluginContext: IOutlinePanelPluginContext = Object.assign(pluginContext, {
      intl,
      intlNode,
      getLocale,
    });
    _pluginContext.extraTitle = this.options && this.options['extraTitle'];
    this.pluginContext = _pluginContext;
    this.disposeEvent();
    this.initEvent();
    this.emitPluginContextChange();
  }

  private disposeEvent() {
    this.disposeEvents.forEach(d => {
      d && d();
    });
  }

  private initEvent() {
    let startTime: any;
    const { event, project, canvas } = this.pluginContext;
    const setExpandByActiveTracker = (target: IPublicTypeActiveTarget) => {
      const { node, detail } = target;
      const tree = this.currentTree;
      if (!tree/* || node.document !== tree.document */) {
        return;
      }
      const treeNode = tree.getTreeNode(node);
      if (detail && isLocationChildrenDetail(detail)) {
        treeNode.expand(true);
      } else {
        treeNode.expandParents();
      }
      this.boards.forEach((board) => {
        board.scrollToNode(treeNode, detail);
      });
    };
    this.disposeEvents = [
      canvas.dragon?.onDragstart(() => {
        startTime = Date.now() / 1000;
        // needs?
        this.toVision();
      }),
      canvas.activeTracker?.onChange(setExpandByActiveTracker),
      canvas.dragon?.onDragend(() => {
        const endTime: any = Date.now() / 1000;
        const nodes = project.currentDocument?.selection?.getNodes();
        event.emit('outlinePane.dragend', {
          selected: nodes
            ?.map((n) => {
              if (!n) {
                return;
              }
              const npm = n?.componentMeta?.npm;
              return (
                [npm?.package, npm?.componentName].filter((item) => !!item).join('-') || n?.componentMeta?.componentName
              );
            })
            .join('&'),
          time: (endTime - startTime).toFixed(2),
        });
      }),
      project.onRemoveDocument((data: {id: string}) => {
        const { id } = data;
        this.treeMap.delete(id);
      }),
    ];
    if (canvas.activeTracker?.target) {
      setExpandByActiveTracker(canvas.activeTracker?.target);
    }
  }

  private toVision() {
    const tree = this.currentTree;
    if (tree) {
      const selection = this.pluginContext.project.getCurrentDocument()?.selection;
      selection?.getTopNodes().forEach((node: IPublicModelNode) => {
        tree.getTreeNode(node).setExpanded(false);
      });
    }
  }

  addBoard(board: ITreeBoard) {
    this.boards.add(board);
  }

  removeBoard(board: ITreeBoard) {
    this.boards.delete(board);
  }

  purge() {
    // todo others purge
  }

  onPluginContextChange(fn: () => void) {
    this.event.on(EVENT_NAMES.pluginContextChanged, fn);
  }

  emitPluginContextChange() {
    this.event.emit(EVENT_NAMES.pluginContextChanged);
  }

  get currentTree(): Tree | null {
    const doc = this.pluginContext.project.getCurrentDocument();
    if (doc) {
      const { id } = doc;
      if (this.treeMap.has(id)) {
        return this.treeMap.get(id)!;
      }
      const tree = new Tree(this);
      this.treeMap.set(id, tree);
      return tree;
    }
    return null;
  }
}
