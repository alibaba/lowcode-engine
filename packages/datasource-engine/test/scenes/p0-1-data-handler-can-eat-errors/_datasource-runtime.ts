import { RuntimeDataSource } from '@ali/lowcode-types';

export const DEFAULT_USER_DATA = { id: 0, name: 'guest' }; // 返回一个兜底的数据

// 这里仅仅是数据源部分的:
// @see: https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#XMeF5
export const dataSource: RuntimeDataSource = {
  list: [
    {
      id: 'user',
      isInit: true,
      type: 'fetch',
      options: () => ({
        uri: 'https://mocks.alibaba-inc.com/user.json',
      }),
      dataHandler: function dataHandler(response: any) {
        return response.data;
      },
    },
  ],
};
