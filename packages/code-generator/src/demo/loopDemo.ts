import { IBasicSchema } from '@/types';

const demoData: IBasicSchema = {
  version: '1.0.0',
  componentsMap: [
    {
      componentName: 'Button',
      package: '@alifd/next',
      version: '1.19.4',
      destructuring: true,
      exportName: 'Select',
      subName: 'Button',
    },
  ],
  utils: [
    {
      name: 'clone',
      type: 'npm',
      content: {
        package: 'lodash',
        version: '0.0.1',
        exportName: 'clone',
        subName: '',
        destructuring: false,
        main: '/lib/clone',
      },
    },
    {
      name: 'moment',
      type: 'npm',
      content: {
        package: '@alife/next',
        version: '0.0.1',
        exportName: 'Moment',
        subName: '',
        destructuring: true,
        main: '',
      },
    },
  ],
  componentsTree: [
    {
      componentName: 'Page',
      fileName: 'loopDemo',
      props: {},
      children: [
        {
          componentName: 'Html',
          props: {
            html:
              '1.选中Col组件，在右侧“数据”面板，设置循环数据；<br/>\n2.给Col组件内的子组件文本内容，绑定对应的数据变量；this.item获取当前循环数据，this.index获取当前循环序号',
          },
        },
        {
          componentName: 'Row',
          props: {
            style: {
              paddingTop: 30,
              paddingRight: 30,
              paddingBottom: 30,
              paddingLeft: 30,
            },
          },
          children: [
            {
              componentName: 'Col',
              props: {},
              children: [
                {
                  componentName: 'Text',
                  props: {
                    style: {
                      display: 'block',
                      marginBottom: 8,
                      fontWeight: 'bold',
                      fontSize: 14,
                      lineHeight: '32px',
                    },
                    text: {
                      type: 'JSExpression',
                      value: 'this.item.title',
                    },
                  },
                },
                {
                  componentName: 'Text',
                  props: {
                    style: {
                      display: 'block',
                      marginBottom: 12,
                      fontWeight: 'bold',
                      fontSize: 16,
                      color: '#65aa14',
                      lineHeight: '12px',
                    },
                    text: {
                      type: 'JSExpression',
                      value: 'this.item.num',
                    },
                  },
                },
                {
                  componentName: 'Text',
                  props: {
                    style: {
                      display: 'block',
                      color: '#9b9b9b',
                    },
                    text: {
                      type: 'JSExpression',
                      value: 'this.item.description',
                    },
                  },
                },
              ],
              loop: [
                {
                  title: '活跃UV',
                  num: 2783,
                  description: '小二：外包商家：12',
                },
                {
                  title: '活跃PV',
                  num: 17382,
                  description: '小二外包商家123',
                },
                {
                  title: '不活跃页面数',
                  num: 36,
                  description: '占总页面数比例 30%',
                },
                {
                  title: '人均使用时长',
                  num: 788,
                  description: '人均使用频次',
                },
                {
                  title: '新增用户数',
                  num: 14,
                  description: '小二：外包：商家 1：1：1',
                },
              ],
            },
            {
              componentName: 'Col',
              props: {},
              children: [
                {
                  componentName: 'Text',
                  props: {
                    style: {
                      display: 'block',
                      marginBottom: 8,
                      fontWeight: 'bold',
                      fontSize: '14px',
                      lineHeight: '32px',
                    },
                    text: '更多用户数据分析',
                  },
                },
                {
                  componentName: 'Button',
                  props: {
                    type: 'primary',
                    style: {
                      margin: '0 5px 0 5px',
                    },
                  },
                  children: '查看详情',
                },
              ],
            },
          ],
        },
        {
          componentName: 'Table',
          props: {
            hasBorder: true,
            hasHeader: true,
            dataSource: [
              {
                id: 1,
                name: 'a1',
                age: 1,
              },
              {
                id: 2,
                name: 'a2',
                age: 2,
              },
              {
                id: 3,
                name: 'a3',
                age: 3,
              },
              {
                id: 4,
                name: 'a4',
                age: 4,
              },
            ],
          },
          children: [
            {
              componentName: 'TableColumn',
              props: {
                title: {
                  type: 'JSExpression',
                  value: 'this.item.title',
                },
                dataIndex: {
                  type: 'JSExpression',
                  value: 'this.item.dataIndex',
                },
              },
              loop: {
                type: 'JSExpression',
                value: 'this.state.columns',
              },
            },
          ],
        },
      ],
      state: {
        dataSource: [
          {
            id: 1,
            name: 'a1',
            age: 21,
          },
          {
            id: 2,
            name: 'a2',
            age: 22,
          },
          {
            id: 3,
            name: 'a3',
            age: 23,
          },
          {
            id: 4,
            name: 'a4',
            age: 24,
          },
        ],
        columns: [
          {
            title: 'ID',
            dataIndex: 'id',
          },
          {
            title: '姓名',
            dataIndex: 'name',
          },
          {
            title: '年龄',
            dataIndex: 'age',
          },
        ],
      },
    },
  ],
  i18n: {
    'zh-CN': {
      'i18n-jwg27yo4': '你好',
      'i18n-jwg27yo3': '中国',
    },
    'en-US': {
      'i18n-jwg27yo4': 'Hello',
      'i18n-jwg27yo3': 'China',
    },
  },
};

export default demoData;
