import React, { PureComponent } from 'react';
import './index.scss';
import { PluginProps } from '../../framework/definitions';
import TopIcon from '../../skeleton/components/TopIcon/index';

export interface IProps {
  logo?: string;
}

export interface IState {
  undoEnable: boolean;
  redoEnable: boolean;
}

export default class UndoRedo extends PureComponent<IProps & PluginProps, IState> {
  public static display = 'LowcodeUndoRedo';

  private history: any;

  constructor(props) {
    super(props);
    this.state = {
      undoEnable: false,
      redoEnable: false
    };
    if (props.editor.designer) {
      this.init();
    } else {
      props.editor.on('designer.ready', (): void => {
        this.init();
      });
    }
  }

  init = (): void => {
    const { editor } = this.props;
    this.history = editor.designer.currentHistory;
    this.updateState(this.history.getState());
    editor.on('designer.history-change', (history): void => {
      this.history = history;
      this.history.onStateChange(this.updateState);
    });
    this.history.onStateChange(this.updateState);
  };

  updateState = (state: number): void => {
    console.log('++++', !!(state & 1), !!(state & 2));
    this.setState({
      undoEnable: !!(state & 1),
      redoEnable: !!(state & 2)
    });
  };

  handleUndoClick = (): void => {
    if (this.history) {
      this.history.back();
    }
  };

  handleRedoClick = (): void => {
    if (this.history) {
      this.history.forward();
    }
  };

  render(): React.ReactNode {
    const { undoEnable, redoEnable } = this.state;
    return (
      <div className="lowcode-plugin-undo-redo">
        <TopIcon icon="houtui" title="后退" disabled={!undoEnable} onClick={this.handleUndoClick} />
        <TopIcon icon="qianjin" title="前进" disabled={!redoEnable} onClick={this.handleRedoClick} />
      </div>
    );
  }
}
