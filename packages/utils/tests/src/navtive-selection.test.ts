import { setNativeSelection, nativeSelectionEnabled } from '../../src/navtive-selection';

describe('setNativeSelection', () => {
  beforeEach(() => {
    // 在每个测试运行之前重置nativeSelectionEnabled的值
    setNativeSelection(true);
  });

  test('should enable native selection', () => {
    setNativeSelection(true);
    expect(nativeSelectionEnabled).toBe(true);
  });

  test('should disable native selection', () => {
    setNativeSelection(false);
    expect(nativeSelectionEnabled).toBe(false);
  });
});
