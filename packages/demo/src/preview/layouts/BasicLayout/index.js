import { Search, Icon, Shell } from '@alifd/next';
import './index.scss';

// eslint-disable-next-line react/prop-types
export default ({ name, children, logo }) => (
  <Shell className="basic-shell" style={{ border: '1px solid #eee' }}>
    <Shell.Branding>
      <img src={logo.src} width={logo.width} height={logo.height} alt="logo" />
      <span style={{ marginLeft: 10 }}>{name}</span>
    </Shell.Branding>
    <Shell.Navigation direction="hoz">
      <Search key="2" shape="simple" type="dark" palceholder="Search" style={{ width: '200px' }} />
    </Shell.Navigation>
    <Shell.Action>
      <Icon type="ic_tongzhi" />
      <img src="https://img.alicdn.com/tfs/TB1.ZBecq67gK0jSZFHXXa9jVXa-904-826.png" className="avatar" alt="用户头像" />
      <span style={{ marginLeft: 10 }}>MyName</span>
    </Shell.Action>

    <Shell.Content className="content">{children}</Shell.Content>

    <Shell.Footer>
      <span>Alibaba Fusion</span>
      <span>@ 2019 Alibaba Piecework 版权所有</span>
    </Shell.Footer>
  </Shell>
);
