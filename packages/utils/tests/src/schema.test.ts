import {
  compatibleLegaoSchema,
  getNodeSchemaById,
} from '../../src/schema';

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