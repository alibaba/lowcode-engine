import { Pane } from './views/pane';
import { IconOutline } from './icons/outline';
import { IPublicModelPluginContext, IPublicModelDocumentModel } from '@alilc/lowcode-types';
import { MasterPaneName, BackupPaneName } from './helper/consts';
import { TreeMaster } from './controllers/tree-master';
import { PaneController } from './controllers/pane-controller';
import { useState } from 'react';

export const OutlinePlugin = (ctx: IPublicModelPluginContext, options: any) => {
  const { skeleton, config, canvas, project } = ctx;

  let isInFloatArea = true;
  const hasPreferenceForOutline = config.getPreference().contains('outline-pane-pinned-status-isFloat', 'skeleton');
  if (hasPreferenceForOutline) {
    isInFloatArea = config.getPreference().get('outline-pane-pinned-status-isFloat', 'skeleton');
  }
  const showingPanes = {
    masterPane: false,
    backupPane: false,
  };
  const treeMaster = new TreeMaster(ctx, options);
  let backupPaneController: PaneController | null = null;
  return {
    async init() {
      skeleton.add({
        area: 'leftArea',
        name: 'outlinePane',
        type: 'PanelDock',
        index: -1,
        content: {
          name: MasterPaneName,
          props: {
            icon: IconOutline,
            description: treeMaster.pluginContext.intlNode('Outline Tree'),
          },
          content: function Context(props: any) {
            const [masterPaneController, setMasterPaneController] = useState(new PaneController(MasterPaneName, treeMaster));
            treeMaster.onPluginContextChange(() => {
              setMasterPaneController(new PaneController(MasterPaneName, treeMaster));
            });

            return (
              <Pane
                config={config}
                treeMaster={treeMaster}
                controller={masterPaneController}
                key={masterPaneController.id}
                {...props}
              />
            );
          },
        },
        panelProps: {
          area: isInFloatArea ? 'leftFloatArea' : 'leftFixedArea',
          keepVisibleWhileDragging: true,
          ...config.get('defaultOutlinePaneProps'),
        },
        contentProps: {
          treeTitleExtra: config.get('treeTitleExtra'),
        },
      });

      skeleton.add({
        area: 'rightArea',
        name: BackupPaneName,
        type: 'Panel',
        props: {
          hiddenWhenInit: true,
        },
        content: (props: any) => {
          backupPaneController = new PaneController(BackupPaneName, treeMaster);
          return (
            <Pane
              treeMaster={treeMaster}
              controller={backupPaneController}
              {...props}
            />
          );
        },
      });

      // 处理 master pane 和 backup pane 切换
      const switchPanes = () => {
        const isDragging = canvas.dragon?.dragging;
        const hasVisibleTreeBoard = showingPanes.backupPane || showingPanes.masterPane;
        const shouldShowBackupPane = isDragging && !hasVisibleTreeBoard;

        if (shouldShowBackupPane) {
          skeleton.showPanel(BackupPaneName);
        } else {
          skeleton.hidePanel(BackupPaneName);
        }
      };
      canvas.dragon?.onDragstart(() => {
        switchPanes();
      });
      canvas.dragon?.onDragend(() => {
        switchPanes();
      });
      skeleton.onShowPanel((key: string) => {
        if (key === MasterPaneName) {
          showingPanes.masterPane = true;
        }
        if (key === BackupPaneName) {
          showingPanes.backupPane = true;
        }
      });
      skeleton.onHidePanel((key: string) => {
        if (key === MasterPaneName) {
          showingPanes.masterPane = false;
          switchPanes();
        }
        if (key === BackupPaneName) {
          showingPanes.backupPane = false;
        }
      });
      project.onChangeDocument((document: IPublicModelDocumentModel) => {
        if (!document) {
          return;
        }

        const { selection } = document;

        selection?.onSelectionChange(() => {
          const selectedNodes = selection?.getNodes();
          if (!selectedNodes || selectedNodes.length === 0) {
            return;
          }
          const tree = treeMaster.currentTree;
          selectedNodes.forEach((node) => {
            const treeNode = tree?.getTreeNodeById(node.id);
            tree?.expandAllAncestors(treeNode);
          });
        });
      });
    },
  };
};
OutlinePlugin.meta = {
  eventPrefix: 'OutlinePlugin',
  preferenceDeclaration: {
    title: '大纲树插件配置',
    properties: [
      {
        key: 'extraTitle',
        type: 'object',
        description: '副标题',
      },
    ],
  },
};
OutlinePlugin.pluginName = 'OutlinePlugin';