import { compatibleLegaoSchema } from '../../src/schema';
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