// 对于 standalone 模式的专门 polyfills
if (process.env.TEST_TARGET === 'standalone') {
  // 模拟浏览器环境
  global.window = global;
  global.self = global;

  // 将所有测试用例里面的 './src' 都替换为 './dist/standalone'
  jest.mock('./src', () => require('./dist/standalone'));
}

// 如果在调试模式下，则不限制超时时间
jest.setTimeout(typeof v8debug === 'object' ? Infinity : 30 * 1000);
