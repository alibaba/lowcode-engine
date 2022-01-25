// 测试 standalone 模式的基本功能
// 注1：指定文件测试就直接在后面加文件: node scripts/test-standalone.js tests/public/rax-app.test.ts
// 注2：指定测试用例就直接在后面加`-t xxx`: node scripts/test-standalone.js tests/public/rax-app.test.ts -t demo01
const { spawnSync } = require('child_process');

// 一定要先构建
spawnSync('npm', ['run', 'build:standalone'], { shell: true, stdio: 'inherit' });

// 然后只执行特定的一些测试用例
spawnSync('npx', ['jest', ...process.argv.slice(2)], {
  env: {
    ...process.env,
    TEST_TARGET: 'standalone',
  },
  shell: true,
  stdio: 'inherit',
});
