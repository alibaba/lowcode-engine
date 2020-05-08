---
category: Components
subtitle: 上传
type: 数据录入
title: Upload
---

文件选择上传和拖拽上传控件。

## 何时使用

上传是将信息（网页、文字、图片、视频等）通过网页或者上传工具发布到远程服务器上的过程。

- 当需要上传一个或一些文件时。
- 当需要展现上传的进度时。
- 当需要使用拖拽交互时。

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| accept | 接受上传的文件类型, 详见 [input accept Attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept) | string | 无 |  |
| action | 上传的地址 | string\|(file) => `Promise` | 无 |  |
| method | 上传请求的 http method | string | 'post' |  |
| directory | 支持上传文件夹（[caniuse](https://caniuse.com/#feat=input-file-directory)） | boolean | false |  |
| beforeUpload | 上传文件之前的钩子，参数为上传的文件，若返回 `false` 则停止上传。支持返回一个 Promise 对象，Promise 对象 reject 时则停止上传，resolve 时开始上传（ resolve 传入 `File` 或 `Blob` 对象则上传 resolve 传入对象）。**注意：IE9 不支持该方法**。 | (file, fileList) => `boolean | Promise` | 无 |  |
| customRequest | 通过覆盖默认的上传行为，可以自定义自己的上传实现 | Function | 无 |  |
| data | 上传所需额外参数或返回上传额外参数的方法 | object\|(file) => object | 无 |  |
| defaultFileList | 默认已经上传的文件列表 | object\[] | 无 |  |
| disabled | 是否禁用 | boolean | false |  |
| fileList | 已经上传的文件列表（受控），使用此参数时，如果遇到 `onChange` 只调用一次的问题，请参考 [#2423](https://github.com/ant-design/ant-design/issues/2423) | object\[] | 无 |  |
| headers | 设置上传的请求头部，IE10 以上有效 | object | 无 |  |
| listType | 上传列表的内建样式，支持三种基本样式 `text`, `picture` 和 `picture-card` | string | 'text' |  |
| multiple | 是否支持多选文件，`ie10+` 支持。开启后按住 ctrl 可选择多个文件 | boolean | false |  |
| name | 发到后台的文件参数名 | string | 'file' |  |
| previewFile | 自定义文件预览逻辑 | (file: File \| Blob) => Promise<dataURL: string> | 无 |  |
| showUploadList | 是否展示文件列表, 可设为一个对象，用于单独设定 `showPreviewIcon`, `showRemoveIcon`, `showDownloadIcon`, `removeIcon` 和 `downloadIcon` | Boolean or { showPreviewIcon?: boolean, showRemoveIcon?: boolean, showDownloadIcon?: boolean, removeIcon?: React.ReactNode, downloadIcon?: React.ReactNode } | true |  |
| supportServerRender | 服务端渲染时需要打开这个 | boolean | false |  |
| withCredentials | 上传请求时是否携带 cookie | boolean | false |  |
| openFileDialogOnClick | 点击打开文件对话框 | boolean | true |  |
| onChange | 上传文件改变时的状态，详见 [onChange](#onChange) | Function | 无 |  |
| onPreview | 点击文件链接或预览图标时的回调 | Function(file) | 无 |  |
| onRemove   | 点击移除文件时的回调，返回值为 false 时不移除。支持返回一个 Promise 对象，Promise 对象 resolve(false) 或 reject 时不移除。               | Function(file): `boolean | Promise` | 无   |  |
| onDownload | 点击下载文件时的回调，如果没有指定，则默认跳转到文件 url 对应的标签页。 | Function(file): void | 跳转新标签页 |  |
| transformFile   | 在上传之前转换文件。支持返回一个 Promise 对象   | Function(file): `string | Blob | File | Promise<string | Blob | File>` | 无   |  |
| iconRender | 自定义显示 icon | (file: UploadFile, listType?: UploadListType) => React.ReactNode | 无 |  |

### onChange

> 上传中、完成、失败都会调用这个函数。

文件状态改变的回调，返回为：

```js
{
  file: { /* ... */ },
  fileList: [ /* ... */ ],
  event: { /* ... */ },
}
```

1. `file` 当前操作的文件对象。

   ```js
   {
      uid: 'uid',      // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
      name: 'xx.png'   // 文件名
      status: 'done', // 状态有：uploading done error removed
      response: '{"status": "success"}', // 服务端响应内容
      linkProps: '{"download": "image"}', // 下载链接额外的 HTML 属性
   }
   ```

2. `fileList` 当前的文件列表。
3. `event` 上传中的服务端响应内容，包含了上传进度等信息，高级浏览器支持。

## FAQ

### 服务端如何实现？

- 服务端上传接口实现可以参考 [jQuery-File-Upload](https://github.com/blueimp/jQuery-File-Upload/wiki#server-side)。
- 如果要做本地 mock 可以参考这个 [express 的例子](https://github.com/react-component/upload/blob/master/server.js)。

### 如何显示下载链接？

请使用 fileList 属性设置数组项的 url 属性进行展示控制。

### `customRequest` 怎么使用？

请参考 <https://github.com/react-component/upload#customrequest>。
