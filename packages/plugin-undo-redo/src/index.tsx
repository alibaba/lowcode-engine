import React, { PureComponent } from 'react';
import './index.scss';
import { PluginProps } from '@ali/lowcode-editor-core/lib/definitions';
import { TopIcon } from '@ali/lowcode-editor-skeleton';

export interface IProps {
  editor: any;
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

  constructor(props) {
    super(props);
    this.state = {
      undoEnable: false,
      redoEnable: false,
    };
  }

  componentDidMount(): void {
    const { editor } = this.props;
    editor.on('designer.history-change', this.handleHistoryChange);

    if (editor.designer) {
      this.history = editor.designer?.currentHistory;
      this.updateState(this.history?.getState() || 0);
    } else {
      editor.once('designer.ready', (): void => {
        this.history = editor.designer?.currentHistory;
        this.updateState(this.history?.getState() || 0);
      });
    }
  }

  componentWillUnmount(): void {
    const { editor } = this.props;
    editor.off('designer.history-change', this.handleHistoryChange);
  }

  handleHistoryChange = (history): void => {
    this.history = history;
    this.updateState(this.history?.getState() || 0);
  };

  init = (): void => {
    const { editor } = this.props;

    this.history = editor.designer?.currentHistory;
    this.updateState(this.history?.getState() || 0);

    editor.on('designer.history-change', (history): void => {
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
