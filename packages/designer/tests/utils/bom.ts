import { getMockRenderer } from './renderer';

interface MockDocument extends Document {
  // open(): any;
  // write(): any;
  // close(): any;
  // addEventListener(): any;
  // removeEventListener(): any;
  triggerEventListener(): any;
  // createElement(): any;
  // appendChild(): any;
  // removeChild(): any;
}


const eventsMap : Map<string, Set<Function>> = new Map<string, Set<Function>>();
const mockRemoveAttribute = jest.fn();
const mockAddEventListener = jest.fn((eventName: string, cb) => {
  if (!eventsMap.has(eventName)) {
    eventsMap.set(eventName, new Set([cb]));
    return;
  }
  eventsMap.get(eventName)!.add(cb);
});

const mockRemoveEventListener = jest.fn((eventName: string, cb) => {
  if (!eventsMap.has(eventName)) return;
  if (!cb) {
    eventsMap.delete(eventName);
    return;
  }
  eventsMap.get(eventName)?.delete(cb);
});

const mockTriggerEventListener = jest.fn((eventName: string, data: any, context: object = {}) => {
  if (!eventsMap.has(eventName)) return;
  for (const cb of eventsMap.get(eventName)) {
    cb.call(context, data);
  }
});

const mockCreateElement = jest.fn((tagName) => {
  return {
    style: {},
    appendChild() {},
    addEventListener: mockAddEventListener,
    removeEventListener: mockRemoveEventListener,
    triggerEventListener: mockTriggerEventListener,
    removeAttribute: mockRemoveAttribute,
  };
});

export function getMockDocument(): MockDocument {
  return {
    open() {},
    write() {},
    close() {},
    addEventListener: mockAddEventListener,
    removeEventListener: mockRemoveEventListener,
    triggerEventListener: mockTriggerEventListener,
    createElement: mockCreateElement,
    removeChild() {},
    body: { appendChild() {}, removeChild() {} },
  };
}

export function getMockWindow(doc?: MockDocument) {
  return {
    SimulatorRenderer: getMockRenderer(),
    addEventListener: mockAddEventListener,
    removeEventListener: mockRemoveEventListener,
    triggerEventListener: mockTriggerEventListener,
    document: doc || getMockDocument(),
  };
}

export function clearEventsMap() {
  eventsMap.clear();
}

export function getMockElement(tagName, options = {}) {
  const elem = document.createElement(tagName);
  let {
    width = 0,
    height = 0,
    top = 0,
    bottom = 0,
    left = 0,
    right = 0,
  } = options;
  elem.getBoundingClientRect = () => {
    return {
      width,
      height,
      top,
      bottom,
      left,
      right,
    };
  };
  elem.setWidth = (newWidth) => {
    width = newWidth;
  };
  elem.setHeight = (newHeight) => {
    height = newHeight;
  };
  // console.log(elem.ownerDocument);
  // elem.ownerDocument = document;
  // elem.ownerDocument.defaultView = window;
  return elem;
}
