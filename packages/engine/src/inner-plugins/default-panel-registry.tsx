import { ILowCodePluginContext } from '@alilc/lowcode-designer';
import { engineConfig } from '@alilc/lowcode-editor-core';
import { SettingsPrimaryPane } from '@alilc/lowcode-editor-skeleton';
import DesignerPlugin from '@alilc/lowcode-plugin-designer';
import Outline, { getTreeMaster, OutlineBackupPane } from '@alilc/lowcode-plugin-outline-pane';

// 注册默认的面板
export const defaultPanelRegistry = (editor: any, designer: any) => {
  const fun = (ctx: ILowCodePluginContext) => {
    return {
      init() {
        const { skeleton, config } = ctx;
        skeleton.add({
          area: 'mainArea',
          name: 'designer',
          type: 'Widget',
          content: <DesignerPlugin
            engineConfig={config}
            engineEditor={editor}
          />,
        });
        if (!config.get('disableDefaultSettingPanel')) {
          skeleton.add({
            area: 'rightArea',
            name: 'settingsPane',
            type: 'Panel',
            content: SettingsPrimaryPane,
            props: {
              ignoreRoot: true,
            },
          });
        }

        // by default in float area;
        let isInFloatArea = true;
        const hasPreferenceForOutline = editor
          ?.getPreference()
          ?.contains('outline-pane-pinned-status-isFloat', 'skeleton');
        if (hasPreferenceForOutline) {
          isInFloatArea = editor
            ?.getPreference()
            ?.get('outline-pane-pinned-status-isFloat', 'skeleton');
        }

        skeleton.add({
          area: 'leftArea',
          name: 'outlinePane',
          type: 'PanelDock',
          content: {
            ...Outline,
            content: (props: any) => {
              const Content = Outline.content;
              return (
                <Content
                  engineConfig={config}
                  engineEditor={editor}
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
            treeTitleExtra: engineConfig.get('treeTitleExtra'),
          },
        });
        skeleton.add({
          area: 'rightArea',
          name: 'backupOutline',
          type: 'Panel',
          props: {
            condition: () => {
              return designer.dragon.dragging && !getTreeMaster(designer).hasVisibleTreeBoard();
            },
          },
          content: () => (
            <OutlineBackupPane
              engineConfig={config}
              engineEditor={editor}
            />
          ),
        });
      },
    };
  };

  fun.pluginName = '___default_panel___';

  return fun;
};


export default defaultPanelRegistry;
