Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

Object.defineProperty(window, 'React', {
  writable: true,
  value: {},
});

window.scrollTo = () => {};
window.console.warn = () => {};
const originalLog = window.console.log;
window.console.log = (...args) => {
  // suppress boring warnings
  if (args[0]?.includes && args[0].includes('@babel/plugin-proposal-private-property-in-object')) return;
  originalLog.apply(window.console, args);
};
window.React = window.React || {};
