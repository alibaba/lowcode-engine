import { Outlet } from 'ice';
import BasicLayout from '@/layouts/BasicLayout';

export default function Layout() {
  return (
    <BasicLayout>
      <Outlet />
    </BasicLayout>
  );
}
