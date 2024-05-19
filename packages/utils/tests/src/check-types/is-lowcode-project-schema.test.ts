import { isLowcodeProjectSchema } from "../../../src/check-types/is-lowcode-project-schema";

describe("isLowcodeProjectSchema", () => {
  it("should return false when data is null", () => {
    const result = isLowcodeProjectSchema(null);
    expect(result).toBe(false);
  });

  it("should return false when data is undefined", () => {
    const result = isLowcodeProjectSchema(undefined);
    expect(result).toBe(false);
  });

  it("should return false when data is not an object", () => {
    const result = isLowcodeProjectSchema("not an object");
    expect(result).toBe(false);
  });

  it("should return false when componentsTree is missing", () => {
    const data = { someKey: "someValue" };
    const result = isLowcodeProjectSchema(data);
    expect(result).toBe(false);
  });

  it("should return false when componentsTree is an empty array", () => {
    const data = { componentsTree: [] };
    const result = isLowcodeProjectSchema(data);
    expect(result).toBe(false);
  });

  it("should return false when the first element of componentsTree is not a component schema", () => {
    const data = { componentsTree: [{}] };
    const result = isLowcodeProjectSchema(data);
    expect(result).toBe(false);
  });

  it("should return true when all conditions are met", () => {
    const data = { componentsTree: [{ prop: "value", componentName: 'Component' }] };
    const result = isLowcodeProjectSchema(data);
    expect(result).toBe(true);
  });
});
