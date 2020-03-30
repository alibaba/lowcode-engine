import { boot as core, run } from '@ali/lowcode-runtime';
import Renderer from '@ali/lowcode-react-renderer';
import FusionLoading from './preview/plugins/loading/fusion';
import BasicLayout from './preview/layouts/BasicLayout';
import Preview from './preview/plugins/provider';

// 注册渲染模块
core.registerRenderer(Renderer);

// 注册布局组件，可注册多个
core.registerLayout('BasicLayout', BasicLayout);

// 注册页面 Loading
core.registerLoading(FusionLoading);

// appKey：应用唯一标识
core.registerProvider(new Preview({ appKey: 'lowcode_demo' }));

// 启动应用
run();
