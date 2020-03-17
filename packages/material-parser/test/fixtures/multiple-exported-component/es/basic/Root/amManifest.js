var manifest = {
  name: 'Root',
  description: '底板',
  coverImage: '',
  category: '',
  presets: [],
  settings: {
    type: 'container',
    insertionModes: 'v',
    handles: ['paste'],
    shouldActive: true,
    shouldDrag: false,
    props: [{
      name: 'padding',
      label: '内边距',
      renderer: 'Quadrant'
    }, {
      name: 'backgroundColor',
      label: '背景颜色',
      defaultValue: '#F5F6FA',
      renderer: 'Color'
    }]
  }
};
export default manifest;