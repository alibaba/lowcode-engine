export default {
  plugins: {
    topArea: [
      {
        pluginKey: 'logo',
        type: 'Custom',
        props: {
          align: 'left',
          width: 100,
        },
        pluginProps: {
          logo: 'https://img.alicdn.com/tfs/TB1_SocGkT2gK0jSZFkXXcIQFXa-66-66.png',
          href: '/',
        },
      },
      /*
      {
        pluginKey: 'undoRedo',
        type: 'Custom',
        props: {
          align: 'right',
          width: 88,
        },
      },
      {
        pluginKey: 'divider',
        type: 'Divider',
        props: {
          align: 'right',
        },
      },*/
      {
        pluginKey: 'samplePreview',
        type: 'Custom',
        props: {
          align: 'right',
          width: 64,
        },
      },
    ],
    leftArea: [
      {
        pluginKey: 'componentsPane',
        type: 'PanelIcon',
        props: {
          align: 'top',
          icon: 'zujianku',
          description: '组件库',
        },
        pluginProps: {},
      },
      {
        pluginKey: 'outline',
        type: 'PanelIcon',
        props: {
          align: 'top',
          icon: 'shuxingkongjian',
          description: '大纲树',
        },
        pluginProps: {},
      },
      {
        pluginKey: 'sourceEditor',
        type: 'PanelIcon',
        props: {
          align: 'top',
          icon: 'zujianku',
          panelProps: {
            floatable: true,
            defaultWidth: 500,
          },
        },
        pluginProps: {},
      },
      {
        pluginKey: 'zhEn',
        type: 'Custom',
        props: {
          align: 'bottom',
        },
        pluginProps: {},
      },
    ],
    /*
    centerArea: [
      {
        pluginKey: 'eventBindDialog',
      },
      {
        pluginKey: 'variableBindDialog',
      },
    ],*/
  },
  shortCuts: [],
  lifeCycles: {
    init: async function init(editor) {
      const assets = await editor.utils.get('./assets.json');
      editor.set('assets', assets);

      const schema = await editor.utils.get('./schema.json');
      editor.set('schema', schema);
    },
  },
};
