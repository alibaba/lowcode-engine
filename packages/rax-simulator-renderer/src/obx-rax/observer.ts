import { FunctionComponent, ComponentType } from 'react';
import { Component } from 'rax';
import { Reaction } from './reaction';
import { shallowEqual } from './utils';

const SYMBOL_REACTION = Symbol('__obxReaction');
const SYMBOL_ISUNMOUNTED = Symbol('__obxIsUnmounted');

/**
 * ReactiveMixin
 */
function defaultComponentWillUnmount(this: any) {
  this.render[SYMBOL_REACTION] && this.render[SYMBOL_REACTION].sleep();
  this[SYMBOL_ISUNMOUNTED] = true;
}

function defaultShouldComponentUpdate(this: any, nextProps: any, nextState: any) {
  if (this.state !== nextState) {
    return true;
  }
  return !shallowEqual(this.props, nextProps);
}

// function shouldConstruct(C: any) {
//   const prototype = C.prototype;
//   return !!(prototype && prototype.isReactComponent);
// }

function shouldConstruct(C: any) {
  const prototype = C.prototype;
  return !!(prototype && prototype.constructor);
}

function isFunctionComponent<T = any>(type: Function): type is FunctionComponent<T> {
  return !shouldConstruct(type);
}

export function getReaction(target: Component): Reaction | undefined {
  return (target.render as any)[SYMBOL_REACTION];
}

/**
 * Observer function / decorator
 */
export function observer<T extends ComponentType<any>>(target: T): T {
  if (!target) {
    throw new Error('Please pass a valid component to "observer"');
  }
  if (typeof target !== 'function') {
    throw new Error('obx observer: needs to be a react class constructor or stateless function components');
  }

  let componentClass: any = target;

  if (isFunctionComponent(target)) {
    componentClass = class extends Component {
      static displayName = componentClass.displayName || componentClass.name;
      static contextTypes = componentClass.contextTypes;
      static propTypes = componentClass.propTypes;
      static defaultProps = componentClass.defaultProps;

      render() {
        return target.call(this, this.props, this.context);
      }
    };
  }

  const proto = componentClass.prototype || componentClass;
  mixinLifecycleEvents(proto);
  componentClass.isObxReactObserver = true;
  const baseRender = proto.render;
  proto.render = function() {
    return makeComponentReactive.call(this, baseRender);
  };
  return componentClass;
}

function makeComponentReactive(this: any, render: any) {
  function reactiveRender() {
    isRenderingPending = false;
    let exception = undefined;
    let rendering = undefined;
    reaction.track(() => {
      try {
        rendering = baseRender();
      } catch (e) {
        exception = e;
      }
    });
    if (exception) {
      throw exception;
    }
    return rendering || baseRender();
  }

  // Generate friendly name for debugging
  const initialName =
    this.displayName ||
    this.name ||
    (this.constructor && (this.constructor.displayName || this.constructor.name)) ||
    '<component>';

  const rootNodeID = (this._reactInternalFiber && this._reactInternalFiber._debugID) || '*';

  // wire up reactive render
  const baseRender = render.bind(this);
  let isRenderingPending = false;
  const reaction = new Reaction(
    `${initialName}#${rootNodeID}.render()`,
    () => {
      if (!isRenderingPending) {
        isRenderingPending = true;
        if (typeof this.componentWillReact === 'function') {
          this.componentWillReact();
        }
        if (this[SYMBOL_ISUNMOUNTED] !== true) {
          let hasError = true;
          try {
            Component.prototype.forceUpdate.call(this);
            hasError = false;
          } finally {
            if (hasError) reaction.sleep();
          }
        }
      }
    },
    this.$level || 0,
  );

  (reactiveRender as any)[SYMBOL_REACTION] = reaction;
  this.render = reactiveRender;
  return reactiveRender.call(this);
}

function mixinLifecycleEvents(target: any) {
  if (!target.componentWillUnmount) {
    target.componentWillUnmount = defaultComponentWillUnmount;
  } else {
    const originFunc = target.componentWillUnmount;
    target.componentWillUnmount = function(this: any) {
      originFunc.call(this);
      defaultComponentWillUnmount.call(this);
    };
  }

  if (!target.shouldComponentUpdate) {
    target.shouldComponentUpdate = defaultShouldComponentUpdate;
  }
}
