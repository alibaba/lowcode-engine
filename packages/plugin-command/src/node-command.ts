import { IPublicModelPluginContext, IPublicTypeNodeSchema, IPublicTypePlugin, IPublicTypePropType } from '@alilc/lowcode-types';
import { isNodeSchema } from '@alilc/lowcode-utils';

const sampleNodeSchema: IPublicTypePropType = {
  type: 'shape',
  value: [
    {
      name: 'id',
      propType: 'string',
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

export const nodeCommand: IPublicTypePlugin = (ctx: IPublicModelPluginContext) => {
  const { command, project } = ctx;
  return {
    init() {
      command.registerCommand({
        name: 'add',
        description: 'Add a node to the canvas.',
        handler: (param: {
          parentNodeId: string;
          nodeSchema: IPublicTypeNodeSchema;
          index: number;
        }) => {
          const {
            parentNodeId,
            nodeSchema,
            index,
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

          if (index < 0 || index > (parentNode.children?.size || 0)) {
            throw new Error(`Invalid index '${index}'.`);
          }

          project.currentDocument?.insertNode(parentNode, nodeSchema, index);
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
          {
            name: 'index',
            propType: 'number',
            description: 'The index of the node to be added.',
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

          if (!nodeId) {
            throw new Error('Invalid node id.');
          }

          if (!targetNodeId) {
            throw new Error('Invalid target node id.');
          }

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
            propType: {
              type: 'string',
              isRequired: true,
            },
            description: 'The id of the node to be moved.',
          },
          {
            name: 'targetNodeId',
            propType: {
              type: 'string',
              isRequired: true,
            },
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
        name: 'update',
        description: 'Update a node.',
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
            description: 'The id of the node to be updated.',
          },
          {
            name: 'nodeSchema',
            propType: nodeSchemaPropType,
            description: 'The node to be updated.',
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
    destroy() {
      command.unregisterCommand('node:add');
      command.unregisterCommand('node:move');
      command.unregisterCommand('node:remove');
      command.unregisterCommand('node:update');
      command.unregisterCommand('node:updateProps');
      command.unregisterCommand('node:removeProps');
    },
  };
};

nodeCommand.pluginName = '___node_command___';
nodeCommand.meta = {
  commandScope: 'node',
};

