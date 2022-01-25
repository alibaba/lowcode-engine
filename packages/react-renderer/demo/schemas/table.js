/* eslint-disable */
export default {
  componentName: 'Page',
  fileName: 'filterTable',
  props: {
    style: {
      paddingRight: 20,
      paddingLeft: 20
    }
  },
  children: [
    {
      componentName: 'Table',
      props: {
        hasBorder: false,
        hasHeader: true,
        dataSource: [
          {
            id: 1,
            title: '2017秋冬新款背带裙复古格子连衣裙清新背心裙a字裙短裙子',
            url: 'https://item.taobao.com/item.htm?id=558559528377',
            type: '清单',
            publishTime: '17-04-28 20:29:20',
            publishStatus: '已发布',
            pushStatus: '已推送至订阅号',
            operation: {
              edit: true
            }
          },
          {
            id: 2,
            title: '2017秋冬新款 高质感特定纱线欧美宽松马海毛羊毛毛衣',
            url: 'https://item.taobao.com/item.htm?id=558559528377',
            type: '清单',
            publishTime: '17-04-28 20:29:20',
            publishStatus: '已发布',
            pushStatus: '已推送至订阅号',
            operation: {
              edit: true
            }
          },
          {
            id: 3,
            title: '日式天然玉米皮草编碗垫锅垫隔热垫茶垫加厚餐垫GD-29',
            url: 'https://item.taobao.com/item.htm?id=558559528377',
            type: '清单',
            publishTime: '17-04-28 20:29:20',
            publishStatus: '已发布',
            pushStatus: '已推送至订阅号',
            operation: {
              edit: true
            }
          },
          {
            id: 4,
            title: '2017秋冬新款 绑带腰封设计感超顺滑质感落肩铜氨丝连衣裙',
            url: 'https://item.taobao.com/item.htm?id=558559528377',
            type: '清单',
            publishTime: '17-04-28 20:29:20',
            publishStatus: '已发布',
            pushStatus: '已推送至订阅号',
            operation: {
              edit: true
            }
          },
          {
            id: 5,
            title: '日式糖果色陶瓷柄不锈钢餐具西餐牛扒刀叉勺子咖啡勺',
            url: 'https://item.taobao.com/item.htm?id=558559528377',
            type: '清单',
            publishTime: '17-04-28 20:29:20',
            publishStatus: '已发布',
            pushStatus: '已推送至订阅号',
            operation: {
              edit: true
            }
          },
          {
            id: 6,
            title: '日式和风深蓝素色文艺餐巾餐垫围裙锅垫隔热手套厨房桌布',
            url: 'https://item.taobao.com/item.htm?id=558559528377',
            type: '清单',
            publishTime: '17-04-28 20:29:20',
            publishStatus: '已发布',
            pushStatus: '已推送至订阅号',
            operation: {
              edit: true
            }
          },
          {
            id: 7,
            title: '日式雪点樱花手绘陶瓷餐具米饭碗拉面碗寿司盘子汤碗',
            url: 'https://item.taobao.com/item.htm?id=558559528377',
            type: '清单',
            publishTime: '17-04-28 20:29:20',
            publishStatus: '已发布',
            pushStatus: '已推送至订阅号',
            operation: {
              edit: true
            }
          },
          {
            id: 8,
            title: '川岛屋 釉下彩复古日式陶瓷盘子菜盘圆盘调味碟 米饭碗日式餐具',
            url: 'https://item.taobao.com/item.htm?id=558559528377',
            type: '清单',
            publishTime: '17-04-28 20:29:20',
            publishStatus: '已发布',
            pushStatus: '已推送至订阅号',
            operation: {
              edit: true
            }
          }
        ]
      },
      children: [
        {
          componentName: 'TableColumn',
          props: {
            dataIndex: 'title',
            title: '问题描述',
            resizable: false
          }
        },
        {
          componentName: 'TableColumn',
          props: {
            title: '问题分类',
            dataIndex: 'type'
          }
        },
        {
          componentName: 'TableColumn',
          props: {
            title: '发布时间',
            dataIndex: 'publishTime'
          }
        },
        {
          componentName: 'TableColumn',
          props: {
            title: '状态',
            dataIndex: 'publishStatus',
            cell: [
              {
                componentName: 'Button',
                props: {
                  type: 'normal',
                  size: 'small',
                  component: 'div',
                  text: true,
                  ghost: false,
                  style: {
                    width: '30px',
                    fontSize: '12px',
                    color: '#666',
                    cursor: 'auto',
                    background: '#f7f8fa'
                  }
                },
                children: '已发布',
                condition: false
              },
              {
                componentName: 'Text',
                props: {
                  text: '已发布',
                  style: {
                    paddingTop: 2,
                    paddingRight: 5,
                    paddingBottom: 2,
                    paddingLeft: 5,
                    fontSize: '12px',
                    color: '#666',
                    borderRadius: 3,
                    cursor: 'auto',
                    background: '#f7f8fa'
                  }
                }
              }
            ]
          }
        },
        {
          componentName: 'TableColumn',
          props: {
            title: '操作',
            cell: [
              {
                componentName: 'Button',
                props: {
                  type: 'normal',
                  component: 'a',
                  size: 'medium',
                  loading: false,
                  text: true,
                  style: {
                    paddingRight: 10,
                    paddingLeft: 10,
                    color: '#2077ff'
                  }
                },
                children: '解决'
              },
              {
                componentName: 'Button',
                props: {
                  type: 'normal',
                  component: 'a',
                  text: true,
                  style: {
                    paddingRight: 10,
                    paddingLeft: 10,
                    color: '#2077ff'
                  }
                },
                children: '详情'
              },
              {
                componentName: 'Button',
                props: {
                  type: 'normal',
                  text: true,
                  component: 'a',
                  style: {
                    paddingRight: 10,
                    paddingLeft: 10,
                    color: '#2077ff'
                  }
                },
                children: '分类'
              }
            ]
          }
        }
      ],
      loopArgs: ['', '']
    },
    {
      componentName: 'Div',
      props: {
        style: {
          textAlign: 'right'
        }
      },
      children: [
        {
          componentName: 'Pagination',
          props: {
            shape: 'normal',
            type: 'normal',
            size: 'medium',
            style: {
              marginTop: 20
            }
          }
        }
      ]
    }
  ],
  dataSource: {
    dataHandler: function dataHandler(dataMap) {
      let dataSource = [
        {
          id: 1,
          title: '2017秋冬新款背带裙复古格子连衣裙清新背心裙a字裙短裙子',
          url: 'https://item.taobao.com/item.htm?id=558559528377',
          type: '清单',
          publishTime: '17-04-28 20:29:20',
          publishStatus: '已发布',
          pushStatus: '已推送至订阅号',
          operation: {
            edit: true
          }
        },
        {
          id: 2,
          title: '2017秋冬新款 高质感特定纱线欧美宽松马海毛羊毛毛衣',
          url: 'https://item.taobao.com/item.htm?id=558559528377',
          type: '清单',
          publishTime: '17-04-28 20:29:20',
          publishStatus: '已发布',
          pushStatus: '已推送至订阅号',
          operation: {
            edit: true
          }
        },
        {
          id: 3,
          title: '日式天然玉米皮草编碗垫锅垫隔热垫茶垫加厚餐垫GD-29',
          url: 'https://item.taobao.com/item.htm?id=558559528377',
          type: '清单',
          publishTime: '17-04-28 20:29:20',
          publishStatus: '已发布',
          pushStatus: '已推送至订阅号',
          operation: {
            edit: true
          }
        },
        {
          id: 4,
          title: '2017秋冬新款 绑带腰封设计感超顺滑质感落肩铜氨丝连衣裙',
          url: 'https://item.taobao.com/item.htm?id=558559528377',
          type: '清单',
          publishTime: '17-04-28 20:29:20',
          publishStatus: '已发布',
          pushStatus: '已推送至订阅号',
          operation: {
            edit: true
          }
        },
        {
          id: 5,
          title: '日式糖果色陶瓷柄不锈钢餐具西餐牛扒刀叉勺子咖啡勺',
          url: 'https://item.taobao.com/item.htm?id=558559528377',
          type: '清单',
          publishTime: '17-04-28 20:29:20',
          publishStatus: '已发布',
          pushStatus: '已推送至订阅号',
          operation: {
            edit: true
          }
        },
        {
          id: 6,
          title: '日式和风深蓝素色文艺餐巾餐垫围裙锅垫隔热手套厨房桌布',
          url: 'https://item.taobao.com/item.htm?id=558559528377',
          type: '清单',
          publishTime: '17-04-28 20:29:20',
          publishStatus: '已发布',
          pushStatus: '已推送至订阅号',
          operation: {
            edit: true
          }
        },
        {
          id: 7,
          title: '日式雪点樱花手绘陶瓷餐具米饭碗拉面碗寿司盘子汤碗',
          url: 'https://item.taobao.com/item.htm?id=558559528377',
          type: '清单',
          publishTime: '17-04-28 20:29:20',
          publishStatus: '已发布',
          pushStatus: '已推送至订阅号',
          operation: {
            edit: true
          }
        },
        {
          id: 8,
          title: '川岛屋 釉下彩复古日式陶瓷盘子菜盘圆盘调味碟 米饭碗日式餐具',
          url: 'https://item.taobao.com/item.htm?id=558559528377',
          type: '清单',
          publishTime: '17-04-28 20:29:20',
          publishStatus: '已发布',
          pushStatus: '已推送至订阅号',
          operation: {
            edit: true
          }
        }
      ];
      return {
        ...dataMap,
        dataSource
      };
    }
  }
};
