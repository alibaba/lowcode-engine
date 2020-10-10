import { RuntimeDataSource } from '@ali/build-success-types';

// 这里仅仅是数据源部分的:
// @see: https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#XMeF5
export const dataSource: RuntimeDataSource = {
  list: [
    {
      id: 'user',
      type: 'fetch',
      options: () => ({
        uri: 'https://mocks.alibaba-inc.com/user.json',
      }),
    },
  ],
};
