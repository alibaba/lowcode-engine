import { app } from '@ali/lowcode-runtime';
import Renderer from '@ali/lowcode-react-renderer';
import FusionLoading from './plugins/loading/fusion';
import BasicLayout from './layouts/BasicLayout';
import Preview from './plugins/provider';

// 注册渲染模块
app.registerRenderer(Renderer);

// 注册布局组件，可注册多个
app.registerLayout(BasicLayout, { componentName: 'BasicLayout' });

// 注册页面 Loading
app.registerLoading(FusionLoading);

// appKey：应用唯一标识
app.registerProvider(Preview);

// 启动应用
app.run();
