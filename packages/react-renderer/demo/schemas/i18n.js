export default {
  componentName: 'Page',
  fileName: 'i18n',
  props: {},
  children: [{
    componentName: 'Div',
    props: {},
    children: [{
      componentName: 'Text',
      props: {
        text: "{{this.i18n('hello')}}",
      },
    }, {
      componentName: 'Text',
      props: {
        text: "{{this.i18n('china')}}",
      },
    }],
  }],
};
