/**
 * The template of manifest for AiMake studio.
 */

function _update(Nygma, node) {
  const attributes = node.get();
  const {
    display,
    flexDirection,
    alignItems,
    justifyContent,
    flexWrap,
  } = attributes;
  const isFlex = display === 'flex';
  node.set({
    display,
    flexDirection: isFlex ? flexDirection : undefined,
    alignItems: isFlex ? alignItems : undefined,
    justifyContent: isFlex ? justifyContent : undefined,
    flexWrap: isFlex ? flexWrap : undefined,
  });
}

const manifest = {
  // The name of current component.
  name: 'AIMakeBlank',
  // The description of current component.
  description: '空白卡片',
  // The coverimage's url of current component.
  coverImage:
    'https://img.alicdn.com/tfs/TB1un9tqntYBeNjy1XdXXXXyVXa-366-124.png',
  // The category of current component in AiMake studio.
  // can be:
  // `分栏` or `文本` or `按钮` or `标签` or `标签页` or `表格` or `单选` or `分割线`
  // or `分页` or `复选` or `滑动条` or `进度条` or `卡片` or `开关` or `缺省状态`
  // or `日期选择` or `输入框` or `搜索框` or `图表` or `图片` or `下拉选择` or `表单行`
  // or `树控件` or `折叠面板` or `占位图`
  category: '布局', // card.blank
  // The preview list of current component in AiMake studio.
  // Each preset contains following keys:
  // - `alias`: string. required. The previewing component's name to display
  // - `thumbnail`: string. not required. The previewing component's thumbnail
  // - `customProps`: object. not required.
  // The previewing component's customize props, e.g. { [propName]: [propValue] }
  // - `colSpan`: number. not required. default 24 (1~24). The previewing component's size when to display
  presets: [
    {
      alias: '空白卡片',
      thumbnail:
        'https://img.alicdn.com/tfs/TB1ucPNVsbpK1RjSZFyXXX_qFXa-198-120.png',
      colSpan: 12,
      customProps: {
        id: '',
        textAlign: 'left',
        padding: '12px',
        width: '100%',
        backgroundColor: '#FFF',
      },
    },
  ],
  // Other settings of current component for AiMake studio.
  settings: {
    // The render type of current component in AiMake studio.
    // can be:
    // `element_inline` or `element_block` or `container`
    type: 'container',
    // The insert mode of current component in AiMake studio.
    // can be:
    // one or combine of `t` and `b` and `r` and `l`
    insertionModes: 'tbrlv',
    // The handle list of current component in AiMake studio.
    // can be:
    // an array contains one and more of ['cut', 'copy', 'paste', 'delete', 'duplicate']
    handles: ['cut', 'copy', 'paste', 'delete', 'duplicate'],
    // Whether the component can be actived.
    shouldActive: true,
    // Whether the component can be dragged.
    shouldDrag: true,
    lifeCycle: {
      didMount: (props) => {
        const { Nygma, dragInstance } = props;
        const Drager = dragInstance.NygmaNode;
        _update(Nygma, Drager);
      },
      didUpdate: (Nygma, node, args) => {
        const newvalue = args[1];
        const oldvalue = args[2];
        if (JSON.stringify(newvalue) !== JSON.stringify(oldvalue)) {
          _update(Nygma, node);
        }
      },
    },
    // The props of current component in AiMake studio.
    // Each property contains following keys:
    // - `name`: string. required. The property's name
    // - `label`: string. required. The property's name to display
    // - `renderer`: string. required. The property's editor. can be: (@冰骊)
    // - `defaultValue`: any. not required. The property's default value
    // - `params`: any. not required. The parameters for property's editor
    // - `placeholder`: string. not required. The placeholder for property's editor
    // - `hint`: string. not required. The hint for property's editor
    props: [
      {
        name: 'id',
        label: 'id',
        defaultValue: '',
        renderer: 'Input',
      },
      {
        name: 'textAlign',
        label: '水平对齐',
        defaultValue: 'left',
        renderer: 'TextAlign',
      },
      {
        name: 'margin',
        label: '外边距',
        renderer: 'Quadrant',
      },
      {
        name: 'padding',
        label: '内边距',
        renderer: 'Quadrant',
        defaultValue: '12px',
      },
      {
        name: 'width',
        label: '宽度',
        defaultValue: '100%',
        renderer: 'Width',
      },
      {
        name: 'height',
        label: '高度',
        renderer: 'Height',
        defaultValue: undefined,
      },
      {
        name: 'backgroundColor',
        label: '背景颜色',
        renderer: 'Color',
        defaultValue: '#FFF',
      },
      {
        name: 'border',
        label: '边框',
        renderer: 'BarBorder',
      },
      {
        name: 'display',
        label: '布局设置',
        renderer: 'FlexLayout',
      },
    ],
  },
};

export default manifest;
