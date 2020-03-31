import { contribution, run } from '@ali/lowcode-runtime';
import Renderer from '@ali/lowcode-react-renderer';
import FusionLoading from './plugins/loading/fusion';
import BasicLayout from './layouts/BasicLayout';
import Preview from './plugins/provider';

// 注册渲染模块
contribution.registerRenderer(Renderer);

// 注册布局组件，可注册多个
contribution.registerLayout('BasicLayout', BasicLayout);

// 注册页面 Loading
contribution.registerLoading(FusionLoading);

// appKey：应用唯一标识
contribution.registerProvider(new Preview({ appKey: 'lowcode_demo' }));

// 启动应用
run();
