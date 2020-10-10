import { DataSource } from '@ali/build-success-types';

// 这里仅仅是数据源部分的 schema:
// @see: https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#XMeF5
export const DATA_SOURCE_SCHEMA: DataSource = {
  list: [
    {
      id: 'user',
      isInit: true,
      type: 'fetch',
      options: {
        uri: 'https://mocks.alibaba-inc.com/user.json',
      },
      dataHandler: {
        type: 'JSFunction',
        value: `
function dataHandler(response) {
  return response.data;
}
`,
      },
    },
  ],
};
