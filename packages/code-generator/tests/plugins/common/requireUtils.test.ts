import requireUtils from '../../../src/plugins/common/requireUtils';
import { ICodeStruct } from '../../../src/types';

describe('tests/plugins/common/requireUtils', () => {
  it('should works', async () => {
    const plugin = requireUtils();
    const ctx: ICodeStruct = {
      chunks: [],
      depNames: [],
      ir: {},
      contextData: {},
    };

    const newCtx = await plugin.apply(ctx, [ctx]);
    expect(newCtx).toMatchSnapshot();
  });
});
