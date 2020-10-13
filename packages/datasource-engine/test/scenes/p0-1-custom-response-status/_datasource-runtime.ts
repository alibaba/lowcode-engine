import { RuntimeDataSource } from '@ali/lowcode-types';

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
        const { data } = response;
        if (!data) {
          throw new Error('empty data!');
        }

        if (data.success) {
          return data.data;
        }

        this.recordError({ type: 'FETCH_ERROR', detail: data });

        throw new Error(data.message);
      },
    },
  ],
};
