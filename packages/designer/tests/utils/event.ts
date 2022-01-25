export function getMockEvent(target, options) {
  return {
    target,
    preventDefault() {},
    stopPropagation() {},
    ...options,
  };
}
