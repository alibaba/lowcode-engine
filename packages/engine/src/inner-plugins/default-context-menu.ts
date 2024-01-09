import {
  IPublicEnumContextMenuType,
  IPublicEnumTransformStage,
  IPublicModelNode,
  IPublicModelPluginContext,
  IPublicTypeNodeSchema,
} from '@alilc/lowcode-types';
import { isProjectSchema } from '@alilc/lowcode-utils';
import { Notification } from '@alifd/next';
import { intl } from '../locale';

function getNodesSchema(nodes: IPublicModelNode[]) {
  const componentsTree = nodes.map((node) => node?.exportSchema(IPublicEnumTransformStage.Clone));
  const data = { type: 'nodeSchema', componentsMap: {}, componentsTree };
  return data;
}

async function getClipboardText(): Promise<IPublicTypeNodeSchema[]> {
  return new Promise((resolve, reject) => {
    // 使用 Clipboard API 读取剪贴板内容
    navigator.clipboard.readText().then(
      (text) => {
        try {
          const data = JSON.parse(text);
          if (isProjectSchema(data)) {
            resolve(data.componentsTree);
          } else {
            Notification.open({
              content: intl('NotValidNodeData'),
              type: 'error',
            });
            reject(
              new Error(intl('NotValidNodeData')),
            );
          }
        } catch (error) {
          Notification.open({
            content: intl('NotValidNodeData'),
            type: 'error',
          });
          reject(error);
        }
      },
      (err) => {
        reject(err);
      },
    );
  });
}

export const defaultContextMenu = (ctx: IPublicModelPluginContext) => {
  const { material, canvas } = ctx;
  const { clipboard } = canvas;

  return {
    init() {
      material.addContextMenuOption({
        name: 'selectComponent',
        title: intl('SelectComponents'),
        condition: (nodes) => {
          return nodes.length === 1;
        },
        items: [
          {
            name: 'nodeTree',
            type: IPublicEnumContextMenuType.NODE_TREE,
          },
        ],
      });

      material.addContextMenuOption({
        name: 'copyAndPaste',
        title: intl('CopyAndPaste'),
        condition: (nodes) => {
          return nodes.length === 1;
        },
        action(nodes) {
          const node = nodes[0];
          const { document: doc, parent, index } = node;
          if (parent) {
            const newNode = doc?.insertNode(parent, node, (index ?? 0) + 1, true);
            newNode?.select();
          }
        },
      });

      material.addContextMenuOption({
        name: 'copy',
        title: intl('Copy'),
        condition(nodes) {
          return nodes.length > 0;
        },
        action(nodes) {
          if (!nodes || nodes.length < 1) {
            return;
          }

          const data = getNodesSchema(nodes);
          clipboard.setData(data);
        },
      });

      material.addContextMenuOption({
        name: 'zhantieToBottom',
        title: intl('PasteToTheBottom'),
        condition: (nodes) => {
          return nodes.length === 1;
        },
        async action(nodes) {
          if (!nodes || nodes.length < 1) {
            return;
          }

          const node = nodes[0];
          const { document: doc, parent, index } = node;

          try {
            const nodeSchema = await getClipboardText();
            if (parent) {
              nodeSchema.forEach((schema, schemaIndex) => {
                doc?.insertNode(parent, schema, (index ?? 0) + 1 + schemaIndex, true);
              });
            }
          } catch (error) {
            console.error(error);
          }
        },
      });

      material.addContextMenuOption({
        name: 'zhantieToInner',
        title: intl('PasteToTheInside'),
        condition: (nodes) => {
          return nodes.length === 1;
        },
        disabled: (nodes) => {
          // 获取粘贴数据
          const node = nodes[0];
          return !node.isContainerNode;
        },
        async action(nodes) {
          const node = nodes[0];
          const { document: doc, parent } = node;

          try {
            const nodeSchema = await getClipboardText();
            if (parent) {
              const index = node.children?.size || 0;

              if (parent) {
                nodeSchema.forEach((schema, schemaIndex) => {
                  doc?.insertNode(node, schema, (index ?? 0) + 1 + schemaIndex, true);
                });
              }
            }
          } catch (error) {
            console.error(error);
          }
        },
      });

      material.addContextMenuOption({
        name: 'delete',
        title: intl('Delete'),
        condition(nodes) {
          return nodes.length > 0;
        },
        action(nodes) {
          nodes.forEach((node) => {
            node.remove();
          });
        },
      });
    },
  };
};

defaultContextMenu.pluginName = '___default_context_menu___';
