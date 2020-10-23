/* eslint-disable */
export default {
  componentName: 'Page',
  fileName: 'compose',
  props: {
  },
  children: [
    {
      "componentName": "Dropdown",
      "props": {
        "trigger": [
          {
            "componentName": "Button",
            "props": {
              "type": "primary"
            },
            "children": "确定"  
          }
        ],  
        "triggerType": "click"
      },
      "children": [
        {
          "componentName": "Menu",
          "props": {
            "style": {
              "width": 200
            }  
          },
          "children": [
            { "componentName": "MenuItem", "props": {}, "children": "Option 1"  },
            { "componentName": "MenuItem", "props": { "disabled": false }, "children": "option 2" },
            { "componentName": "MenuItem", "props": { "disabled": false }, "children": "option 3" }
          ]
        }
      ]
    },
    {
      "componentName": "Menu",
      "props": {
        "style": {
          "width": 200
        }
      },
      "children": [
        {
          "componentName": "MenuItem",
          "props": {
          },
          "children": "Option 1"
        }, 
        {
          "componentName": "MenuItem",
          "props": {
          },
          "children": "Option 2"
        }
      ]
    }
  ]
};
