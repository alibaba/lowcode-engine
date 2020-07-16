export default {
  componentName: 'Page',
  fileName: 'tab_article',
  props: {
    style: {
      paddingTop: 20,
      paddingRight: 20,
      paddingLeft: 20
    }
  },
  children: [
    {
      componentName: 'Div',
      props: {
        style: {
          marginTop: 5,
          marginBottom: 15,
          borderBottom: '1px solid rgba(244,244,244)'
        }
      },
      children: [
        {
          componentName: 'Div',
          props: {
            style: {
              marginBottom: 15
            }
          },
          children: [
            {
              componentName: 'Text',
              props: {
                text: '{{this.item.title}}',
                style: {
                  color: 'rgba(51,51,51)'
                }
              }
            },
            {
              componentName: 'Text',
              props: {
                text: '{{this.item.datetime}}',
                style: {
                  fontSize: '12px',
                  color: '#666',
                  float: 'right'
                }
              }
            }
          ]
        },
        {
          componentName: 'Div',
          props: {
            style: {
              paddingBottom: 15,
              fontSize: '13px',
              color: '#666'
            }
          },
          children: '{{this.item.description}}'
        },
        {
          componentName: 'Div',
          props: {
            style: {
              marginBottom: 15
            }
          },
          children: [
            {
              componentName: 'Button',
              props: {
                type: 'normal',
                style: {
                  marginRight: 5,
                  marginLeft: 5
                },
                size: 'small'
              },
              children: '{{this.item}}',
              loop: '{{this.item.tags}}'
            },
            {
              componentName: 'Div',
              props: {
                style: {
                  marginBottom: 15,
                  float: 'right'
                }
              },
              children: [
                {
                  componentName: 'Div',
                  props: {
                    style: {
                      display: 'inline-block',
                      marginRight: 5,
                      marginBottom: 15,
                      marginLeft: 5,
                      fontSize: 12,
                      color: '#666',
                      float: 'none'
                    }
                  },
                  children: '{{"点赞："+this.item.star}}'
                },
                {
                  componentName: 'Div',
                  props: {
                    style: {
                      display: 'inline-block',
                      marginRight: 5,
                      marginBottom: 15,
                      marginLeft: 5,
                      fontSize: 12,
                      color: '#666',
                      float: 'none'
                    }
                  },
                  children: '{{"喜爱："+this.item.like}}'
                },
                {
                  componentName: 'Div',
                  props: {
                    style: {
                      display: 'inline-block',
                      marginRight: 5,
                      marginBottom: 15,
                      marginLeft: 5,
                      fontSize: 12,
                      color: '#66',
                      float: 'none'
                    }
                  },
                  children: '{{"评论："+this.item.comment}}'
                }
              ]
            }
          ]
        }
      ],
      loop: '{{this.state.dataSource}}'
    },
    {
      componentName: 'Pagination',
      props: {
        shape: 'normal',
        type: 'normal',
        size: 'medium',
        style: {
          marginTop: 10,
          marginBottom: 30,
          textAlign: 'right'
        },
        onChange: function onChange(current, e) {
          //页码发生改变时的回调函数
          //@param {Number} current 改变后的页码数
          //@param {Object} e 点击事件对象
          this.page.reloadDataSource();
        }
      }
    }
  ],
  dataSource: {
    dataHandler: function dataHandler(dataMap) {
      const dataSource = [
        {
          title: '越夏越嗨皮-7月官方营销活动-技能提升方向',
          description:
            '商家通过V任务选择主播并达成合作，费用按照商品链接计算，一个商品为一个价格，建议主播在一场直播里最多接60个商品，并提供不少于两个小时的直播服务，每个商品讲解时间不少于5分钟。 ',
          tags: ['直播', '大促', '简介'],
          datetime: '2017年12月12日 18:00',
          star: Math.floor(Math.random() * 100) + 100,
          like: Math.floor(Math.random() * 100) + 200,
          comment: Math.floor(Math.random() * 100) + 100
        },
        {
          title: '越夏越嗨皮-7月官方营销活动-技能提升方向',
          description:
            '商家通过V任务选择主播并达成合作，费用按照商品链接计算，一个商品为一个价格，建议主播在一场直播里最多接60个商品，并提供不少于两个小时的直播服务，每个商品讲解时间不少于5分钟。 ',
          tags: ['直播', '大促', '简介'],
          datetime: '2017年12月12日 18:00',
          star: Math.floor(Math.random() * 100) + 100,
          like: Math.floor(Math.random() * 100) + 200,
          comment: Math.floor(Math.random() * 100) + 100
        },
        {
          title: '越夏越嗨皮-7月官方营销活动-技能提升方向',
          description:
            '商家通过V任务选择主播并达成合作，费用按照商品链接计算，一个商品为一个价格，建议主播在一场直播里最多接60个商品，并提供不少于两个小时的直播服务，每个商品讲解时间不少于5分钟。 ',
          tags: ['直播', '大促', '简介'],
          datetime: '2017年12月12日 18:00',
          star: Math.floor(Math.random() * 100) + 100,
          like: Math.floor(Math.random() * 100) + 200,
          comment: Math.floor(Math.random() * 100) + 100
        },
        {
          title: '越夏越嗨皮-7月官方营销活动-技能提升方向',
          description:
            '商家通过V任务选择主播并达成合作，费用按照商品链接计算，一个商品为一个价格，建议主播在一场直播里最多接60个商品，并提供不少于两个小时的直播服务，每个商品讲解时间不少于5分钟。 ',
          tags: ['直播', '大促', '简介'],
          datetime: '2017年12月12日 18:00',
          star: Math.floor(Math.random() * 100) + 100,
          like: Math.floor(Math.random() * 100) + 200,
          comment: Math.floor(Math.random() * 100) + 100
        },
        {
          title: '越夏越嗨皮-7月官方营销活动-技能提升方向',
          description:
            '商家通过V任务选择主播并达成合作，费用按照商品链接计算，一个商品为一个价格，建议主播在一场直播里最多接60个商品，并提供不少于两个小时的直播服务，每个商品讲解时间不少于5分钟。 ',
          tags: ['直播', '大促', '简介'],
          datetime: '2017年12月12日 18:00',
          star: Math.floor(Math.random() * 100) + 100,
          like: Math.floor(Math.random() * 100) + 200,
          comment: Math.floor(Math.random() * 100) + 100
        }
      ];
      return {
        dataSource
      };
    }
  }
};
