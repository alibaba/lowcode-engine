import { DataSource } from '@ali/build-success-types';

// 这里仅仅是数据源部分的 schema:
// @see: https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#XMeF5
export const DATA_SOURCE_SCHEMA: DataSource = {
  list: [
    {
      id: 'urlParams',
      isInit: true,
      type: 'urlParams',
    },
  ],
};
