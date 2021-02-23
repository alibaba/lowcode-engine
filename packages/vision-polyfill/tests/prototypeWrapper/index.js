// const { Bundle } = window.VisualEngine;
// Bundle.registerPrototypeConfigPreprocessor('aaa', (componentName, config) => {
//   if (componentName === 'Text') {
//     config.configure[0].initialValue.zh_CN = 'XXXXXXXXXX';
//     return {
//       ...config,
//     };
//   }
// });

// Bundle.registerPrototypeViewWrapper('aaa', function (componentName, View) {
//   return componentName === 'Text'
//     ? class Wrapper extends window.React.Component {
//         render() {
//           return (
//             <div>
//               <View {...this.props}/>
//               <div>AAAAAA</div>
//             </div>
//           );
//         }
//       }
//     : null;
// });
