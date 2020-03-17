/**
 * The template of manifest for AiMake studio.
 */
var manifest = {
  // The name of current component.
  name: 'AIMakeText',
  // The description of current component.
  description: '富文本',
  // The coverimage's url of current component.
  coverImage: 'https://img.alicdn.com/tfs/TB15R_xVzDpK1RjSZFrXXa78VXa-192-48.png',
  // The category of current component in AiMake studio.
  // can be:
  // `分栏` or `文本` or `按钮` or `标签` or `标签页` or `表格` or `单选` or `分割线`
  // or `分页` or `复选` or `滑动条` or `进度条` or `卡片` or `开关` or `缺省状态`
  // or `日期选择` or `输入框` or `搜索框` or `图表` or `图片` or `下拉选择` or `表单行`
  // or `树控件` or `折叠面板` or `占位图`
  category: '文本',
  // The preview list of current component in AiMake studio.
  // Each preset contains following keys:
  // - `alias`: string. required. The previewing component's name to display
  // - `thumbnail`: string. not required. The previewing component's thumbnail
  // - `customProps`: object. not required.
  // The previewing component's customize props, e.g. { [propName]: [propValue] }
  // - `colSpan`: number. not required. default 24 (1~24). The previewing component's size when to display
  presets: [{
    alias: '富文本',
    thumbnail: 'https://img.alicdn.com/tfs/TB15R_xVzDpK1RjSZFrXXa78VXa-192-48.png',
    colSpan: 12,
    customProps: {
      type: 'label',
      fontSize: '12px',
      fontWeight: 'normal',
      children: '文本内容'
    }
  }],
  // Other settings of current component for AiMake studio.
  settings: {
    // The render type of current component in AiMake studio.
    // can be:
    // `element_inline` or `element_block` or `container`
    type: 'element_inline',
    // The insert mode of current component in AiMake studio.
    // can be:
    // one or combine of `t` and `b` and `r` and `l`
    insertionModes: 'tbrl',
    // The handle list of current component in AiMake studio.
    // can be:
    // an array contains one and more of ['cut', 'copy', 'paste', 'delete', 'duplicate']
    handles: ['cut', 'copy', 'paste', 'delete', 'duplicate'],
    // Whether the component can be actived.
    shouldActive: true,
    // Whether the component can be dragged.
    shouldDrag: true,
    // The props of current component in AiMake studio.
    // Each property contains following keys:
    // - `name`: string. required. The property's name
    // - `label`: string. required. The property's name to display
    // - `renderer`: string. required. The property's editor. can be: (@冰骊)
    // - `defaultValue`: any. not required. The property's default value
    // - `params`: any. not required. The parameters for property's editor
    // - `placeholder`: string. not required. The placeholder for property's editor
    // - `hint`: string. not required. The hint for property's editor
    props: [{
      name: 'type',
      label: '类型',
      renderer: 'Select',
      defaultValue: 'label',
      params: [{
        label: '一级标题',
        value: 'h1'
      }, {
        label: '二级标题',
        value: 'h2'
      }, {
        label: '三级标题',
        value: 'h3'
      }, {
        label: '段落',
        value: 'p'
      }, {
        label: '标签',
        value: 'label'
      }]
    }, {
      name: 'margin',
      label: '外边距',
      renderer: 'Quadrant'
    }, {
      name: 'color',
      label: '文字颜色',
      renderer: 'Color'
    }, {
      name: 'fontSize',
      label: '字号',
      renderer: 'FontSize',
      defaultValue: '12px'
    }, {
      name: 'fontWeight',
      label: '字重',
      renderer: 'FontWeight',
      defaultValue: 'normal'
    }, {
      name: 'lineHeight',
      label: '行高',
      defaultValue: undefined,
      renderer: 'LineHeight'
    }, {
      name: 'children',
      label: '内容',
      defaultValue: '文本内容',
      renderer: 'TextArea'
    }]
  }
};
export default manifest;