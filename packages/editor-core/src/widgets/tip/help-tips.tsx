import { IPublicTypeHelpTipConfig, IPublicTypeTipConfig } from '@alilc/lowcode-types';
import { Tip } from './tip';
import { Icon } from '@alifd/next';
import { IconProps } from '@alifd/next/types/icon';

export function HelpTip({
  help,
  direction = 'top',
  size = 'small',
}: {
  help: IPublicTypeHelpTipConfig;
  direction?: IPublicTypeTipConfig['direction'];
  size?: IconProps['size'];
}) {
  if (typeof help === 'string') {
    return (
      <div>
        <Icon type="help" size={size} className="lc-help-tip" />
        <Tip direction={direction}>{help}</Tip>
      </div>
    );
  }

  if (typeof help === 'object' && help.url) {
    return (
      <div>
        <a href={help.url} target="_blank" rel="noopener noreferrer">
          <Icon type="help" size={size} className="lc-help-tip" />
        </a>
        <Tip direction={direction}>{help.content}</Tip>
      </div>
    );
  }
  return (
    <div>
      <Icon type="help" size="small" className="lc-help-tip" />
      <Tip direction={direction}>{help.content}</Tip>
    </div>
  );
}