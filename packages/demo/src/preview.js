import { run, Boot } from '@ali/lowcode-runtime';
import Renderer from '@ali/lowcode-react-renderer';
import FusionLoading from './preview/plugins/loading/fusion';
import BasicLayout from './preview/layouts/BasicLayout';
import provider from './preview/plugins/provider';

// 注册渲染模块
Boot.registerRenderer(Renderer);

// 注册布局组件，可注册多个
Boot.registerLayout('BasicLayout', BasicLayout);

// 注册页面 loading
Boot.registerLoading(FusionLoading);

const appProvider = provider.create('lowcode_demo'); // 入参为应用唯一标识

// 异步加载应用配置
appProvider.then(({ App, config }) => {
  // 启动应用
  run(App, config);
});
