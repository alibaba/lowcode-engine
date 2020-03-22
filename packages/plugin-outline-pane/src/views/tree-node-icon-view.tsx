import React from 'react';
import DIVIcon from 'my-icons/container.svg';
import IMGIcon from 'my-icons/image.svg';
import { observer } from '@ali/recore';

@observer
export default class TreeNodeIconView extends React.Component<{ tagName: string }> {
  shouldComponentUpdate(): boolean {
    return false;
  }

  render() {
    const { tagName } = this.props;
    switch (tagName) {
      case 'img': {
        console.log('>>> tag:', tagName);
        return <IMGIcon />;
      }
      default:
        return <DIVIcon />;
    }
  }
}
