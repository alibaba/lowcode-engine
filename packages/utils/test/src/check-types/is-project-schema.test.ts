import { IPublicTypeProjectSchema } from "@alilc/lowcode-types";
import { isProjectSchema } from "../../../src/check-types/is-project-schema";

describe("isProjectSchema", () => {
  it("should return true if data has componentsTree property", () => {
    const data: IPublicTypeProjectSchema = {
      // ...
      componentsTree: {
        // ...
      },
    };
    expect(isProjectSchema(data)).toBe(true);
  });

  it("should return false if data does not have componentsTree property", () => {
    const data = {
      // ...
    };
    expect(isProjectSchema(data)).toBe(false);
  });

  it("should return false if data is null or undefined", () => {
    expect(isProjectSchema(null)).toBe(false);
    expect(isProjectSchema(undefined)).toBe(false);
  });

  // 更多的测试用例...
});
