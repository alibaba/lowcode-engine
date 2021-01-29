export default{
  "componentName": "Page",
  "id": "node_dockcviv8fo1",
  "props": {
    "ref": "outterView",
    "autoLoading": true,
    "style": {
      "padding": "0 5px 0 5px"
    }
  },
  "fileName": "test",
  "dataSource": {
    "list": []
  },
  "state": {
    "text": "outter",
    "isShowDialog": false
  },
  "css": "body {font-size: 12px;} .botton{width:100px;color:#ff00ff}",
  "lifeCycles": {
    "componentDidMount": {
      "type": "JSFunction",
      "value": "function() {\n    console.log('did mount');\n  }"
    },
    "componentWillUnmount": {
      "type": "JSFunction",
      "value": "function() {\n    console.log('will umount');\n  }"
    }
  },
  "methods": {
    "testFunc": {
      "type": "JSFunction",
      "value": "function() {\n    console.log('test func');\n  }"
    },
    "onClick": {
      "type": "JSFunction",
      "value": "function() {\n    this.setState({\n      isShowDialog: true\n    })\n  }"
    },
    "closeDialog": {
      "type": "JSFunction",
      "value": "function() {\n    this.setState({\n      isShowDialog: false\n    })\n  }"
    }
  },
  "children": [
    {
      "componentName": "Box",
      "id": "node_dockcy8n9xed",
      "props": {
        "style": {
          "backgroundColor": "rgba(31,56,88,0.1)",
          "padding": "12px 12px 12px 12px"
        }
      },
      "children": [
        {
          "componentName": "Box",
          "id": "node_dockcy8n9xee",
          "props": {
            "style": {
              "padding": "12px 12px 12px 12px",
              "backgroundColor": "#ffffff"
            }
          },
          "children": [
            {
              "componentName": "Breadcrumb",
              "id": "node_dockcy8n9xef",
              "props": {
                "prefix": "next-",
                "maxNode": 100,
                "component": "nav"
              },
              "children": [
                {
                  "componentName": "Breadcrumb.Item",
                  "id": "node_dockcy8n9xeg",
                  "props": {
                    "prefix": "next-",
                    "children": "首页"
                  }
                },
                {
                  "componentName": "Breadcrumb.Item",
                  "id": "node_dockcy8n9xei",
                  "props": {
                    "prefix": "next-",
                    "children": "品质中台"
                  }
                },
                {
                  "componentName": "Breadcrumb.Item",
                  "id": "node_dockcy8n9xek",
                  "props": {
                    "prefix": "next-",
                    "children": "商家品质页面管理"
                  }
                },
                {
                  "componentName": "Breadcrumb.Item",
                  "id": "node_dockcy8n9xem",
                  "props": {
                    "prefix": "next-",
                    "children": "质检知识条配置"
                  }
                }
              ]
            }
          ]
        },
        {
          "componentName": "Box",
          "id": "node_dockcy8n9xeo",
          "props": {
            "style": {
              "marginTop": "12px",
              "backgroundColor": "#ffffff"
            }
          },
          "children": [
            {
              "componentName": "Form",
              "id": "node_dockcy8n9xep",
              "props": {
                "inline": true,
                "style": {
                  "marginTop": "12px",
                  "marginRight": "12px",
                  "marginLeft": "12px"
                },
                "__events": []
              },
              "children": [
                {
                  "componentName": "Form.Item",
                  "id": "node_dockcy8n9xeq",
                  "props": {
                    "style": {
                      "marginBottom": "0"
                    },
                    "label": "类目名："
                  },
                  "children": [
                    {
                      "componentName": "Select",
                      "id": "node_dockcy8n9xer",
                      "props": {
                        "mode": "single",
                        "hasArrow": true,
                        "cacheValue": true,
                        "style": {
                          "width": "150px"
                        }
                      }
                    }
                  ]
                },
                {
                  "componentName": "Form.Item",
                  "id": "node_dockcy8n9xes",
                  "props": {
                    "style": {
                      "marginBottom": "0"
                    },
                    "label": "项目类型："
                  },
                  "children": [
                    {
                      "componentName": "Select",
                      "id": "node_dockcy8n9xet",
                      "props": {
                        "mode": "single",
                        "hasArrow": true,
                        "cacheValue": true,
                        "style": {
                          "width": "200px"
                        }
                      }
                    }
                  ]
                },
                {
                  "componentName": "Form.Item",
                  "id": "node_dockcy8n9xeu",
                  "props": {
                    "style": {
                      "marginBottom": "0"
                    },
                    "label": "项目 ID："
                  },
                  "children": [
                    {
                      "componentName": "Input",
                      "id": "node_dockcy8n9xev",
                      "props": {
                        "hasBorder": true,
                        "size": "medium",
                        "autoComplete": "off",
                        "style": {
                          "width": "200px"
                        }
                      }
                    }
                  ]
                },
                {
                  "componentName": "Button.Group",
                  "id": "node_dockcy8n9xew",
                  "props": {},
                  "children": [
                    {
                      "componentName": "Button",
                      "id": "node_dockcy8n9xex",
                      "props": {
                        "type": "primary",
                        "style": {
                          "margin": "0 5px 0 5px"
                        },
                        "htmlType": "submit",
                        "children": "搜索"
                      }
                    },
                    {
                      "componentName": "Button",
                      "id": "node_dockcy8n9xe10",
                      "props": {
                        "type": "normal",
                        "style": {
                          "margin": "0 5px 0 5px"
                        },
                        "htmlType": "reset",
                        "children": "清空"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "componentName": "Box",
          "id": "node_dockcy8n9xe1f",
          "props": {
            "style": {
              "backgroundColor": "#ffffff",
              "paddingBottom": "24px",
              "display": "flex",
              "flexDirection": "row",
              "justifyContent": "flex-end"
            }
          },
          "children": [
            {
              "componentName": "Button",
              "id": "node_dockd5nrh9p4",
              "props": {
                "type": "primary",
                "size": "medium",
                "htmlType": "button",
                "component": "button",
                "children": "新建配置",
                "style": {},
                "__events": [
                  {
                    "type": "componentEvent",
                    "name": "onClick",
                    "relatedEventName": "onClick"
                  }
                ],
                "onClick": {
                  "type": "JSFunction",
                  "value": "function(){ this.onClick() }"
                }
              }
            }
          ]
        },
        {
          "componentName": "Box",
          "id": "node_dockd5nrh9p5",
          "props": {},
          "children": [
            {
              "componentName": "Table",
              "id": "node_dockjielosj1",
              "props": {
                "showMiniPager": true,
                "showActionBar": true,
                "actionBar": [
                  {
                    "title": "新增",
                    "type": "primary"
                  },
                  {
                    "title": "编辑"
                  }
                ],
                "columns": [
                  {
                    "dataKey": "name",
                    "width": 200,
                    "align": "center",
                    "title": "姓名",
                    "editType": "text"
                  },
                  {
                    "dataKey": "age",
                    "width": 200,
                    "align": "center",
                    "title": "年龄"
                  },
                  {
                    "dataKey": "email",
                    "width": 200,
                    "align": "center",
                    "title": "邮箱"
                  }
                ],
                "data": [
                  {
                    "name": "王小",
                    "id": "1",
                    "age": 15000,
                    "email": "aaa@abc.com"
                  },
                  {
                    "name": "王中",
                    "id": "2",
                    "age": 25000,
                    "email": "bbb@abc.com"
                  },
                  {
                    "name": "王大",
                    "id": "3",
                    "age": 35000,
                    "email": "ccc@abc.com"
                  }
                ],
                "actionTitle": "操作",
                "actionWidth": 180,
                "actionType": "link",
                "actionFixed": "right",
                "actionHidden": false,
                "maxWebShownActionCount": 2,
                "actionColumn": [
                  {
                    "title": "编辑",
                    "callback": {
                      "type": "JSFunction",
                      "value": "(rowData, action, table) => {\n return table.editRow(rowData).then((row) => {\n console.log(row);\n });\n }"
                    },
                    "device": [
                      "desktop"
                    ]
                  },
                  {
                    "title": "保存",
                    "callback": {
                      "type": "JSFunction",
                      "value": "(rowData, action, table) => { \nreturn table.saveRow(rowData).then((row) => { \nconsole.log(row); \n}); \n}"
                    },
                    "mode": "EDIT"
                  }
                ]
              }
            },
            {
              "componentName": "Box",
              "id": "node_dockd5nrh9pg",
              "props": {
                "style": {
                  "display": "flex",
                  "flexDirection": "row",
                  "justifyContent": "flex-end"
                }
              },
              "children": [
                {
                  "componentName": "Pagination",
                  "id": "node_dockd5nrh9pf",
                  "props": {
                    "prefix": "next-",
                    "type": "normal",
                    "shape": "normal",
                    "size": "medium",
                    "defaultCurrent": 1,
                    "total": 100,
                    "pageShowCount": 5,
                    "pageSize": 10,
                    "pageSizePosition": "start",
                    "showJump": true,
                    "style": {}
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "componentName": "Dialog",
      "id": "node_dockcy8n9xe1h",
      "props": {
        "prefix": "next-",
        "footerAlign": "right",
        "footerActions": [
          "ok",
          "cancel"
        ],
        "closeable": "esc,close",
        "hasMask": true,
        "align": "cc cc",
        "minMargin": 40,
        "visible": {
          "type": "JSExpression",
          "value": "this.state.isShowDialog"
        },
        "title": "标题",
        "events": [],
        "__events": [
          {
            "type": "componentEvent",
            "name": "onCancel",
            "relatedEventName": "closeDialog"
          },
          {
            "type": "componentEvent",
            "name": "onClose",
            "relatedEventName": "closeDialog"
          },
          {
            "type": "componentEvent",
            "name": "onOk",
            "relatedEventName": "testFunc"
          }
        ],
        "onCancel": {
          "type": "JSFunction",
          "value": "function(){ this.closeDialog() }"
        },
        "onClose": {
          "type": "JSFunction",
          "value": "function(){ this.closeDialog() }"
        },
        "onOk": {
          "type": "JSFunction",
          "value": "function(){ this.testFunc() }"
        }
      },
      "children": [
        {
          "componentName": "Form",
          "id": "node_dockd5nrh9pi",
          "props": {
            "inline": false,
            "labelAlign": "top",
            "labelTextAlign": "right",
            "size": "medium"
          },
          "children": [
            {
              "componentName": "Form.Item",
              "id": "node_dockd5nrh9pj",
              "props": {
                "style": {
                  "marginBottom": "0",
                  "minWidth": "200px",
                  "minHeight": "28px"
                },
                "label": "商品类目"
              },
              "children": [
                {
                  "componentName": "Select",
                  "id": "node_dockd5nrh9pk",
                  "props": {
                    "mode": "single",
                    "hasArrow": true,
                    "cacheValue": true
                  }
                }
              ]
            },
            {
              "componentName": "Form.Item",
              "id": "node_dockd5nrh9pl",
              "props": {
                "style": {
                  "marginBottom": "0",
                  "minWidth": "200px",
                  "minHeight": "28px"
                },
                "label": "商品类目"
              },
              "children": [
                {
                  "componentName": "Select",
                  "id": "node_dockd5nrh9pm",
                  "props": {
                    "mode": "single",
                    "hasArrow": true,
                    "cacheValue": true
                  }
                }
              ]
            },
            {
              "componentName": "Form.Item",
              "id": "node_dockd5nrh9pn",
              "props": {
                "style": {
                  "marginBottom": "0",
                  "minWidth": "200px",
                  "minHeight": "28px"
                },
                "label": "商品类目",
                "asterisk": true
              },
              "children": [
                {
                  "componentName": "Select",
                  "id": "node_dockd5nrh9po",
                  "props": {
                    "mode": "single",
                    "hasArrow": true,
                    "cacheValue": true
                  }
                }
              ]
            },
            {
              "componentName": "Form.Item",
              "id": "node_dockd5nrh9pp",
              "props": {
                "style": {
                  "marginBottom": "0",
                  "minWidth": "200px",
                  "minHeight": "28px"
                },
                "label": "商品类目"
              },
              "children": [
                {
                  "componentName": "Input",
                  "id": "node_dockd5nrh9pr",
                  "props": {
                    "hasBorder": true,
                    "size": "medium",
                    "autoComplete": "off"
                  }
                },
              ]
            },
          ]
        },
      ]
    },
    {
      "componentName": "ErrorComponent",
      "id": "node_dockd5nrh9pr",
      "props": {
        "name": "error"
      }
    }
  ]
}