import { IPublicTypeComponentAction, IPublicTypeMetadataTransducer } from '@alilc/lowcode-types';
import { engineConfig } from '@alilc/lowcode-editor-core';
import { intlNode } from './locale';
import {
  IconLock,
  IconUnlock,
  IconRemove,
  IconClone,
  IconHidden,
} from './icons';
import { Node } from './document';
import { componentDefaults, legacyIssues } from './transducers';

export class ComponentActions {
  actions: IPublicTypeComponentAction[] = [
    {
      name: 'remove',
      content: {
        icon: IconRemove,
        title: intlNode('remove'),
        /* istanbul ignore next */
        action(node: Node) {
          node.remove();
        },
      },
      important: true,
    },
    {
      name: 'hide',
      content: {
        icon: IconHidden,
        title: intlNode('hide'),
        /* istanbul ignore next */
        action(node: Node) {
          node.setVisible(false);
        },
      },
      /* istanbul ignore next */
      condition: (node: Node) => {
        return node.componentMeta.isModal;
      },
      important: true,
    },
    {
      name: 'copy',
      content: {
        icon: IconClone,
        title: intlNode('copy'),
        /* istanbul ignore next */
        action(node: Node) {
          // node.remove();
          const { document: doc, parent, index } = node;
          if (parent) {
            const newNode = doc.insertNode(parent, node, index + 1, true);
            newNode.select();
            const { isRGL, rglNode } = node.getRGL();
            if (isRGL) {
              // 复制 layout 信息
              const layout = rglNode.getPropValue('layout') || [];
              const curLayout = layout.filter((item) => item.i === node.getPropValue('fieldId'));
              if (curLayout && curLayout[0]) {
                layout.push({
                  ...curLayout[0],
                  i: newNode.getPropValue('fieldId'),
                });
                rglNode.setPropValue('layout', layout);
                // 如果是磁贴块复制，则需要滚动到影响位置
                setTimeout(() => newNode.document.simulator?.scrollToNode(newNode), 10);
              }
            }
          }
        },
      },
      important: true,
    },
    {
      name: 'lock',
      content: {
        icon: IconLock, // 锁定 icon
        title: intlNode('lock'),
        /* istanbul ignore next */
        action(node: Node) {
          node.lock();
        },
      },
      /* istanbul ignore next */
      condition: (node: Node) => {
        return engineConfig.get('enableCanvasLock', false) && node.isContainer() && !node.isLocked;
      },
      important: true,
    },
    {
      name: 'unlock',
      content: {
        icon: IconUnlock, // 解锁 icon
        title: intlNode('unlock'),
        /* istanbul ignore next */
        action(node: Node) {
          node.lock(false);
        },
      },
      /* istanbul ignore next */
      condition: (node: Node) => {
        return engineConfig.get('enableCanvasLock', false) && node.isContainer() && node.isLocked;
      },
      important: true,
    },
  ];

  constructor() {
    this.registerMetadataTransducer(legacyIssues, 2, 'legacy-issues'); // should use a high level priority, eg: 2
    this.registerMetadataTransducer(componentDefaults, 100, 'component-defaults');
  }

  removeBuiltinComponentAction(name: string) {
    const i = this.actions.findIndex((action) => action.name === name);
    if (i > -1) {
      this.actions.splice(i, 1);
    }
  }
  addBuiltinComponentAction(action: IPublicTypeComponentAction) {
    this.actions.push(action);
  }

  modifyBuiltinComponentAction(
    actionName: string,
    handle: (action: IPublicTypeComponentAction) => void,
  ) {
    const builtinAction = this.actions.find((action) => action.name === actionName);
    if (builtinAction) {
      handle(builtinAction);
    }
  }

  private metadataTransducers: IPublicTypeMetadataTransducer[] = [];

  registerMetadataTransducer(
    transducer: IPublicTypeMetadataTransducer,
    level = 100,
    id?: string,
  ) {
    transducer.level = level;
    transducer.id = id;
    const i = this.metadataTransducers.findIndex((item) => item.level != null && item.level > level);
    if (i < 0) {
      this.metadataTransducers.push(transducer);
    } else {
      this.metadataTransducers.splice(i, 0, transducer);
    }
  }

  getRegisteredMetadataTransducers(): IPublicTypeMetadataTransducer[] {
    return this.metadataTransducers;
  }
}