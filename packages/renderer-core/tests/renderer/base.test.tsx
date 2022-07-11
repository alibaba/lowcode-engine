const mockGetRenderers = jest.fn();
jest.mock('../../src/adapter', () => {
  return {
    getRenderers: () => { return mockGetRenderers();}
   };
});

import baseRendererFactory from '../../src/renderer/base';

describe('Base Render', () => {
  it('customBaseRenderer logic works', () => {
    mockGetRenderers.mockReturnValue({BaseRenderer: {}});
    const baseRenderer = baseRendererFactory();
    expect(mockGetRenderers).toBeCalledTimes(1);
    expect(baseRenderer).toStrictEqual({});
    mockGetRenderers.mockClear();
  });
});