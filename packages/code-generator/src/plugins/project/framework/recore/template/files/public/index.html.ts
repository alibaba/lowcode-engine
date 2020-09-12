import { ResultFile } from '@ali/lowcode-types';
import { createResultFile } from '../../../../../../../utils/resultHelper';

export default function getFile(): [string[], ResultFile] {
  const file = createResultFile(
    'index',
    'html',
    `
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, maximum-scale=1.0, user-scalable=no" />
  <title>lowcode-runtime-test</title>
  <link rel="shortcut icon" type="image/png" href="https://img.alicdn.com/tfs/TB1zgoCemrqK1RjSZK9XXXyypXa-96-96.png" />
  <link rel="stylesheet" id="" href="//g.alicdn.com/legao-comp/csxs/1.0.2/web.css?t=1f">
  <script
    src="https://g.alicdn.com/code/lib/??react/16.9.0/umd/react.production.min.js,react-dom/16.9.0/umd/react-dom.production.min.js,prop-types/15.7.2/prop-types.js"></script>
  <!-- React 非压缩版代码，可根据需要替换或通过代理替换后方便调试 -->
  <!-- <script src="https://g.alicdn.com/code/lib/??react/16.9.0/umd/react.development.js,react-dom/16.9.0/umd/react-dom.development.js,prop-types/15.7.2/prop-types.js"></script> -->
  <script src="https://g.alicdn.com/mylib/@ali/recore/1.6.8/umd/recore.min.js"></script>
  <script>
    React.PropTypes = PropTypes;
  </script>
  <style type="text/css">
    body {
      -webkit-overflow-scrolling: touch;
    }
  </style>
</head>

<body>
  <script>
    window.g_config = {
      appKey: 'test', // 乐高应用的 AppKey
      // isSectionalRender: true, // 必填，标记当前为局部使用
      // autoRender: true,
      // index: 'search_form',
    };
  </script>
</body>

</html>
    `,
  );

  return [['public'], file];
}
