import { IPublicTypeNodeData } from '@alilc/lowcode-types';
import { handleSubNodes } from '../../../src/utils/schema';
import SCHEMA_WITH_SLOT from './data/schema-with-slot.json';

describe('utils/schema/handleSubNodes', () => {
  it('should be able to visit nodes in JSSlot(1)', () => {
    const nodes: IPublicTypeNodeData[] = [
      {
        componentName: 'Foo',
        props: {
          renderBar: {
            type: 'JSSlot',
            value: [
              {
                componentName: 'Bar',
              },
            ],
          },
        },
      },
    ];

    const result = handleSubNodes(nodes, {
      node: (node) => node.componentName,
    });

    expect(result).toEqual(['Foo', 'Bar']);
  });

  it('should be able to visit nodes in JSSlot(2)', () => {
    const nodes: IPublicTypeNodeData[] = (SCHEMA_WITH_SLOT as any).componentsTree[0].children;

    const result = handleSubNodes(nodes, {
      node: (node) => node.componentName,
    });

    expect(result).toMatchInlineSnapshot(`
      Array [
        "Modal",
        "AliAutoDivDefault",
        "AliAutoDivDefault",
        "Button",
        "AliAutoDivDefault",
        "Typography.Text",
        "Typography.Link",
        "Typography.Link",
        "Button",
        "NextPage",
        "NextBlock",
        "NextBlockCell",
        "NextP",
        "AliAutoDivDefault",
        "AliAutoDivDefault",
        "Form",
        "Form.Item",
        "Select",
        "Form.Item",
        "Input",
        "Form.Item",
        "Select",
        "Form.Item",
        "Input",
        "Form.Item",
        "Button",
        "AliAutoDivDefault",
        "Button",
        "NextBlock",
        "NextBlockCell",
        "NextP",
        "AliAutoSearchTableDefault",
        "Typography.Text",
        "Tooltip",
        "Typography.Text",
        "Typography.Text",
        "Typography.Text",
        "Icon",
        "Typography.Link",
        "Typography.Text",
        "Typography.Link",
        "Typography.Text",
        "Button",
        "Button",
        "Button",
        "Icon",
        "NextBlock",
        "NextBlockCell",
        "NextP",
        "Empty",
      ]
    `);
  });
});
