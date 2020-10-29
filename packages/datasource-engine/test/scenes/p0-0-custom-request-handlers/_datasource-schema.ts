import { InterpretDataSource } from '@ali/lowcode-types';

// 这里仅仅是数据源部分的 schema:
// @see: https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#XMeF5
export const DATA_SOURCE_SCHEMA: InterpretDataSource = {
  list: [
    {
      id: 'user',
      isInit: true,
      type: 'custom',
      isSync: true,
      requestHandler: {
        type: 'JSFunction',
        value: `function(options){
          return new Promise(res => {
            setTimeout(() => {
              // test return data
               res({
                data: {
                  id: 9527,
                  name: 'Alice',
                  uri: options.uri,
                }
              });
            }, 1000);
          });
        }`,
      },
      options: {
        uri: 'https://mocks.alibaba-inc.com/user.json',
      },
    },
    {
      id: 'orders',
      isInit: true,
      type: 'custom',
      isSync: true,
      requestHandler: {
        type: 'JSFunction',
        value: `function(options){
          return new Promise((res, rej) => {
            setTimeout(() => {
              // test return data
              return rej(new Error('test error'));
            }, 1000);
          });
        }`,
      },
      options: {
        uri: 'https://mocks.alibaba-inc.com/orders.json',
        params: {
          type: 'JSExpression',
          value: '{ userId: this.state.user.id }',
        },
      },
    },
    {
      id: 'members',
      isInit: true,
      type: 'custom',
      isSync: true,
      options: {
        uri: 'https://mocks.alibaba-inc.com/members.json',
      },
    },
  ],
};
