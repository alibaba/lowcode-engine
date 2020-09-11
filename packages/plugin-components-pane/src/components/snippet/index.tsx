import { Fragment } from 'react';
import { Icon } from '@alifd/next';
import { AdditiveType } from '../base';
import './index.less';

const Snippet = (props) => {
  const {
    snippet,
    renderCustomSnippet = '',
    size = 'small',
    actionsInLT,
    actionsInRT,
  } = props;
  const {
    thumbnail = 'https://img.alicdn.com/tfs/TB1XHG6ehrI8KJjy0FpXXb5hVXa-740-608.png',
    description,
    title = '未知',
  } = snippet;
  const snippetClassName = `component-description-item-snippet ${AdditiveType.All} ${size}`;
  return (
    <div className={snippetClassName} key={snippet.id} data-id={snippet.id}>
      {typeof renderCustomSnippet === 'function' ? (
        renderCustomSnippet(snippet)
      ) : (
        <Fragment>
          <div className="snippet-thumbnail">
            {typeof thumbnail === 'string' && thumbnail.startsWith('http') ? (
              <img alt="thumbnail" src={thumbnail} />
            ) : (
              <Icon className="icon" type={thumbnail || 'help'} />
            )}
          </div>
          <div className="snippet-title">{description || title}</div>
          <div className="engine-additive-helper left-top">
            {actionsInLT || null}
          </div>
          <div className="engine-additive-helper right-top">
            {actionsInRT || null}
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default Snippet;
