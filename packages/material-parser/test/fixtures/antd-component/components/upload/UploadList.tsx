import * as React from 'react';
import Animate from 'rc-animate';
import classNames from 'classnames';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import PaperClipOutlined from '@ant-design/icons/PaperClipOutlined';
import PictureTwoTone from '@ant-design/icons/PictureTwoTone';
import FileTwoTone from '@ant-design/icons/FileTwoTone';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import DownloadOutlined from '@ant-design/icons/DownloadOutlined';

import { UploadListProps, UploadFile, UploadListType } from './interface';
import { previewImage, isImageUrl } from './utils';
import Tooltip from '../tooltip';
import Progress from '../progress';
import { ConfigConsumer, ConfigConsumerProps } from '../config-provider';

export default class UploadList extends React.Component<UploadListProps, any> {
  static defaultProps = {
    listType: 'text' as UploadListType, // or picture
    progressAttr: {
      strokeWidth: 2,
      showInfo: false,
    },
    showRemoveIcon: true,
    showDownloadIcon: false,
    showPreviewIcon: true,
    previewFile: previewImage,
  };

  componentDidUpdate() {
    const { listType, items, previewFile } = this.props;
    if (listType !== 'picture' && listType !== 'picture-card') {
      return;
    }
    (items || []).forEach(file => {
      if (
        typeof document === 'undefined' ||
        typeof window === 'undefined' ||
        !(window as any).FileReader ||
        !(window as any).File ||
        !(file.originFileObj instanceof File || file.originFileObj instanceof Blob) ||
        file.thumbUrl !== undefined
      ) {
        return;
      }
      file.thumbUrl = '';
      if (previewFile) {
        previewFile(file.originFileObj as File).then((previewDataUrl: string) => {
          // Need append '' to avoid dead loop
          file.thumbUrl = previewDataUrl || '';
          this.forceUpdate();
        });
      }
    });
  }

  handlePreview = (file: UploadFile, e: React.SyntheticEvent<HTMLElement>) => {
    const { onPreview } = this.props;
    if (!onPreview) {
      return;
    }
    e.preventDefault();
    return onPreview(file);
  };

  handleDownload = (file: UploadFile) => {
    const { onDownload } = this.props;
    if (typeof onDownload === 'function') {
      onDownload(file);
    } else if (file.url) {
      window.open(file.url);
    }
  };

  handleClose = (file: UploadFile) => {
    const { onRemove } = this.props;
    if (onRemove) {
      onRemove(file);
    }
  };

  handleIconRender = (file: UploadFile) => {
    const { listType, locale, iconRender } = this.props;
    if (iconRender) {
      return iconRender(file, listType);
    }
    const isLoading = file.status === 'uploading';
    const fileIcon = isImageUrl(file) ? <PictureTwoTone /> : <FileTwoTone />;
    let icon: React.ReactNode = isLoading ? <LoadingOutlined /> : <PaperClipOutlined />;
    if (listType === 'picture') {
      icon = isLoading ? <LoadingOutlined /> : fileIcon;
    } else if (listType === 'picture-card') {
      icon = isLoading ? locale.uploading : fileIcon;
    }
    return icon;
  };

  handleActionIconRender = (customIcon: React.ReactNode, callback: () => void, title?: string) => {
    if (React.isValidElement(customIcon)) {
      return React.cloneElement(customIcon, {
        ...customIcon.props,
        title,
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          callback();
          if (customIcon.props.onClick) {
            customIcon.props.onClick(e);
          }
        },
      });
    }
    return (
      <span title={title} onClick={callback}>
        {customIcon}
      </span>
    );
  };

  renderUploadList = ({ getPrefixCls, direction }: ConfigConsumerProps) => {
    const {
      prefixCls: customizePrefixCls,
      items = [],
      listType,
      showPreviewIcon,
      showRemoveIcon,
      showDownloadIcon,
      removeIcon: customRemoveIcon,
      downloadIcon: customDownloadIcon,
      locale,
      progressAttr,
    } = this.props;
    const prefixCls = getPrefixCls('upload', customizePrefixCls);
    const list = items.map(file => {
      let progress;
      const iconNode = this.handleIconRender(file);
      let icon = <div className={`${prefixCls}-text-icon`}>{iconNode}</div>;
      if (listType === 'picture' || listType === 'picture-card') {
        if (file.status === 'uploading' || (!file.thumbUrl && !file.url)) {
          const uploadingClassName = classNames({
            [`${prefixCls}-list-item-thumbnail`]: true,
            [`${prefixCls}-list-item-file`]: file.status !== 'uploading',
          });
          icon = <div className={uploadingClassName}>{iconNode}</div>;
        } else {
          const thumbnail = isImageUrl(file) ? (
            <img
              src={file.thumbUrl || file.url}
              alt={file.name}
              className={`${prefixCls}-list-item-image`}
            />
          ) : (
            iconNode
          );
          const aClassName = classNames({
            [`${prefixCls}-list-item-thumbnail`]: true,
            [`${prefixCls}-list-item-file`]: !isImageUrl(file),
          });
          icon = (
            <a
              className={aClassName}
              onClick={e => this.handlePreview(file, e)}
              href={file.url || file.thumbUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {thumbnail}
            </a>
          );
        }
      }

      if (file.status === 'uploading') {
        // show loading icon if upload progress listener is disabled
        const loadingProgress =
          'percent' in file ? (
            <Progress type="line" {...progressAttr} percent={file.percent} />
          ) : null;

        progress = (
          <div className={`${prefixCls}-list-item-progress`} key="progress">
            {loadingProgress}
          </div>
        );
      }
      const infoUploadingClass = classNames({
        [`${prefixCls}-list-item`]: true,
        [`${prefixCls}-list-item-${file.status}`]: true,
        [`${prefixCls}-list-item-list-type-${listType}`]: true,
      });
      const linkProps =
        typeof file.linkProps === 'string' ? JSON.parse(file.linkProps) : file.linkProps;

      const removeIcon = showRemoveIcon
        ? (customRemoveIcon &&
            this.handleActionIconRender(
              customRemoveIcon,
              () => this.handleClose(file),
              locale.removeFile,
            )) || (
            <DeleteOutlined title={locale.removeFile} onClick={() => this.handleClose(file)} />
          )
        : null;

      const downloadIcon =
        showDownloadIcon && file.status === 'done'
          ? (customDownloadIcon &&
              this.handleActionIconRender(
                customDownloadIcon,
                () => this.handleDownload(file),
                locale.downloadFile,
              )) || (
              <DownloadOutlined
                title={locale.downloadFile}
                onClick={() => this.handleDownload(file)}
              />
            )
          : null;
      const downloadOrDelete = listType !== 'picture-card' && (
        <span
          key="download-delete"
          className={`${prefixCls}-list-item-card-actions ${
            listType === 'picture' ? 'picture' : ''
          }`}
        >
          {downloadIcon && <a title={locale.downloadFile}>{downloadIcon}</a>}
          {removeIcon && <a title={locale.removeFile}>{removeIcon}</a>}
        </span>
      );
      const listItemNameClass = classNames({
        [`${prefixCls}-list-item-name`]: true,
        [`${prefixCls}-list-item-name-icon-count-${
          [downloadIcon, removeIcon].filter(x => x).length
        }`]: true,
      });
      const preview = file.url
        ? [
            <a
              key="view"
              target="_blank"
              rel="noopener noreferrer"
              className={listItemNameClass}
              title={file.name}
              {...linkProps}
              href={file.url}
              onClick={e => this.handlePreview(file, e)}
            >
              {file.name}
            </a>,
            downloadOrDelete,
          ]
        : [
            <span
              key="view"
              className={listItemNameClass}
              onClick={e => this.handlePreview(file, e)}
              title={file.name}
            >
              {file.name}
            </span>,
            downloadOrDelete,
          ];
      const style: React.CSSProperties = {
        pointerEvents: 'none',
        opacity: 0.5,
      };
      const previewIcon = showPreviewIcon ? (
        <a
          href={file.url || file.thumbUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={file.url || file.thumbUrl ? undefined : style}
          onClick={e => this.handlePreview(file, e)}
          title={locale.previewFile}
        >
          <EyeOutlined />
        </a>
      ) : null;

      const actions = listType === 'picture-card' && file.status !== 'uploading' && (
        <span className={`${prefixCls}-list-item-actions`}>
          {previewIcon}
          {file.status === 'done' && downloadIcon}
          {removeIcon}
        </span>
      );

      let message;
      if (file.response && typeof file.response === 'string') {
        message = file.response;
      } else {
        message = (file.error && file.error.statusText) || locale.uploadError;
      }
      const iconAndPreview = (
        <span>
          {icon}
          {preview}
        </span>
      );
      const dom = (
        <div className={infoUploadingClass}>
          <div className={`${prefixCls}-list-item-info`}>{iconAndPreview}</div>
          {actions}
          <Animate transitionName="fade" component="">
            {progress}
          </Animate>
        </div>
      );
      const listContainerNameClass = classNames({
        [`${prefixCls}-list-picture-card-container`]: listType === 'picture-card',
      });
      return (
        <div key={file.uid} className={listContainerNameClass}>
          {file.status === 'error' ? <Tooltip title={message}>{dom}</Tooltip> : <span>{dom}</span>}
        </div>
      );
    });
    const listClassNames = classNames({
      [`${prefixCls}-list`]: true,
      [`${prefixCls}-list-${listType}`]: true,
      [`${prefixCls}-list-rtl`]: direction === 'rtl',
    });
    const animationDirection = listType === 'picture-card' ? 'animate-inline' : 'animate';
    return (
      <Animate
        transitionName={`${prefixCls}-${animationDirection}`}
        component="div"
        className={listClassNames}
      >
        {list}
      </Animate>
    );
  };

  render() {
    return <ConfigConsumer>{this.renderUploadList}</ConfigConsumer>;
  }
}
