import { Pane } from './views/pane';
import { IconOutline } from './icons/outline';
import { IPublicModelPluginContext, IPublicEnumEventNames } from '@alilc/lowcode-types';
import { enUS, zhCN } from './locale';
import { MasterPaneName, BackupPaneName } from './helper/consts';

export const OutlinePlugin = (ctx: IPublicModelPluginContext, options: any) => {
  const { skeleton, config, common, event, canvas } = ctx;
  const { intl, intlNode, getLocale } = common.utils.createIntl({
    'en-US': enUS,
    'zh-CN': zhCN,
  });
  ctx.intl = intl;
  ctx.intlNode = intlNode;
  ctx.getLocale = getLocale;
  ctx.extraTitle = options && options['extraTitle'];

  let isInFloatArea = true;
  const hasPreferenceForOutline = config.getPreference().contains('outline-pane-pinned-status-isFloat', 'skeleton');
  if (hasPreferenceForOutline) {
    isInFloatArea = config.getPreference().get('outline-pane-pinned-status-isFloat', 'skeleton');
  }
  const showingPanes = {
    masterPane: false,
    backupPane: false,
  };

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
            description: intlNode('Outline Tree'),
          },
          content: (props: any) => {
            return (
              <Pane
                config={config}
                pluginContext={ctx}
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
        content: (props: any) => (
          <Pane
            pluginContext={ctx}
            {...props}
          />
        ),
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

      event.on(IPublicEnumEventNames.SKELETON_PANEL_SHOW, (key: string) => {
        if (key === MasterPaneName) {
          showingPanes.masterPane = true;
        }
        if (key === BackupPaneName) {
          showingPanes.backupPane = true;
        }
      });
      event.on(IPublicEnumEventNames.SKELETON_PANEL_HIDE, (key: string) => {
        if (key === MasterPaneName) {
          showingPanes.masterPane = false;
          switchPanes();
        }
        if (key === BackupPaneName) {
          showingPanes.backupPane = false;
        }
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