import {
  compatibleLegaoSchema,
  getNodeSchemaById,
  applyActivities,
} from '../../src/schema';
import { ActivityType } from '@alilc/lowcode-types';

describe('compatibleLegaoSchema', () => {
  it('should handle null input', () => {
    const result = compatibleLegaoSchema(null);
    expect(result).toBeNull();
  });

  it('should convert Legao schema to JSExpression', () => {
    // Create your test input
    const legaoSchema = {
      type: 'LegaoType',
      source: 'LegaoSource',
      compiled: 'LegaoCompiled',
    };
    const result = compatibleLegaoSchema(legaoSchema);

    // Define the expected output
    const expectedOutput = {
      type: 'JSExpression',
      value: 'LegaoCompiled',
      extType: 'function',
    };

    // Assert that the result matches the expected output
    expect(result).toEqual(expectedOutput);
  });

  // Add more test cases for other scenarios
});

describe('getNodeSchemaById', () => {
  it('should find a node in the schema', () => {
    // Create your test schema and node ID
    const testSchema = {
      id: 'root',
      children: [
        {
          id: 'child1',
          children: [
            {
              id: 'child1.1',
            },
          ],
        },
      ],
    };
    const nodeId = 'child1.1';

    const result = getNodeSchemaById(testSchema, nodeId);

    // Define the expected output
    const expectedOutput = {
      id: 'child1.1',
    };

    // Assert that the result matches the expected output
    expect(result).toEqual(expectedOutput);
  });

  // Add more test cases for other scenarios
});

describe('applyActivities', () => {
  it('should apply ADD activity', () => {
    // Create your test schema and activities
    const testSchema = {
      id: 'root',
      children: [
        {
          id: 'child1',
          children: [
            {
              id: 'child1.1',
            },
          ],
        },
      ],
    };
    const activities = [
      {
        type: ActivityType.ADDED,
        payload: {
          location: {
            parent: {
              nodeId: 'child1',
              index: 0,
            },
          },
          schema: {
            id: 'newChild',
          },
        },
      },
    ];

    const result = applyActivities(testSchema, activities);

    // Define the expected output
    const expectedOutput = {
      id: 'root',
      children: [
        {
          id: 'child1',
          children: [
            {
              id: 'newChild',
            },
            {
              id: 'child1.1',
            },
          ],
        },
      ],
    };

    // Assert that the result matches the expected output
    expect(result).toEqual(expectedOutput);
  });

  // Add more test cases for other activity types and scenarios
});


describe('Schema Ut', () => {
  it('props', () => {
    const schema = {
      props: {
        mobileSlot: {
          type: "JSBlock",
          value: {
            componentName: "Slot",
            children: [
              {
                loop: {
                  variable: "props.content",
                  type: "variable"
                },
              }
            ],
          }
        },
      },
  };

    const result = compatibleLegaoSchema(schema);
    expect(result).toMatchSnapshot();
    expect(result.props.mobileSlot.value[0].loop.type).toBe('JSExpression');
  });
})