import parse from '../src';
import { IMaterializeOptions } from '../src/types';

const dynamicComponent = '@alifd/biz-anchor@1.1.7';

test('materialize dynamic component by online', async () => {
  const options: IMaterializeOptions = {
    entry: dynamicComponent,
    accesser: 'online',
  };

  const actual = await parse(options);
  expect(actual).toMatchSnapshot();
});