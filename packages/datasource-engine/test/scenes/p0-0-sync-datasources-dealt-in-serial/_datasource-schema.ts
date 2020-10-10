import { DataSource } from '@ali/build-success-types';

// 这里仅仅是数据源部分的 schema:
// @see: https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#XMeF5
export const DATA_SOURCE_SCHEMA: DataSource = {
  list: [
    {
      id: 'user',
      isInit: true,
      type: 'fetch',
      isSync: true,
      options: {
        uri: 'https://mocks.alibaba-inc.com/user.json',
      },
    },
    {
      id: 'orders',
      isInit: true,
      type: 'fetch',
      isSync: true,
      options: {
        uri: 'https://mocks.alibaba-inc.com/orders.json',
        params: {
          type: 'JSExpression',
          value: '{ userId: this.state.user.id }',
        },
      },
    },
  ],
};
