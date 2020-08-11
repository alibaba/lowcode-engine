import { Component } from 'rax';

class Leaf extends Component {
  static displayName = 'Leaf';
  static componentMetadata = {
    componentName: 'Leaf',
    configure: {
      props: [{
        name: 'children',
        setter: 'StringSetter',
      }],
      // events/className/style/general/directives
      supports: false,
    }
  };

  render() {
    const { children } = this.props;
    return children;
  }
}

export default Leaf;

// import { Component, createElement } from 'rax';
// import findDOMNode from 'rax-find-dom-node';
// import { each, get, omit } from 'lodash';
// import { getView, setNativeNode, createNodeStyleSheet } from '../renderUtils';

// import { FaultComponent, HiddenComponent, UnknownComponent } from '../UnusualComponent';

// export interface ILeaf {
//   leaf: any;
// }
// export default class Leaf extends Component<ILeaf, {}> {
//   static displayName = 'Leaf';

//   state = {
//     hasError: false,
//   };

//   willDetach: any[];

//   styleSheet: any;

//   context: any;
//   refs: any;

//   componentWillMount() {
//     const { leaf } = this.props;
//     this.willDetach = [
//       leaf.onPropsChange(() => {
//         // 强制刷新
//         this.setState(this.state);
//       }),
//       leaf.onChildrenChange(() => {
//         // 强制刷新
//         this.setState(this.state);
//       }),
//       leaf.onStatusChange((status: { dropping: boolean }, field: string) => {
//         // console.log({...status}, field)
//         if (status.dropping !== false) {
//           // 当 dropping 为 Insertion 对象时，强制渲染会出错，原因待查
//           return;
//         }
//         if (field === 'dragging' || field === 'dropping' || field === 'pseudo' || field === 'visibility') {
//           // 强制刷新
//           this.setState(this.state);
//         }
//       }),
//     ];

//     /**
//      * while props replaced
//      * bind the new event on it
//      */
//     leaf.onPropsReplace(() => {
//       this.willDetach[0]();
//       this.willDetach[0] = leaf.onPropsChange(() => {
//         // 强制刷新
//         this.setState(this.state);
//       });
//     });
//   }

//   componentDidMount() {
//     this.modifyDOM();
//   }

//   shouldComponentUpdate() {
//     // forceUpdate 的替代方案
//     return true;
//     // const pageCanRefresh = this.leaf.getPage().canRefresh();
//     // if (pageCanRefresh) {
//     //   return pageCanRefresh;
//     // }
//     // const getExtProps = obj => {
//     //   const { leaf, ...props } = obj;
//     //   return props;
//     // };
//     // return !shallowEqual(getExtProps(this.props), getExtProps(nextProps));
//   }

//   componentDidUpdate() {
//     this.modifyDOM();
//   }

//   componentWillUnmount() {
//     if (this.willDetach) {
//       this.willDetach.forEach((off) => off());
//     }
//     setNativeNode(this.props.leaf, null);
//   }

//   componentDidCatch() {
//     this.setState({ hasError: true }, () => {
//       console.log('error');
//     });
//   }

//   modifyDOM() {
//     const shell = findDOMNode(this);
//     const { leaf } = this.props;
//     // 与 React 不同，rax 的 findDOMNode 找不到节点时，
//     // shell 会是 <!-- empty -->，而不是 null，
//     // 所以这里进行是否为注释的判断
//     if (shell && shell.nodeType !== window.Node.COMMENT_NODE) {
//       setNativeNode(leaf, shell);
//       if (leaf.getStatus('dragging')) {
//         get(shell, 'classList').add('engine-dragging');
//       } else {
//         get(shell, 'classList').remove('engine-dragging');
//       }
//       each(get(shell, 'classList'), (cls) => {
//         if (cls.substring(0, 8) === '-pseudo-') {
//           get(shell, 'classList').remove(cls);
//         }
//       });
//       const pseudo = leaf.getStatus('pseudo');
//       if (pseudo) {
//         get(shell, 'classList').add(`-pseudo-${pseudo}`);
//       }
//     } else {
//       setNativeNode(leaf, null);
//     }
//   }

//   render() {
//     const props = omit(this.props, ['leaf']);
//     const { leaf } = this.props;
//     const componentName = leaf.getComponentName();

//     const View = getView(componentName);

//     const newProps = {
//       _componentName: componentName,
//     };

//     if (!View) {
//       return createElement(UnknownComponent, {
//         // _componentName: componentName,
//         ...newProps,
//       });
//     }

//     let staticProps = {
//       ...leaf.getStaticProps(false),
//       ...props,
//       _componentName: componentName,
//       _leaf: leaf,
//       componentId: leaf.getId(),
//     };

//     if (!leaf.isVisibleInPane()) {
//       return null;
//     }

//     if (!leaf.isVisible()) {
//       return createElement(HiddenComponent, {
//         ...staticProps,
//       });
//     }

//     if (this.state.hasError) {
//       return createElement(FaultComponent, {
//         // _componentName: componentName,
//         ...newProps,
//       });
//     }

//     if (this.styleSheet) {
//       this.styleSheet.parentNode.removeChild(this.styleSheet);
//     }

//     this.styleSheet = createNodeStyleSheet(staticProps);

//     if (leaf.ableToModifyChildren()) {
//       const children = leaf
//         .getChildren()
//         .filter((child: any) => child.getComponentName() !== 'Slot')
//         .map((child: any) =>
//           createElement(Leaf, {
//             key: child.getId(),
//             leaf: child,
//           }),
//         );
//       // const insertion = leaf.getStatus('dropping');
//       // InsertionGhost 都是React节点,用Rax渲染会报错，后面这些节点需要通过Rax组件来实现
//       // if (children.length < 1 && insertion && insertion.getIndex() !== null) {

//       //   //children = [];
//       //   children = [<InsertionGhost key="insertion" />];
//       // } else if (insertion && insertion.isNearEdge()) {
//       //   if (insertion.isNearAfter()) {
//       //     children.push(<InsertionGhost key="insertion" />);
//       //   } else {
//       //     children.unshift(<InsertionGhost key="insertion" />);
//       //   }
//       // }
//       staticProps = {
//         ...staticProps,
//         ...this.processSlots(this.props.leaf.getChildren()),
//       };

//       return createElement(
//         View,
//         {
//           ...staticProps,
//         },
//         children,
//       );
//     }

//     return createElement(View, {
//       ...staticProps,
//     });
//   }

//   processSlots(children: Rax.RaxNodeArray) {
//     const slots: any = {};
//     children &&
//       children.length &&
//       children.forEach((child: any) => {
//         if (child.getComponentName() === 'Slot') {
//           slots[child.getPropValue('slotName')] = <Leaf key={child.getId()} leaf={child} />;
//         }
//       });
//     return slots;
//   }
// }
