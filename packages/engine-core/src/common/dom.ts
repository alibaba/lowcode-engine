import { type IDisposable, isWebKit } from '@alilc/lowcode-shared';

export const DOMEventType = {
  // Mouse
  CLICK: 'click',
  AUXCLICK: 'auxclick',
  DBLCLICK: 'dblclick',
  MOUSE_UP: 'mouseup',
  MOUSE_DOWN: 'mousedown',
  MOUSE_OVER: 'mouseover',
  MOUSE_MOVE: 'mousemove',
  MOUSE_OUT: 'mouseout',
  MOUSE_ENTER: 'mouseenter',
  MOUSE_LEAVE: 'mouseleave',
  MOUSE_WHEEL: 'wheel',
  POINTER_UP: 'pointerup',
  POINTER_DOWN: 'pointerdown',
  POINTER_MOVE: 'pointermove',
  POINTER_LEAVE: 'pointerleave',
  CONTEXT_MENU: 'contextmenu',
  WHEEL: 'wheel',
  // Keyboard
  KEY_DOWN: 'keydown',
  KEY_PRESS: 'keypress',
  KEY_UP: 'keyup',
  // HTML Document
  LOAD: 'load',
  BEFORE_UNLOAD: 'beforeunload',
  UNLOAD: 'unload',
  PAGE_SHOW: 'pageshow',
  PAGE_HIDE: 'pagehide',
  PASTE: 'paste',
  ABORT: 'abort',
  ERROR: 'error',
  RESIZE: 'resize',
  SCROLL: 'scroll',
  FULLSCREEN_CHANGE: 'fullscreenchange',
  WK_FULLSCREEN_CHANGE: 'webkitfullscreenchange',
  // Form
  SELECT: 'select',
  CHANGE: 'change',
  SUBMIT: 'submit',
  RESET: 'reset',
  FOCUS: 'focus',
  FOCUS_IN: 'focusin',
  FOCUS_OUT: 'focusout',
  BLUR: 'blur',
  INPUT: 'input',
  // Local Storage
  STORAGE: 'storage',
  // Drag
  DRAG_START: 'dragstart',
  DRAG: 'drag',
  DRAG_ENTER: 'dragenter',
  DRAG_LEAVE: 'dragleave',
  DRAG_OVER: 'dragover',
  DROP: 'drop',
  DRAG_END: 'dragend',
  // Animation
  ANIMATION_START: isWebKit ? 'webkitAnimationStart' : 'animationstart',
  ANIMATION_END: isWebKit ? 'webkitAnimationEnd' : 'animationend',
  ANIMATION_ITERATION: isWebKit ? 'webkitAnimationIteration' : 'animationiteration',
} as const;

class DomListener implements IDisposable {
  private _handler: (e: any) => void;
  private _node: EventTarget;
  private readonly _type: string;
  private readonly _options: boolean | AddEventListenerOptions;

  constructor(node: EventTarget, type: string, handler: (e: any) => void, options?: boolean | AddEventListenerOptions) {
    this._node = node;
    this._type = type;
    this._handler = handler;
    this._options = options || false;
    this._node.addEventListener(this._type, this._handler, this._options);
  }

  dispose(): void {
    if (!this._handler) {
      // Already disposed
      return;
    }

    this._node.removeEventListener(this._type, this._handler, this._options);

    // Prevent leakers from holding on to the dom or handler func
    this._node = null!;
    this._handler = null!;
  }
}

export function addDisposableListener<K extends keyof GlobalEventHandlersEventMap>(
  node: EventTarget,
  type: K,
  handler: (event: GlobalEventHandlersEventMap[K]) => void,
  useCapture?: boolean,
): IDisposable;
export function addDisposableListener(
  node: EventTarget,
  type: string,
  handler: (event: any) => void,
  useCapture?: boolean,
): IDisposable;
export function addDisposableListener(
  node: EventTarget,
  type: string,
  handler: (event: any) => void,
  options: AddEventListenerOptions,
): IDisposable;
export function addDisposableListener(
  node: EventTarget,
  type: string,
  handler: (event: any) => void,
  useCaptureOrOptions?: boolean | AddEventListenerOptions,
): IDisposable {
  return new DomListener(node, type, handler, useCaptureOrOptions);
}
