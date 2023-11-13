import { isSettingField } from "../../../src/check-types/is-setting-field";

describe("isSettingField", () => {
  it("should return true for an object that has isSettingField property", () => {
    const obj = { isSettingField: true };
    expect(isSettingField(obj)).toBe(true);
  });

  it("should return false for an object that does not have isSettingField property", () => {
    const obj = { foo: "bar" };
    expect(isSettingField(obj)).toBe(false);
  });

  it("should return false for a falsy value", () => {
    const obj = null;
    expect(isSettingField(obj)).toBe(false);
  });
});
