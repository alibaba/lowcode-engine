import {
  IPublicModelPluginContext,
  IPublicTypeNodeSchema,
  IPublicTypePropType,
} from '@alilc/lowcode-types';
import { isNodeSchema } from '@alilc/lowcode-utils';

const sampleNodeSchema: IPublicTypePropType = {
  type: 'shape',
  value: [
    {
      name: 'id',
      propType: {
        type: 'string',
        isRequired: true,
      },
    },
    {
      name: 'componentName',
      propType: {
        type: 'string',
        isRequired: true,
      },
    },
    {
      name: 'props',
      propType: 'object',
    },
    {
      name: 'condition',
      propType: 'any',
    },
    {
      name: 'loop',
      propType: 'any',
    },
    {
      name: 'loopArgs',
      propType: 'any',
    },
    {
      name: 'children',
      propType: 'any',
    },
  ],
};

export const nodeSchemaPropType: IPublicTypePropType = {
  type: 'shape',
  value: [
    sampleNodeSchema.value[0],
    sampleNodeSchema.value[1],
    {
      name: 'props',
      propType: {
        type: 'objectOf',
        value: {
          type: 'oneOfType',
          // 不会强制校验，更多作为提示
          value: [
            'any',
            {
              type: 'shape',
              value: [
                {
                  name: 'type',
                  propType: {
                    type: 'oneOf',
                    value: ['JSExpression'],
                  },
                },
                {
                  name: 'value',
                  propType: 'string',
                },
              ],
            },
            {
              type: 'shape',
              value: [
                {
                  name: 'type',
                  propType: {
                    type: 'oneOf',
                    value: ['JSFunction'],
                  },
                },
                {
                  name: 'value',
                  propType: 'string',
                },
              ],
            },
            {
              type: 'shape',
              value: [
                {
                  name: 'type',
                  propType: {
                    type: 'oneOf',
                    value: ['JSSlot'],
                  },
                },
                {
                  name: 'value',
                  propType: {
                    type: 'oneOfType',
                    value: [
                      sampleNodeSchema,
                      {
                        type: 'arrayOf',
                        value: sampleNodeSchema,
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      },
    },
    {
      name: 'condition',
      propType: {
        type: 'oneOfType',
        value: [
          'bool',
          {
            type: 'shape',
            value: [
              {
                name: 'type',
                propType: {
                  type: 'oneOf',
                  value: ['JSExpression'],
                },
              },
              {
                name: 'value',
                propType: 'string',
              },
            ],
          },
        ],
      },
    },
    {
      name: 'loop',
      propType: {
        type: 'oneOfType',
        value: [
          'array',
          {
            type: 'shape',
            value: [
              {
                name: 'type',
                propType: {
                  type: 'oneOf',
                  value: ['JSExpression'],
                },
              },
              {
                name: 'value',
                propType: 'string',
              },
            ],
          },
        ],
      },
    },
    {
      name: 'loopArgs',
      propType: {
        type: 'oneOfType',
        value: [
          {
            type: 'arrayOf',
            value: {
              type: 'oneOfType',
              value: [
                'any',
                {
                  type: 'shape',
                  value: [
                    {
                      name: 'type',
                      propType: {
                        type: 'oneOf',
                        value: ['JSExpression'],
                      },
                    },
                    {
                      name: 'value',
                      propType: 'string',
                    },
                  ],
                },
              ],
            },
          },
          {
            type: 'shape',
            value: [
              {
                name: 'type',
                propType: {
                  type: 'oneOf',
                  value: ['JSExpression'],
                },
              },
              {
                name: 'value',
                propType: 'string',
              },
            ],
          },
        ],
      },
    },
    {
      name: 'children',
      propType: {
        type: 'arrayOf',
        value: sampleNodeSchema,
      },
    },
  ],
};

export const historyCommand = (ctx: IPublicModelPluginContext) => {
  const { command, project } = ctx;
  return {
    init() {
      command.registerCommand({
        name: 'undo',
        description: 'Undo the last operation.',
        handler: () => {
          const state = project.currentDocument?.history.getState() || 0;
          const enable = !!(state & 1);
          if (!enable) {
            throw new Error('Can not undo.');
          }
          project.currentDocument?.history.back();
        },
      });

      command.registerCommand({
        name: 'redo',
        description: 'Redo the last operation.',
        handler: () => {
          const state = project.currentDocument?.history.getState() || 0;
          const enable = !!(state & 2);
          if (!enable) {
            throw new Error('Can not redo.');
          }
          project.currentDocument?.history.forward();
        },
      });
    },
  };
};

historyCommand.pluginName = '___history_command___';
historyCommand.meta = {
  commandScope: 'history',
};

export const nodeCommand = (ctx: IPublicModelPluginContext) => {
  const { command, project } = ctx;
  return {
    init() {
      command.registerCommand({
        name: 'add',
        description: 'Add a node to the canvas.',
        handler: (param: {
          parentNodeId: string;
          nodeSchema: IPublicTypeNodeSchema;
        }) => {
          const {
            parentNodeId,
            nodeSchema,
          } = param;
          const { project } = ctx;
          const parentNode = project.currentDocument?.getNodeById(parentNodeId);
          if (!parentNode) {
            throw new Error(`Can not find node '${parentNodeId}'.`);
          }

          if (!parentNode.isContainerNode) {
            throw new Error(`Node '${parentNodeId}' is not a container node.`);
          }

          if (!isNodeSchema(nodeSchema)) {
            throw new Error('Invalid node.');
          }

          project.currentDocument?.insertNode(parentNode, nodeSchema);
        },
        parameters: [
          {
            name: 'parentNodeId',
            propType: 'string',
            description: 'The id of the parent node.',
          },
          {
            name: 'nodeSchema',
            propType: nodeSchemaPropType,
            description: 'The node to be added.',
          },
        ],
      });

      command.registerCommand({
        name: 'move',
        description: 'Move a node to another node.',
        handler(param: {
          nodeId: string;
          targetNodeId: string;
          index: number;
        }) {
          const {
            nodeId,
            targetNodeId,
            index = 0,
          } = param;

          const node = project.currentDocument?.getNodeById(nodeId);
          const targetNode = project.currentDocument?.getNodeById(targetNodeId);
          if (!node) {
            throw new Error(`Can not find node '${nodeId}'.`);
          }

          if (!targetNode) {
            throw new Error(`Can not find node '${targetNodeId}'.`);
          }

          if (!targetNode.isContainerNode) {
            throw new Error(`Node '${targetNodeId}' is not a container node.`);
          }

          if (index < 0 || index > (targetNode.children?.size || 0)) {
            throw new Error(`Invalid index '${index}'.`);
          }

          project.currentDocument?.removeNode(node);
          project.currentDocument?.insertNode(targetNode, node, index);
        },
        parameters: [
          {
            name: 'nodeId',
            propType: 'string',
            description: 'The id of the node to be moved.',
          },
          {
            name: 'targetNodeId',
            propType: 'string',
            description: 'The id of the target node.',
          },
          {
            name: 'index',
            propType: 'number',
            description: 'The index of the node to be moved.',
          },
        ],
      });

      command.registerCommand({
        name: 'remove',
        description: 'Remove a node from the canvas.',
        handler(param: {
          nodeId: string;
        }) {
          const {
            nodeId,
          } = param;

          const node = project.currentDocument?.getNodeById(nodeId);
          if (!node) {
            throw new Error(`Can not find node '${nodeId}'.`);
          }

          project.currentDocument?.removeNode(node);
        },
        parameters: [
          {
            name: 'nodeId',
            propType: 'string',
            description: 'The id of the node to be removed.',
          },
        ],
      });

      command.registerCommand({
        name: 'replace',
        description: 'Replace a node with another node.',
        handler(param: {
          nodeId: string;
          nodeSchema: IPublicTypeNodeSchema;
        }) {
          const {
            nodeId,
            nodeSchema,
          } = param;

          const node = project.currentDocument?.getNodeById(nodeId);
          if (!node) {
            throw new Error(`Can not find node '${nodeId}'.`);
          }

          if (!isNodeSchema(nodeSchema)) {
            throw new Error('Invalid node.');
          }

          node.importSchema(nodeSchema);
        },
        parameters: [
          {
            name: 'nodeId',
            propType: 'string',
            description: 'The id of the node to be replaced.',
          },
          {
            name: 'nodeSchema',
            propType: nodeSchemaPropType,
            description: 'The node to replace.',
          },
        ],
      });

      command.registerCommand({
        name: 'updateProps',
        description: 'Update the properties of a node.',
        handler(param: {
          nodeId: string;
          props: Record<string, any>;
        }) {
          const {
            nodeId,
            props,
          } = param;

          const node = project.currentDocument?.getNodeById(nodeId);
          if (!node) {
            throw new Error(`Can not find node '${nodeId}'.`);
          }

          Object.keys(props).forEach(key => {
            node.setPropValue(key, props[key]);
          });
        },
        parameters: [
          {
            name: 'nodeId',
            propType: 'string',
            description: 'The id of the node to be updated.',
          },
          {
            name: 'props',
            propType: 'object',
            description: 'The properties to be updated.',
          },
        ],
      });

      command.registerCommand({
        name: 'removeProps',
        description: 'Remove the properties of a node.',
        handler(param: {
          nodeId: string;
          propNames: string[];
        }) {
          const {
            nodeId,
            propNames,
          } = param;

          const node = project.currentDocument?.getNodeById(nodeId);
          if (!node) {
            throw new Error(`Can not find node '${nodeId}'.`);
          }

          propNames.forEach(key => {
            node.props?.getProp(key)?.remove();
          });
        },
        parameters: [
          {
            name: 'nodeId',
            propType: 'string',
            description: 'The id of the node to be updated.',
          },
          {
            name: 'propNames',
            propType: 'array',
            description: 'The properties to be removed.',
          },
        ],
      });
    },
  };
};

nodeCommand.pluginName = '___node_command___';
nodeCommand.meta = {
  commandScope: 'node',
};

export const defaultCommand = (ctx: IPublicModelPluginContext) => {
  const { plugins } = ctx;
  plugins.register(nodeCommand);
  plugins.register(historyCommand);

  return {
    init() {
    },
  };
};

defaultCommand.pluginName = '___default_command___';
defaultCommand.meta = {
  commandScope: 'common',
};
