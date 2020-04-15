import React, { PureComponent } from 'react';
import './index.scss';
import Editor, { PluginProps } from '@ali/lowcode-editor-core';
import { TopIcon } from '@ali/lowcode-editor-skeleton';
import { Designer } from '@ali/lowcode-designer';

export interface IProps {
  editor: Editor;
  logo?: string;
}

export interface IState {
  undoEnable: boolean;
  redoEnable: boolean;
}

export default class UndoRedo extends PureComponent<
  IProps & PluginProps,
  IState
> {
  public static display = 'LowcodeUndoRedo';

  private history: any;

  constructor(props: any) {
    super(props);
    this.state = {
      undoEnable: false,
      redoEnable: false,
    };
  }

  componentDidMount(): void {
    const { editor } = this.props;
    editor.on('designer.history-change', this.handleHistoryChange);

    const designer = editor.get(Designer);
    if (designer) {
      this.history = designer.currentHistory;
      this.updateState(this.history?.getState() || 0);
    } else {
      editor.once('designer.ready', (): void => {
        this.history = editor.get(Designer)?.currentHistory;
        this.updateState(this.history?.getState() || 0);
      });
    }
  }

  componentWillUnmount(): void {
    const { editor } = this.props;
    editor.off('designer.history-change', this.handleHistoryChange);
  }

  handleHistoryChange = (history: any): void => {
    this.history = history;
    this.updateState(this.history?.getState() || 0);
  };

  init = (): void => {
    const { editor } = this.props;

    this.history = editor.get(Designer)?.currentHistory;
    this.updateState(this.history?.getState() || 0);

    editor.on('designer.history-change', (history: any): void => {
      this.history = history;
      this.updateState(this.history?.getState() || 0);
    });
  };

  updateState = (state: number): void => {
    this.setState({
      undoEnable: !!(state & 1),
      redoEnable: !!(state & 2),
    });
  };

  handleUndoClick = (): void => {
    this.history?.back();
  };

  handleRedoClick = (): void => {
    this.history?.forward();
  };

  render(): React.ReactNode {
    const { undoEnable, redoEnable } = this.state;
    return (
      <div className="lowcode-plugin-undo-redo">
        <TopIcon
          icon="houtui"
          title="后退"
          disabled={!undoEnable}
          onClick={this.handleUndoClick}
        />
        <TopIcon
          icon="qianjin"
          title="前进"
          disabled={!redoEnable}
          onClick={this.handleRedoClick}
        />
      </div>
    );
  }
}
