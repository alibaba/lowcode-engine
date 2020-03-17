import Dashboard from '@/pages/Dashboard';
import BasicLayout from '@/layouts/BasicLayout';
var routerConfig = [{
  path: '/',
  component: BasicLayout,
  children: [{
    path: '/dashboard',
    component: Dashboard
  }, {
    path: '/',
    redirect: '/dashboard'
  }]
}];
export default routerConfig;