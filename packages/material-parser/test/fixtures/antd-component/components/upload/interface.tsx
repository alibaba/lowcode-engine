import * as React from 'react';

export type UploadFileStatus = 'error' | 'success' | 'done' | 'uploading' | 'removed';

export interface HttpRequestHeader {
  [key: string]: string;
}

export interface RcFile extends File {
  uid: string;
  readonly lastModifiedDate: Date;
  readonly webkitRelativePath: string;
}

export interface RcCustomRequestOptions {
  onProgress: (event: { percent: number }, file: File) => void;
  onError: (error: Error) => void;
  onSuccess: (response: object, file: File) => void;
  data: object;
  filename: string;
  file: File;
  withCredentials: boolean;
  action: string;
  headers: object;
}

export interface UploadFile<T = any> {
  uid: string;
  size: number;
  name: string;
  fileName?: string;
  lastModified?: number;
  lastModifiedDate?: Date;
  url?: string;
  status?: UploadFileStatus;
  percent?: number;
  thumbUrl?: string;
  originFileObj?: File | Blob;
  response?: T;
  error?: any;
  linkProps?: any;
  type: string;
  xhr?: T;
  preview?: string;
}

export interface UploadChangeParam<T extends object = UploadFile> {
  // https://github.com/ant-design/ant-design/issues/14420
  file: T;
  fileList: Array<UploadFile>;
  event?: { percent: number };
}

export interface ShowUploadListInterface {
  showRemoveIcon?: boolean;
  showPreviewIcon?: boolean;
  showDownloadIcon?: boolean;
}

export interface UploadLocale {
  uploading?: string;
  removeFile?: string;
  downloadFile?: string;
  uploadError?: string;
  previewFile?: string;
}

export type UploadType = 'drag' | 'select';
export type UploadListType = 'text' | 'picture' | 'picture-card';

type PreviewFileHandler = (file: File | Blob) => PromiseLike<string>;
type TransformFileHandler = (
  file: RcFile,
) => string | Blob | File | PromiseLike<string | Blob | File>;

export interface UploadProps<T = any> {
  type?: UploadType;
  name?: string;
  defaultFileList?: Array<UploadFile<T>>;
  fileList?: Array<UploadFile<T>>;
  action?: string | ((file: RcFile) => string) | ((file: RcFile) => PromiseLike<string>);
  directory?: boolean;
  data?: object | ((file: UploadFile<T>) => object);
  method?: 'POST' | 'PUT' | 'post' | 'put';
  headers?: HttpRequestHeader;
  showUploadList?: boolean | ShowUploadListInterface;
  multiple?: boolean;
  accept?: string;
  beforeUpload?: (file: RcFile, FileList: RcFile[]) => boolean | PromiseLike<void>;
  onChange?: (info: UploadChangeParam) => void;
  listType?: UploadListType;
  className?: string;
  onPreview?: (file: UploadFile<T>) => void;
  onDownload?: (file: UploadFile<T>) => void;
  onRemove?: (file: UploadFile<T>) => void | boolean | Promise<void | boolean>;
  supportServerRender?: boolean;
  style?: React.CSSProperties;
  disabled?: boolean;
  prefixCls?: string;
  customRequest?: (options: RcCustomRequestOptions) => void;
  withCredentials?: boolean;
  openFileDialogOnClick?: boolean;
  locale?: UploadLocale;
  id?: string;
  previewFile?: PreviewFileHandler;
  transformFile?: TransformFileHandler;
  iconRender?: (file: UploadFile<T>, listType?: UploadListType) => React.ReactNode;
}

export interface UploadState<T = any> {
  fileList: UploadFile<T>[];
  dragState: string;
}

export interface UploadListProps<T = any> {
  listType?: UploadListType;
  onPreview?: (file: UploadFile<T>) => void;
  onDownload?: (file: UploadFile<T>) => void;
  onRemove?: (file: UploadFile<T>) => void | boolean;
  items?: Array<UploadFile<T>>;
  progressAttr?: Object;
  prefixCls?: string;
  showRemoveIcon?: boolean;
  showDownloadIcon?: boolean;
  showPreviewIcon?: boolean;
  removeIcon?: React.ReactNode;
  downloadIcon?: React.ReactNode;
  locale: UploadLocale;
  previewFile?: PreviewFileHandler;
  iconRender?: (file: UploadFile<T>, listType?: UploadListType) => React.ReactNode;
}
