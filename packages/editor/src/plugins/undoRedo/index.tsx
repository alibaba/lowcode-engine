import React, { PureComponent } from 'react';
import './index.scss';
import Editor from '../../framework/index';
import { PluginConfig } from '../../framework/definitions';
import TopIcon from '../../skeleton/components/TopIcon/index';

export interface PluginProps {
  editor: Editor;
  config: PluginConfig;
  logo?: string;
}

export interface PluginState{
  backEnable: boolean;
  forwardEnable: boolean;
};


export default class UndoRedo extends PureComponent<PluginProps, PluginState> {
  static display = 'LowcodeUndoRedo';

  constructor(props) {
    super(props);
    this.state = {
      backEnable: false,
      forwardEnable: false
    };
    if (props.editor.designer) {
      this.init();
    } else {
      props.editor.on('designer.ready', () => {
        this.init();
      });
    }

  }

  init = (): void => {
    const {editor} = this.props;
    this.designer = editor.designer;
    this.history = this.designer.currentHistory;
    editor.on('designer.history-change', (history) => {
      this.history = history;
    });
  };

  handleBackClick = (): void => {
    if (this.history) {
      this.history.back();
    }
  };

  handleForwardClick = (): void => {
    if (this.history) {
      this.history.forward();
    }
  };

  render() {
    const {
      backEnable,
      forwardEnable
    } = this.state;
    return (
      <div className="lowcode-plugin-undo-redo">
        <TopIcon icon="houtui" title="后退"  onClick={this.handleBackClick}/>
        <TopIcon icon="qianjin" title="前进" onClick={this.handleForwardClick}/>
      </div>
    );
  }
}
