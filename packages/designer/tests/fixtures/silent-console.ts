export const mockConsoleError = jest.fn();
export const mockConsoleWarn = jest.fn();
// const mockConsoleInfo = jest.fn();
console.error = mockConsoleError;
console.warn = mockConsoleWarn;

