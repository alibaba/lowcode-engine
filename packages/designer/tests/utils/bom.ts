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
  }
})

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