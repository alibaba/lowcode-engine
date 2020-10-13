import { InterpretDataSource } from '@ali/lowcode-types';

// 这里仅仅是数据源部分的 schema:
// @see: https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#XMeF5
export const DATA_SOURCE_SCHEMA: InterpretDataSource = {
  list: [
    {
      id: 'user',
      type: 'fetch',
      options: {
        uri: 'https://mocks.alibaba-inc.com/user.json',
      },
    },
  ],
};
