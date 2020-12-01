import '../fixtures/window';
import flagsCtrl from '../../src/flags';
import domready from 'domready';

jest.mock('domready', () => {
  return (fn) => fn();
});
// domready.mockImplementation((fn) => fn());

describe('flags 测试', () => {
  it('flags', () => {
    const mockFlagsChange = jest.fn();
    flagsCtrl.flags = [];
    const off = flagsCtrl.onFlagsChange(mockFlagsChange);
    flagsCtrl.add('a');
    expect(mockFlagsChange).toHaveBeenCalledTimes(1);
    off();
    flagsCtrl.add('b');
    expect(mockFlagsChange).toHaveBeenCalledTimes(1);


    expect(flagsCtrl.getFlags()).toEqual(['a', 'b']);

    flagsCtrl.flags = [];
    flagsCtrl.setDragMode(true);
    expect(flagsCtrl.getFlags()).toEqual(['drag-mode']);
    flagsCtrl.setDragMode(false);
    expect(flagsCtrl.getFlags()).toEqual([]);

    flagsCtrl.setPreviewMode(true);
    expect(flagsCtrl.getFlags()).toEqual(['preview-mode']);
    flagsCtrl.setPreviewMode(false);
    expect(flagsCtrl.getFlags()).toEqual(['design-mode']);

    flagsCtrl.flags = [];
    flagsCtrl.setHideSlate(true);
    expect(flagsCtrl.getFlags()).toEqual(['hide-slate']);
    flagsCtrl.setHideSlate(false);
    expect(flagsCtrl.getFlags()).toEqual([]);

    flagsCtrl.flags = [];
    flagsCtrl.setSlateFixedMode(true);
    expect(flagsCtrl.getFlags()).toEqual(['slate-fixed']);
    flagsCtrl.setHideSlate(true);
    expect(flagsCtrl.getFlags()).toEqual(['slate-fixed']);
    flagsCtrl.setSlateFixedMode(false);
    expect(flagsCtrl.getFlags()).toEqual([]);

    flagsCtrl.flags = [];
    flagsCtrl.setSlateFullMode(true);
    expect(flagsCtrl.getFlags()).toEqual(['slate-full-screen']);
    flagsCtrl.setSlateFullMode(false);
    expect(flagsCtrl.getFlags()).toEqual([]);

    expect([].slice.apply(document.documentElement.classList)).toEqual(flagsCtrl.getFlags());

    flagsCtrl.flags = [];
    // setWithShell
    flagsCtrl.setWithShell('shellA');
    expect(flagsCtrl.getFlags()).toEqual(['with-iphone6shell']);
    flagsCtrl.setWithShell('iPhone6');
    expect(flagsCtrl.getFlags()).toEqual(['with-iphone6shell']);

    flagsCtrl.flags = [];
    // setSimulator
    flagsCtrl.setSimulator('simA');
    expect(flagsCtrl.getFlags()).toEqual(['simulator-simA']);
    flagsCtrl.setSimulator('simB');
    expect(flagsCtrl.getFlags()).toEqual(['simulator-simB']);
  });
});
